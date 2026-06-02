import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { LayoutDashboard, ShoppingBag, FileText, MessageSquare, HelpCircle, Quote, Image, Package, LogOut, Menu, Tag, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", path: "/admin", icon: LayoutDashboard },
  { label: "Products", path: "/admin/products", icon: ShoppingBag },
  { label: "Blog Posts", path: "/admin/blog", icon: FileText },
  { label: "FAQs", path: "/admin/faqs", icon: HelpCircle },
  { label: "Testimonials", path: "/admin/testimonials", icon: Quote },
  { label: "Reviews", path: "/admin/reviews", icon: Star },
  { label: "Bundles", path: "/admin/bundles", icon: Package },
  { label: "Discounts", path: "/admin/discounts", icon: Tag },
  { label: "Hero Content", path: "/admin/hero", icon: Image },
  { label: "Messages", path: "/admin/messages", icon: MessageSquare },
];

const SidebarNav = ({ currentPath, onNavigate, signOut }: { currentPath: string; onNavigate?: () => void; signOut: () => void }) => (
  <>
    <Link to="/" className="font-heading text-xl font-bold text-primary mb-8 block">
      PLÄNTLY
    </Link>

    <nav className="space-y-1 flex-1">
      {navItems.map(({ label, path, icon: Icon }) => (
        <Link
          key={path}
          to={path}
          onClick={onNavigate}
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
            currentPath === path
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:text-foreground hover:bg-secondary"
          )}
        >
          <Icon className="h-4 w-4" />
          {label}
        </Link>
      ))}
    </nav>

    <Button variant="ghost" onClick={signOut} className="justify-start gap-3 text-muted-foreground w-full">
      <LogOut className="h-4 w-4" /> Sign Out
    </Button>
  </>
);

const AdminDashboard = () => {
  const { signOut } = useAuth();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-secondary/30">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 bg-card border-r border-border/50 p-6 flex-col shrink-0">
        <SidebarNav currentPath={location.pathname} signOut={signOut} />
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <header className="md:hidden flex items-center gap-3 p-4 border-b border-border/50 bg-card">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="shrink-0">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-6 flex flex-col">
              <SidebarNav currentPath={location.pathname} onNavigate={() => setOpen(false)} signOut={signOut} />
            </SheetContent>
          </Sheet>
          <span className="font-heading font-bold text-primary">PLÄNTLY Admin</span>
        </header>

        <main className="flex-1 p-4 md:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
