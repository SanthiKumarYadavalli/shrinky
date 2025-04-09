
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "@/lib/toast";
import { API_URL } from "@/services/api";

interface ShortLinkDisplayProps {
  shortUrl: string;
  alias?: string;
}

export const ShortLinkDisplay = ({ shortUrl, alias }: ShortLinkDisplayProps) => {
  const fullShortUrl = `${API_URL}/${shortUrl}`;
  const fullAliasUrl = alias ? `${API_URL}/${alias}` : "";

  const handleCopyLink = (text: string, type: string = "link") => {
    navigator.clipboard.writeText(`${API_URL}/${text}`)
      .then(() => toast.success(`${type} copied to clipboard`))
      .catch(() => toast.error(`Failed to copy ${type}`));
  };

  return (
    <>
      <div className="flex items-center gap-2 mb-1">
        <div className="font-mono text-sm bg-muted/30 px-2 py-1 rounded hover:bg-muted/80">
          <a href={fullShortUrl} target="_blank">{fullShortUrl}</a>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6" 
          onClick={() => handleCopyLink(shortUrl)}
          title="Copy short link"
        >
          <Copy className="h-3 w-3" />
          <span className="sr-only">Copy</span>
        </Button>
      </div>
      
      {alias && (
        <div className="flex items-center gap-2 mt-1">
          <span className="flex items-center gap-1 text-sm bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded">
            Alias: <span className="font-semibold">{alias}</span>
          </span>
          <Button 
            variant="ghost" 
            size="icon"
            className="h-5 w-5" 
            onClick={() => handleCopyLink(alias, "Alias")}
            title="Copy alias"
          >
            <Copy className="h-2 w-2" />
            <span className="sr-only">Copy alias</span>
          </Button>
        </div>
      )}
    </>
  );
};
