import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { formatMWK } from "@/data/products";
import { Link } from "react-router-dom";
import { Package, DollarSign, TrendingUp, Users, ArrowUpRight, ArrowDownRight } from "lucide-react";

interface Stats {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  totalCustomers: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats>({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    totalCustomers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      supabase.from("orders").select("id, total_mwk, status", { count: "exact" }),
      supabase.from("user_roles").select("user_id", { count: "exact" }).eq("role", "customer"),
      supabase.from("orders").select("id", { count: "exact" }).eq("status", "new"),
    ]).then(([ordersRes, customersRes, pendingRes]) => {
      const totalOrders = ordersRes.count || 0;
      const totalRevenue = ordersRes.data?.reduce((sum, o) => sum + o.total_mwk, 0) || 0;
      const totalCustomers = customersRes.count || 0;
      const pendingOrders = pendingRes.count || 0;
      
      setStats({ totalOrders, totalRevenue, pendingOrders, totalCustomers });
      setLoading(false);
    });
  }, []);

  const statCards = [
    { 
      label: "Total Orders", 
      value: stats.totalOrders.toString(), 
      icon: Package,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    { 
      label: "Revenue", 
      value: formatMWK(stats.totalRevenue), 
      icon: DollarSign,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    { 
      label: "Pending", 
      value: stats.pendingOrders.toString(), 
      icon: TrendingUp,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    { 
      label: "Customers", 
      value: stats.totalCustomers.toString(), 
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display font-bold text-3xl">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's what's happening.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <div key={stat.label} className="bg-card border border-border/60 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="font-display font-bold text-2xl mt-1">{stat.value}</p>
              </div>
              <div className={`h-12 w-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Link
          to="/admin/orders"
          className="flex items-center justify-between p-6 bg-card border border-border/60 rounded-2xl hover:border-primary/50 transition-colors"
        >
          <div>
            <p className="font-display font-semibold">Manage Orders</p>
            <p className="text-sm text-muted-foreground">View and update order status</p>
          </div>
          <ArrowUpRight className="h-5 w-5 text-muted-foreground" />
        </Link>
        
        <Link
          to="/admin/products"
          className="flex items-center justify-between p-6 bg-card border border-border/60 rounded-2xl hover:border-primary/50 transition-colors"
        >
          <div>
            <p className="font-display font-semibold">Manage Products</p>
            <p className="text-sm text-muted-foreground">Add or edit products</p>
          </div>
          <ArrowUpRight className="h-5 w-5 text-muted-foreground" />
        </Link>
      </div>

      {/* Recent Orders Preview */}
      <RecentOrders />
    </div>
  );
};

const RecentOrders = () => {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    supabase
      .from("orders")
      .select("id, status, total_mwk, created_at, customer_name")
      .order("created_at", { ascending: false })
      .limit(5)
      .then(({ data }) => setOrders(data || []));
  }, []);

  const statusColors: Record<string, string> = {
    new: "bg-accent",
    confirmed: "bg-primary",
    dispatched: "bg-purple-500",
    delivered: "bg-green-500",
    cancelled: "bg-destructive",
  };

  return (
    <div className="bg-card border border-border/60 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display font-semibold">Recent Orders</h2>
        <Link to="/admin/orders" className="text-sm text-primary hover:underline">View all</Link>
      </div>
      
      {orders.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">No orders yet</p>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <Link
              key={order.id}
              to={`/admin/orders?order=${order.id}`}
              className="flex items-center justify-between py-2 border-b border-border/30 last:border-0"
            >
              <div>
                <p className="font-medium">#{order.id.slice(0, 8).toUpperCase()}</p>
                <p className="text-sm text-muted-foreground">{order.customer_name}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">{formatMWK(order.total_mwk)}</p>
                <span className={`px-2 py-0.5 rounded-full text-xs text-white ${statusColors[order.status] || "bg-gray-500"}`}>
                  {order.status}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;