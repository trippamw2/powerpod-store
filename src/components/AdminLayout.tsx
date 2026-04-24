import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { LayoutDashboard, Package, ShoppingCart, Settings, LogOut, Menu, X, Building2, Warehouse } from "lucide-react";
import { Logo } from "@/components/Logo";
import { cn } from "@/lib/utils";

const adminLinks = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { to: "/admin/business", label: "Business", icon: Building2 },
  { to: "/admin/inventory", label: "Inventory", icon: Warehouse },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

export const AdminLayout = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminLoading, setAdminLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!user || authLoading) return;
    
    supabase.rpc("has_role", { _user_id: user.id, _role: "admin" })
      .then(({ data }) => {
        if (!data) {
          navigate("/", { replace: true });
          return;
        }
        setIsAdmin(true);
        setAdminLoading(false);
      });
  }, [user, authLoading]);

  if (authLoading || adminLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform lg:relative lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-border/50">
            <Logo className="h-8" />
            <p className="text-xs text-muted-foreground mt-1">Admin Panel</p>
          </div>
          
          <nav className="flex-1 p-4 space-y-1">
            {adminLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                    isActive 
                      ? "bg-gradient-brand text-white" 
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  )
                }
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="p-4 border-t border-border/50">
            <button
              onClick={() => {
                supabase.auth.signOut();
                navigate("/");
              }}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="lg:hidden flex items-center justify-between p-4 border-b border-border/50 bg-card">
          <Logo className="h-8" />
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2">
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </header>
        
        <main className="flex-1 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-background/50 z-40 lg:hidden" 
          onClick={() => setSidebarOpen(false)} 
        />
      )}
    </div>
  );
};

// Need to import NavLink - using react-router-dom
import { NavLink } from "react-router-dom";