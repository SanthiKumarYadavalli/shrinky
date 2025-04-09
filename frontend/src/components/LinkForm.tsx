
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/lib/toast";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Link2, Loader2 } from "lucide-react";
import { CreateLinkParams, Link } from "@/types";
import { shortenUrl } from "@/services/api";

interface LinkFormProps {
  onSuccess: (link: Link) => void;
}

const LinkForm = ({ onSuccess }: LinkFormProps) => {
  const [originalUrl, setOriginalUrl] = useState("");
  const [alias, setAlias] = useState("");
  const [expiryDate, setExpiryDate] = useState<Date | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!originalUrl) {
      toast.error("Please enter a URL to shorten");
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Basic URL validation
      if (!originalUrl.startsWith("http://") && !originalUrl.startsWith("https://")) {
        setOriginalUrl(`https://${originalUrl}`);
      }
      
      const linkParams: CreateLinkParams = {
        originalURL: originalUrl.startsWith("http") ? originalUrl : `https://${originalUrl}`,
        ...(alias && { customAlias: alias }),
        ...(expiryDate && { expiresAt: expiryDate.toISOString() })
      };
      
      const newLink = await shortenUrl(linkParams, localStorage.getItem("token"));
      toast.success("Link created successfully!");
      
      // Reset form
      setOriginalUrl("");
      setAlias("");
      setExpiryDate(undefined);
      
      // Call success handler
      onSuccess(newLink);
    } catch (error) {
      console.error("Create link error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to create link");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className="border-primary/20 shadow-lg hover:shadow-primary/5 transition-all duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Link2 className="h-5 w-5 text-primary" />
          New Short Link
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="originalUrl">URL</Label>
            <Input
              id="originalUrl"
              placeholder="https://example.com"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              disabled={isLoading}
              className="bg-secondary/50 focus:border-primary focus:ring-primary transition-all duration-200"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="alias">Custom Alias</Label>
            <Input
              id="alias"
              placeholder="my-custom-link"
              value={alias}
              onChange={(e) => setAlias(e.target.value)}
              disabled={isLoading}
              className="bg-secondary/50 focus:border-primary focus:ring-primary transition-all duration-200"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Expiry Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal bg-secondary/50",
                    !expiryDate && "text-muted-foreground",
                    "focus:border-primary focus:ring-primary transition-all duration-200"
                  )}
                  disabled={isLoading}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {expiryDate ? format(expiryDate, "PPP") : "No expiration"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={expiryDate}
                  onSelect={setExpiryDate}
                  initialFocus
                  disabled={(date) => date < new Date()}
                  className="rounded-md border"
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <Button 
            type="submit" 
            className="w-full mt-6 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300" 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default LinkForm;
