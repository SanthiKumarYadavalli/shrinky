import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
  Filler
} from 'chart.js';
import { ClickData } from '@/types';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ClicksTrendChartProps {
  clicksData: ClickData[];
  title?: string;
  height?: number;
}

const themeColors = {
  primary: 'rgba(19, 71, 125, 0.8)',      // Darker blue
  primaryLight: 'rgba(19, 71, 125, 0.15)', // Lighter blue for fill
  text: '#2D3748',                         // Dark gray for text
  grid: 'rgba(255, 255, 255, 0.6)',        // White with opacity for grid
  point: '#FFFFFF',                        // White for point border
  tooltip: 'rgba(255, 255, 255, 0.95)'     // White with opacity for tooltip
};

const ClicksTrendChart: React.FC<ClicksTrendChartProps> = ({
  clicksData,
  title = 'Clicks Trend',
  height = 300
}) => {
  const [chartData, setChartData] = useState<ChartData<'line'>>({
    labels: [],
    datasets: []
  });


  useEffect(() => {
    if (!clicksData.length) return;

    // Process data based on timeFrame
    const processedData = processClicksData(clicksData);

    setChartData({
      labels: processedData.labels,
      datasets: [
        {
          label: 'Number of Clicks',
          data: processedData.counts,
          fill: true,
          backgroundColor: themeColors.primaryLight,
          borderColor: themeColors.primary,
          borderWidth: 2,
          pointRadius: 4,
          pointBackgroundColor: themeColors.primary,
          pointBorderColor: themeColors.point,
          pointBorderWidth: 2,
          pointHoverRadius: 6,
          pointHoverBackgroundColor: themeColors.primary,
          pointHoverBorderColor: themeColors.point,
          pointHoverBorderWidth: 3,
          tension: 0.4 // Smoother curve
        }
      ]
    });
  }, [clicksData]);

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        align: 'end',
        labels: {
          boxWidth: 12,
          padding: 20,
          font: {
            family: "'Inter', 'Segoe UI', 'Helvetica', 'Arial', sans-serif",
            size: 12
          },
          color: themeColors.text
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
        color: themeColors.text
      },
      tooltip: {
        backgroundColor: themeColors.tooltip,
        titleColor: themeColors.text,
        bodyColor: themeColors.text,
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
        displayColors: false,
        callbacks: {
          title: (context) => {
            return context[0].label;
          },
          label: (context) => {
            return `${context.parsed.y} click${context.parsed.y !== 1 ? 's' : ''}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: themeColors.grid,
          drawTicks: false
        },
        ticks: {
          font: {
            family: "'Inter', 'Segoe UI', 'Helvetica', 'Arial', sans-serif",
            size: 11
          },
          color: themeColors.text,
          padding: 8,
          maxRotation: 45,
          autoSkip: true,
          maxTicksLimit: 10
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: themeColors.grid,
          drawTicks: false
        },
        ticks: {
          font: {
            family: "'Inter', 'Segoe UI', 'Helvetica', 'Arial', sans-serif",
            size: 11
          },
          color: themeColors.text,
          padding: 8,
          precision: 0, // Only show whole numbers
          callback: (value) => `${value}`
        }
      }
    },
    elements: {
      line: {
        borderCapStyle: 'round'
      }
    },
    interaction: {
      mode: 'index',
      intersect: false
    },
    hover: {
      mode: 'index',
      intersect: false
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
      <Line data={chartData} options={chartOptions} />
    </div>
  );
};

// Helper function to process clicks data based on timeframe
const processClicksData = (
  clicksData: ClickData[]
) => {
  // Sort data by date
  const sortedData = [...clicksData].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  const clicksByDate = new Map<string, number>();
  sortedData.forEach(click => {
    const date = new Date(click.createdAt);
    const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD
    clicksByDate.set(dateKey, (clicksByDate.get(dateKey) || 0) + 1);
  });

  // Fill in missing dates within the range
  const dateLabels: string[] = [];
  const clickCounts: number[] = [];
  
  if (clicksByDate.size > 0) {
    const dates = Array.from(clicksByDate.keys()).sort();
    const firstDate = new Date(dates[0]);
    const lastDate = new Date(dates[dates.length - 1]);
    
    const current = new Date(firstDate);
    
    while (current <= lastDate) {
      const dateKey = current.toISOString().split('T')[0];
      current.setDate(current.getDate() + 1);
      dateLabels.push(formatDateLabel(dateKey));
      clickCounts.push(clicksByDate.get(dateKey) || 0);
    }
  }
  
  return { labels: dateLabels, counts: clickCounts };
};

// Helper function to format date labels based on timeframe
const formatDateLabel = (dateKey: string): string => {
    const date = new Date(dateKey);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export default ClicksTrendChart;