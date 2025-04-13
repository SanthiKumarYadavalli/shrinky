
import { useEffect, useState } from "react";
import useWebSocket from "react-use-websocket"
import { jwtDecode, JwtPayload } from "jwt-decode";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/lib/toast";
import { 
  Clock, 
  ExternalLink, 
  Link2, 
  MousePointerClick 
} from "lucide-react";
import LinkTable from "@/components/LinkTable";
import { Link } from "@/types";
import { fetchLinks, WS_URL } from "@/services/api";

interface MyJwtPayload extends JwtPayload {
  id: string;
}

interface MessageData {
  type: string;
  urlId: string;
}

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [links, setLinks] = useState<Link[]>([]);
  const [stats, setStats] = useState({
    totalLinks: 0,
    totalClicks: 0,
    activeLinks: 0,
    expiredLinks: 0
  });
  const decoded = jwtDecode(localStorage.getItem("token")) as MyJwtPayload;

  //websocket
  const { sendJsonMessage, lastJsonMessage } = useWebSocket(
    WS_URL,
    {
      onOpen: () => {
        sendJsonMessage({
          type: "register",
          userId: decoded.id,
        })
      }
    }
  );

  useEffect(() => {
    if (lastJsonMessage != null) {
      const { type, urlId } = lastJsonMessage as MessageData;
      if (type === "clicks_increment") {
        setLinks(prev => prev.map(link =>
          link._id === urlId ? {...link, totalClicks: link.totalClicks + 1 } : link
        ));
        setStats(prev => ({
          ...prev,
          totalClicks: prev.totalClicks + 1
        }));
      }
    }
  }, [lastJsonMessage])
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const fetchedLinks = await fetchLinks(localStorage.getItem("token") || "");
        setLinks(fetchedLinks);
        const now = Date.now();
        const totalLinks = fetchedLinks.length;
        const totalClicks = fetchedLinks.reduce((sum, link) => sum + (link.totalClicks || 0), 0);
        const activeLinks = fetchedLinks.filter(link => !link.expiresAt || Date.parse(link.expiresAt) > now).length;
        const expiredLinks = totalLinks - activeLinks;
        setStats({
          totalLinks,
          totalClicks,
          activeLinks,
          expiredLinks
        });
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const handleDeleteLink = (deletedId: string) => {
    setLinks(links.filter(link => link._id !== deletedId));
    
    // Update stats
    setStats(prev => ({
      ...prev,
      totalLinks: prev.totalLinks - 1,
      activeLinks: Date.parse(links.find(link => link._id === deletedId)?.expiresAt) < Date.now()
        ? prev.activeLinks 
        : prev.activeLinks - 1,
      expiredLinks: Date.parse(links.find(link => link._id === deletedId)?.expiresAt) < Date.now()
        ? prev.expiredLinks - 1 
        : prev.expiredLinks,
      totalClicks: prev.totalClicks - (links.find(link => link._id === deletedId)?.totalClicks || 0)
    }));
  };
  
  const statsCards = [
    {
      title: "Total Links",
      value: stats.totalLinks,
      icon: <Link2 className="h-5 w-5 text-primary" />,
      color: "text-primary"
    },
    {
      title: "Total Clicks",
      value: stats.totalClicks,
      icon: <MousePointerClick className="h-5 w-5 text-dashboard-success" />,
      color: "text-dashboard-success"
    },
    {
      title: "Active Links",
      value: stats.activeLinks,
      icon: <ExternalLink className="h-5 w-5 text-dashboard-warning" />,
      color: "text-dashboard-warning"
    },
    {
      title: "Expired Links",
      value: stats.expiredLinks,
      icon: <Clock className="h-5 w-5 text-dashboard-error" />,
      color: "text-dashboard-error"
    }
  ];
  
  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
      </div>
      
      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {isLoading
          ? Array(4).fill(0).map((_, i) => (
              <Card key={i} className="dashboard-card">
                <CardHeader className="p-4 pb-2">
                  <CardDescription>
                    <Skeleton className="h-4 w-24" />
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <Skeleton className="h-8 w-16" />
                </CardContent>
              </Card>
            ))
          : statsCards.map((card, i) => (
              <Card key={i} className="dashboard-card">
                <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
                  <CardDescription>{card.title}</CardDescription>
                  {card.icon}
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className={`text-2xl font-bold ${card.color}`}>
                    {card.value.toLocaleString()}
                  </div>
                </CardContent>
              </Card>
            ))
        }
      </div>
      
      {/* Link Table */}
      <div className="w-full overflow-auto">
        {isLoading ? (
          <Card>
            <CardContent className="p-6">
              <Skeleton className="h-[400px] w-full" />
            </CardContent>
          </Card>
        ) : (
          <LinkTable links={links} onDelete={handleDeleteLink} />
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
