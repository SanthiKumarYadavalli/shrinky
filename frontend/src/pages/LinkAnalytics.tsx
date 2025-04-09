
import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import AnalyticsChart from "@/components/AnalyticsChart";
import { toast } from "@/lib/toast";
import { API_URL, getLinkById } from "@/services/api";
import { Link as LinkType } from "@/types";

const LinkAnalytics = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [link, setLink] = useState<LinkType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLink = async () => {
      if (!id) {
        navigate("/dashboard");
        return;
      }

      try {
        setIsLoading(true);
        const linkData = await getLinkById(id, localStorage.getItem("token"));
        
        if (!linkData) {
          throw new Error("Link not found");
        }
        
        setLink(linkData);
      } catch (error) {
        console.error("Failed to fetch link:", error);
        toast.error("Failed to load link data");
        navigate("/dashboard");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLink();
  }, [id, navigate]);

  return (
    <Layout>
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Back to Dashboard</span>
        </Button>
        <h1 className="text-3xl font-bold">Link Analytics</h1>
      </div>

      {isLoading ? (
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[400px] w-full" />
          </CardContent>
        </Card>
      ) : link ? (
        <>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex flex-col gap-2">
                <div className="text-xl font-medium">{link.customAlias || "Link Details"}</div>
                <div className="text-sm font-normal break-all text-muted-foreground">
                  {link.originalURL}
                </div>
                <div className="text-sm font-mono mt-1">
                  Short URL:&nbsp; 
                  <a href={`${API_URL}/${link.shortCode}`} target="_blank" className="underline">
                    {`${API_URL}/${link.shortCode}`}
                  </a>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Total Clicks</div>
                  <div className="text-2xl font-bold">{link.totalClicks}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Status</div>
                  <div className="text-2xl font-bold">
                    {(!link.expiresAt || Date.parse(link.expiresAt) > Date.now()) ? "Active" : "Expired"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <AnalyticsChart linkId={id} />
        </>
      ) : (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground mb-4">Link not found</p>
            <Button asChild>
              <Link to="/dashboard">Return to Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </Layout>
  );
};

export default LinkAnalytics;
