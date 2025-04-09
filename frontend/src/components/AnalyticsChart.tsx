
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/lib/toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { ClickData } from "@/types";
import { getLinkAnalytics } from "@/services/api";
import { format } from "date-fns";
import ClickTrendChart from "./charts/ClickTrendChart";
import PieChart from "./charts/PieChart";

interface AnalyticsChartProps {
  linkId: string;
}

const AnalyticsChart = ({ linkId }: AnalyticsChartProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [clickData, setClickData] = useState<ClickData[]>([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setIsLoading(true);
        const stats = await getLinkAnalytics(linkId, localStorage.getItem("token"));
        setClickData(stats);
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
        toast.error("Failed to load analytics data");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAnalytics();
  }, [linkId]);
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Skeleton className="h-6 w-32" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-48" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle>Click Analytics</CardTitle>
        <CardDescription>
          Detailed analytics about your link's performance
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="daily">
          <TabsList className="mb-4">
            <TabsTrigger value="daily">Daily Clicks</TabsTrigger>
            <TabsTrigger value="devices">Devices</TabsTrigger>
            <TabsTrigger value="browsers">Browsers</TabsTrigger>
            <TabsTrigger value="os">Operating Systems</TabsTrigger>
            <TabsTrigger value="detailed">Detailed Logs</TabsTrigger>
          </TabsList>
          
          <TabsContent value="daily" className="h-[400px]">
            <ClickTrendChart clicksData={clickData} />
          </TabsContent>
          
          <TabsContent value="devices" className="h-[400px]">
            <PieChart clicksData={clickData} attr="device" title="Clicks by Device Type" />
          </TabsContent>
          
          <TabsContent value="browsers" className="h-[400px]">
            <PieChart clicksData={clickData} attr="browser" title="Clicks by Browser"/>
          </TabsContent>
          
          <TabsContent value="os" className="h-[400px]">
            <PieChart clicksData={clickData} attr="operatingSystem" title="Clicks by Operating System" />
          </TabsContent>
          
          <TabsContent value="detailed" className="h-[400px] overflow-auto">
            <div className="rounded-md border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-2 text-left font-medium">Time</th>
                    <th className="p-2 text-left font-medium">IP Address</th>
                    <th className="p-2 text-left font-medium">Device</th>
                    <th className="p-2 text-left font-medium">Browser</th>
                    <th className="p-2 text-left font-medium">OS</th>
                  </tr>
                </thead>
                <tbody>
                  {clickData.map((click) => (
                    <tr key={click._id} className="border-b">
                      <td className="p-2 font-mono text-xs">
                        {format(new Date(click.createdAt), 'MMM d, yyyy HH:mm:ss')}
                      </td>
                      <td className="p-2 font-mono text-xs">{click.ipAddress}</td>
                      <td className="p-2">{click.device}</td>
                      <td className="p-2">{click.browser}</td>
                      <td className="p-2">{click.operatingSystem}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AnalyticsChart;
