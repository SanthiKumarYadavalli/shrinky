
import { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { toast } from "@/lib/toast";
import { Link } from "@/types";
import { EmptyState } from "./link-table/EmptyState";
import { LinkTableRow } from "./link-table/LinkTableRow";
import { PaginationControls } from "./link-table/PaginationControls";
import { deleteLink } from "@/services/api";

interface LinkTableProps {
  links: Link[];
  onDelete: (id: string) => void;
}

const LINKS_PER_PAGE = 5;

const LinkTable = ({ links, onDelete }: LinkTableProps) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Calculate pagination
  const totalPages = Math.ceil(links.length / LINKS_PER_PAGE);
  const startIndex = (currentPage - 1) * LINKS_PER_PAGE;
  const paginatedLinks = links.slice(startIndex, startIndex + LINKS_PER_PAGE);
  
  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      onDelete(id);
      toast.success("Link deleted successfully");
      await deleteLink(id, localStorage.getItem("token"));
      // Handle pagination when deleting the last item on a page
      if (paginatedLinks.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete link");
    } finally {
      setDeletingId(null);
    }
  };

  if (links.length === 0) {
    return <EmptyState />;
  }
  
  return (
    <div className="space-y-4">
      <div className="overflow-auto rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[30%] min-w-[120px]">Original URL</TableHead>
              <TableHead className="min-w-[120px]">Short Link</TableHead>
              <TableHead className="min-w-[100px]">Created</TableHead>
              <TableHead className="min-w-[70px]">Clicks</TableHead>
              <TableHead className="w-[120px] min-w-[120px]">Status</TableHead>
              <TableHead className="text-right min-w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedLinks.map((link) => (
              <LinkTableRow
                key={link._id}
                link={link}
                onDelete={handleDelete}
                deletingId={deletingId}
              />
            ))}
          </TableBody>
        </Table>
      </div>
      
      <PaginationControls 
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default LinkTable;
