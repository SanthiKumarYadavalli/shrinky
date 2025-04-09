import { Badge } from "@/components/ui/badge";
import { getExpiryStatus } from "@/lib/utils";
import { Link } from "@/types";

interface StatusBadgeProps {
  link: Link;
}

export const StatusBadge = ({ link }: StatusBadgeProps) => {
  const { status, text } = getExpiryStatus(link);

  const renderBadge = () => {
    switch (status) {
      case "expired":
        return <Badge variant="destructive">Expired</Badge>;
      case "expiring":
        return (
          <Badge
            variant="outline"
            className="bg-amber-500/20 text-amber-500 hover:bg-amber-500/30 border-amber-500/30"
          >
            Expiring
          </Badge>
        );
      case "active":
      default:
        return (
          <Badge
            variant="secondary"
            className="bg-green-500/20 text-green-500 hover:bg-green-500/30"
          >
            Active
          </Badge>
        );
    }
  };

  return (
    <div className="flex flex-col gap-1">
      {renderBadge()}

      <div className="flex items-center text-xs text-muted-foreground gap-1 mt-1">
        <span>{text}</span>
      </div>
    </div>
  );
};
