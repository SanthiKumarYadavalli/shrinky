
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  BarChart3, 
  Link2, 
  LogOut, 
  Menu,
  PlusCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { toast } from "@/lib/toast";


interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;
  
  const handleLogout = async () => {
    try {
      localStorage.removeItem("token");
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout");
    }
  };

  useEffect(() => {
    setIsOpen(false); // Close mobile menu when route changes
  }, [location.pathname]);

  const menuItems = [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: <BarChart3 className="h-5 w-5" />
    },
    {
      label: "Create Link",
      path: "/create",
      icon: <PlusCircle className="h-5 w-5" />
    }
  ];

  const renderNavItems = () => (
    <>
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight flex items-center gap-2">
          <Link2 className="h-5 w-5" />
          <span>Link Seer</span>
        </h2>
        <div className="space-y-1">
          {menuItems.map((item) => (
            <Button
              key={item.path}
              variant={isActive(item.path) ? "secondary" : "ghost"}
              className={`w-full justify-start ${isActive(item.path) ? "bg-secondary" : ""}`}
              onClick={() => navigate(item.path)}
            >
              {item.icon}
              <span className="ml-2">{item.label}</span>
            </Button>
          ))}
        </div>
      </div>
      <div className="mt-auto p-4">
        <Button
          variant="outline"
          className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </Button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-background overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-10">
        <ScrollArea className="flex flex-col h-full border-r">
          {renderNavItems()}
        </ScrollArea>
      </aside>

      {/* Mobile sidebar */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden fixed top-4 left-4 z-10">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 flex flex-col">
          <ScrollArea className="flex-1">{renderNavItems()}</ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Main content */}
      <main className="flex-1 md:pl-64 w-full overflow-hidden">
        <div className="container py-6 md:py-12 px-4 md:px-6 max-w-full">
          {/* Add padding to prevent content from being hidden under the menu button on mobile */}
          <div className="md:hidden h-12"></div>
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
