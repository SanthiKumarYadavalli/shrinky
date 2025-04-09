
import { ExternalLink } from "lucide-react";

interface OriginalUrlDisplayProps {
  url: string;
}

export const OriginalUrlDisplay = ({ url }: OriginalUrlDisplayProps) => {
  return (
    <a 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="flex items-center gap-1 hover:underline"
    >
      {url}
      <ExternalLink className="h-3 w-3 text-muted-foreground" />
    </a>
  );
};
