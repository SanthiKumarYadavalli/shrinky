
import { Link as RouterLink } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <div className="text-4xl mb-4">🔗</div>
      <h3 className="text-xl font-semibold mb-2">No links yet</h3>
      <p className="text-muted-foreground mb-6">
        Create your first short link to start tracking its performance
      </p>
      <Button asChild>
        <RouterLink to="/create">Create Your First Link</RouterLink>
      </Button>
    </div>
  );
};
