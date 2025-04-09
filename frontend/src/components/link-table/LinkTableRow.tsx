
import { format } from "date-fns";
import { Link } from "@/types";
import { TableCell, TableRow } from "@/components/ui/table";
import { OriginalUrlDisplay } from "./OriginalUrlDisplay";
import { ShortLinkDisplay } from "./ShortLinkDisplay";
import { StatusBadge } from "./StatusBadge";
import { LinkActions } from "./LinkActions";
import { QRCodeDialog } from "./QRCodeDialog";
import { API_URL } from "@/services/api";

interface LinkTableRowProps {
  link: Link;
  onDelete: (id: string) => void;
  deletingId: string | null;
}

export const LinkTableRow = ({ link, onDelete, deletingId }: LinkTableRowProps) => {
  return (
    <TableRow key={link._id} className="link-item">
      <TableCell className="font-medium max-w-[200px] truncate">
        <OriginalUrlDisplay url={link.originalURL} />
      </TableCell>
      <TableCell>
        <ShortLinkDisplay shortUrl={link.shortCode} alias={link.customAlias} />
      </TableCell>
      <TableCell>
        {format(new Date(link.createdAt), "MMM d, yyyy")}
      </TableCell>
      <TableCell>
        <span className="font-semibold">{link.totalClicks}</span>
      </TableCell>
      <TableCell className="w-[120px] min-w-[120px]">
        <StatusBadge link={link} />
      </TableCell>
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-2">
          <QRCodeDialog url={`${API_URL}/${link.shortCode}`} />
          <LinkActions
            linkId={link._id}
            onDelete={onDelete}
            deletingId={deletingId}
          />
        </div>
      </TableCell>
    </TableRow>
  );
};
