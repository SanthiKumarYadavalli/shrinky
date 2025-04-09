import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
} from 'chart.js';
import { ClickData } from '@/types';

// Register Chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

interface PieChartProps {
  clicksData: ClickData[];
  attr: string;
  title?: string;
  height?: number;
}

// Beautiful color palette that works well with lightblue background
const colorPalette = [
  'rgba(19, 71, 125, 0.9)',     // Dark blue
  'rgba(64, 145, 223, 0.9)',    // Medium blue
  'rgba(107, 185, 240, 0.9)',   // Light blue
  'rgba(46, 134, 193, 0.9)',    // Sky blue
  'rgba(21, 101, 192, 0.9)',    // Royal blue
  'rgba(33, 150, 243, 0.9)',    // Material blue
  'rgba(66, 165, 245, 0.9)',    // Blue 400
  'rgba(100, 181, 246, 0.9)',   // Blue 300
];

// Lighter border versions of the color palette
const borderPalette = colorPalette.map(color => 
  color.replace(/[\d.]+\)$/, '1)')  // Set opacity to 1
);

const PieChart: React.FC<PieChartProps> = ({
  clicksData,
  attr,
  title = 'Clicks by Device',
  height = 300
}) => {
  const [chartData, setChartData] = useState<ChartData<'pie'>>({
    labels: [],
    datasets: []
  });

  useEffect(() => {
    if (!clicksData.length) return;

    // Process data for device types
    const counts = processData(clicksData.map(item => item[attr]));
    
    setChartData({
      labels: counts.labels,
      datasets: [
        {
          data: counts.counts,
          backgroundColor: colorPalette.slice(0, counts.labels.length),
          borderColor: borderPalette.slice(0, counts.labels.length),
          borderWidth: 2,
          hoverOffset: 15
        }
      ]
    });
  }, [clicksData, attr]);

  const chartOptions: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          boxWidth: 12,
          padding: 20,
          font: {
            family: "'Inter', 'Segoe UI', 'Helvetica', 'Arial', sans-serif",
            size: 12
          },
          color: '#2D3748',
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      title: {
        display: true,
        text: title,
        align: 'start',
        padding: {
          top: 10,
          bottom: 20
        },
        font: {
          family: "'Inter', 'Segoe UI', 'Helvetica', 'Arial', sans-serif",
          size: 16
        },
        color: '#2D3748'
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#2D3748',
        bodyColor: '#2D3748',
        titleFont: {
          family: "'Inter', 'Segoe UI', 'Helvetica', 'Arial', sans-serif",
          size: 13
        },
        bodyFont: {
          family: "'Inter', 'Segoe UI', 'Helvetica', 'Arial', sans-serif",
          size: 12
        },
        padding: 12,
        cornerRadius: 6,
        caretSize: 6,
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((acc: number, data: number) => acc + data, 0);
            const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
    layout: {
      padding: 20
    },
    elements: {
      arc: {
        borderWidth: 2
      }
    }
  };

  return (
    <div className="chart-container" style={{ 
      position: 'relative', 
      height: `${height}px`,
      padding: '20px',
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
      margin: '20px 0'
    }}>
      <Pie data={chartData} options={chartOptions} />
    </div>
  );
};

// Helper function to process data
const processData = (items: Array<string>) => {
  const catMap = new Map<string, number>();
  
  // Count occurrences of each type
  items.forEach(item => {
    catMap.set(item, (catMap.get(item) || 0) + 1);
  });
  
  // Sort by count (descending)
  const sortedCats = Array.from(catMap.entries())
    .sort((a, b) => b[1] - a[1]);
  
  // If there are too many categories, group smaller ones as "Other"
  const MAX_SLICES = 6;
  let labels: string[] = [];
  let counts: number[] = [];
  
  if (sortedCats.length <= MAX_SLICES) {
    labels = sortedCats.map(([device]) => device);
    counts = sortedCats.map(([, count]) => count);
  } else {
    // Take top categories and group the rest as "Other"
    const topCats = sortedCats.slice(0, MAX_SLICES - 1);
    const otherCats = sortedCats.slice(MAX_SLICES - 1);
    
    labels = [...topCats.map(([device]) => device), 'Other'];
    counts = [...topCats.map(([, count]) => count), otherCats.reduce((sum, [, count]) => sum + count, 0)];
  }
  
  return { labels, counts };
};

export default PieChart;