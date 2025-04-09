
import { useState, useMemo } from "react";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp, Search } from "lucide-react";

interface LinkTableProps {
  links: Link[];
  onDelete: (id: string) => void;
}

type SortField = "originalUrl" | "shortUrl" | "createdAt" | "clicks";
type SortDirection = "asc" | "desc";

const LINKS_PER_PAGE = 5;

const LinkTable = ({ links, onDelete }: LinkTableProps) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  
  // Filter links based on search query
  const filteredLinks = useMemo(() => {
    if (!searchQuery.trim()) return links;
    
    const query = searchQuery.toLowerCase();
    return links.filter(link => 
      link.originalURL.toLowerCase().includes(query) || 
      link.shortCode.toLowerCase().includes(query) || 
      link.customAlias?.toLowerCase().includes(query)
    );
  }, [links, searchQuery]);
  
  // Sort filtered links
  const sortedLinks = useMemo(() => {
    return [...filteredLinks].sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case "originalUrl":
          comparison = a.originalURL.localeCompare(b.originalURL);
          break;
        case "shortUrl":
          comparison = a.shortCode.localeCompare(b.shortCode);
          break;
        case "createdAt":
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case "clicks":
          comparison = a.totalClicks - b.totalClicks;
          break;
        default:
          return 0;
      }
      
      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [filteredLinks, sortField, sortDirection]);
  
  // Handle sorting logic
  const handleSort = (field: SortField) => {
    if (field === sortField) {
      // Toggle direction if clicking the same field
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // Set new field and default to descending
      setSortField(field);
      setSortDirection("desc");
    }
    
    // Reset to first page when sorting changes
    setCurrentPage(1);
  };
  
  // Get sort icon for the column
  const getSortIcon = (field: SortField) => {
    if (field !== sortField) return null;
    
    return sortDirection === "asc" 
      ? <ArrowUp className="h-4 w-4 ml-1 inline" /> 
      : <ArrowDown className="h-4 w-4 ml-1 inline" />;
  };
  
  // Calculate pagination
  const totalPages = Math.ceil(sortedLinks.length / LINKS_PER_PAGE);
  const startIndex = (currentPage - 1) * LINKS_PER_PAGE;
  const paginatedLinks = sortedLinks.slice(startIndex, startIndex + LINKS_PER_PAGE);
  
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
      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search links..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1); // Reset to first page on search
          }}
          className="pl-9"
        />
      </div>
      
      {sortedLinks.length === 0 && searchQuery ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No links found matching "{searchQuery}"</p>
          <Button 
            variant="ghost"
            onClick={() => setSearchQuery("")}
            className="mt-2"
          >
            Clear search
          </Button>
        </div>
      ) : sortedLinks.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="overflow-auto rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="w-[30%] min-w-[120px] cursor-pointer"
                  onClick={() => handleSort("originalUrl")}
                >
                  Original URL {getSortIcon("originalUrl")}
                </TableHead>
                <TableHead 
                  className="min-w-[120px] cursor-pointer"
                  onClick={() => handleSort("shortUrl")}
                >
                  Short Link {getSortIcon("shortUrl")}
                </TableHead>
                <TableHead 
                  className="min-w-[100px] cursor-pointer"
                  onClick={() => handleSort("createdAt")}
                >
                  Created {getSortIcon("createdAt")}
                </TableHead>
                <TableHead 
                  className="min-w-[70px] cursor-pointer"
                  onClick={() => handleSort("clicks")}
                >
                  Clicks {getSortIcon("clicks")}
                </TableHead>
                <TableHead className="min-w-[120px]">Status</TableHead>
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
      )}
      
      <PaginationControls 
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default LinkTable;
