
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BarChart3, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface LinkActionsProps {
  linkId: string;
  onDelete: (id: string) => void;
  deletingId: string | null;
}

export const LinkActions = ({ linkId, onDelete, deletingId }: LinkActionsProps) => {
  const navigate = useNavigate();

  const handleViewAnalytics = (linkId: string) => {
    navigate(`/analytics/${linkId}`);
  };

  return (
    <div className="flex items-center justify-end gap-2">
      <Button 
        variant="ghost" 
        size="icon"
        onClick={() => handleViewAnalytics(linkId)}
        title="View analytics"
      >
        <BarChart3 className="h-4 w-4" />
        <span className="sr-only">Analytics</span>
      </Button>
      
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-destructive hover:text-destructive"
            title="Delete link"
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete</span>
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Link</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this link? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.stopPropagation();
                onDelete(linkId);
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deletingId === linkId}
            >
              {deletingId === linkId ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
