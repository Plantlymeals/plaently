import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, ShoppingBag, FileText, MessageSquare, HelpCircle, Quote, Image, Package, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", path: "/admin", icon: LayoutDashboard },
  { label: "Products", path: "/admin/products", icon: ShoppingBag },
  { label: "Blog Posts", path: "/admin/blog", icon: FileText },
  { label: "FAQs", path: "/admin/faqs", icon: HelpCircle },
  { label: "Testimonials", path: "/admin/testimonials", icon: Quote },
  { label: "Bundles", path: "/admin/bundles", icon: Package },
  { label: "Hero Content", path: "/admin/hero", icon: Image },
  { label: "Messages", path: "/admin/messages", icon: MessageSquare },
];

const AdminDashboard = () => {
  const { signOut } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen flex bg-secondary/30">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border/50 p-6 flex flex-col">
        <Link to="/" className="font-heading text-xl font-bold text-primary mb-8">
          PLÄNTLY
        </Link>

        <nav className="space-y-1 flex-1">
          {navItems.map(({ label, path, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                location.pathname === path
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>

        <Button variant="ghost" onClick={signOut} className="justify-start gap-3 text-muted-foreground">
          <LogOut className="h-4 w-4" /> Sign Out
        </Button>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminDashboard;
