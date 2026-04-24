import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { formatMWK } from "@/data/products";
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Package, Check, Truck, Phone, MapPin, Loader2, Eye } from "lucide-react";
import { format } from "date-fns";

interface Order {
  id: string;
  user_id: string | null;
  customer_name: string;
  customer_phone: string;
  customer_location: string | null;
  total_mwk: number;
  status: string;
  notes: string | null;
  created_at: string;
}

interface OrderItem {
  id: string;
  product_name: string;
  unit_price_mwk: number;
  quantity: number;
}

const STATUSES = ["new", "confirmed", "dispatched", "delivered", "cancelled"] as const;

const statusColors: Record<string, string> = {
  new: "bg-accent text-white",
  confirmed: "bg-primary text-white",
  dispatched: "bg-purple-500 text-white",
  delivered: "bg-green-500 text-white",
  cancelled: "bg-destructive text-white",
};

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    fetchOrders();
  }, [filter]);

  const fetchOrders = () => {
    let query = supabase.from("orders").select("*").order("created_at", { ascending: false });
    
    if (filter !== "all") {
      query = query.eq("status", filter);
    }
    
    query.then(({ data }) => {
      setOrders(data || []);
      setLoading(false);
    });
  };

  const updateStatus = async (orderId: string, newStatus: string) => {
    await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId);
    
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
  };

  const viewOrder = async (order: Order) => {
    setSelectedOrder(order);
    const { data } = await supabase
      .from("order_items")
      .select("id, product_name, unit_price_mwk, quantity")
      .eq("order_id", order.id);
    setOrderItems(data || []);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display font-bold text-3xl">Orders</h1>
        <p className="text-muted-foreground">Manage and track customer orders</p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            filter === "all" ? "bg-gradient-brand text-white" : "bg-card border border-border hover:text-foreground"
          }`}
        >
          All
        </button>
        {STATUSES.map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-colors ${
              filter === status ? "bg-gradient-brand text-white" : "bg-card border border-border hover:text-foreground"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 bg-card rounded-2xl border border-border/60">
          <Package className="h-12 w-12 mx-auto text-muted-foreground" />
          <p className="mt-4 text-muted-foreground">No orders found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-card border border-border/60 rounded-2xl p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="font-display font-bold text-xl">#{order.id.slice(0, 8).toUpperCase()}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(order.created_at), "PPPp")}
                  </p>
                </div>
                
                <div className="text-right">
                  <p className="font-display font-bold text-2xl text-gradient">{formatMWK(order.total_mwk)}</p>
                  <p className="text-sm text-muted-foreground">{order.customer_name}</p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  {order.customer_phone}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {order.customer_location || "No location"}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-border/50 flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={() => viewOrder(order)}>
                  <Eye className="h-4 w-4" /> View Details
                </Button>
                
                {order.status !== "delivered" && order.status !== "cancelled" && (
                  <div className="flex gap-2">
                    {STATUSES.slice(0, 4).map((status) => (
                      <Button
                        key={status}
                        variant={order.status === status ? "default" : "outline"}
                        size="sm"
                        onClick={() => updateStatus(order.id, status)}
                        disabled={order.status === status}
                      >
                        {status === "new" && <Check className="h-3 w-3" />}
                        {status === "confirmed" && <Check className="h-3 w-3" />}
                        {status === "dispatched" && <Truck className="h-3 w-3" />}
                        {status === "delivered" && <Package className="h-3 w-3" />}
                        <span className="capitalize">{status}</span>
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Order Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              Order #{selectedOrder?.id.slice(0, 8).toUpperCase()}
            </DialogTitle>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-6 mt-4">
              {/* Status */}
              <div className="flex gap-2 flex-wrap">
                {STATUSES.map((status) => (
                  <Button
                    key={status}
                    variant={selectedOrder.status === status ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      updateStatus(selectedOrder.id, status);
                      setSelectedOrder({ ...selectedOrder, status });
                    }}
                  >
                    <span className="capitalize">{status}</span>
                  </Button>
                ))}
              </div>

              {/* Items */}
              <div>
                <h4 className="font-semibold mb-2">Items</h4>
                <div className="space-y-2">
                  {orderItems.map((item) => (
                    <div key={item.id} className="flex justify-between py-2 border-b border-border/30">
                      <span>{item.quantity} × {item.product_name}</span>
                      <span className="font-semibold">{formatMWK(item.unit_price_mwk * item.quantity)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between pt-2">
                    <span className="font-semibold">Total</span>
                    <span className="font-display font-bold text-xl text-gradient">
                      {formatMWK(selectedOrder.total_mwk)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div className="p-4 bg-secondary/30 rounded-xl">
                <h4 className="font-semibold mb-2">Customer</h4>
                <p>{selectedOrder.customer_name}</p>
                <p className="text-muted-foreground">{selectedOrder.customer_phone}</p>
                <p className="text-muted-foreground">{selectedOrder.customer_location || "No location"}</p>
                {selectedOrder.notes && (
                  <p className="mt-2 text-muted-foreground">Note: {selectedOrder.notes}</p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminOrders;