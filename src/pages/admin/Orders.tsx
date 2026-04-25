import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { formatMWK } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Package, Check, Truck, Phone, MapPin, Loader2, Eye, MessageCircle } from "lucide-react";
import { format } from "date-fns";

interface Order {
  id: string;
  user_id: string | null;
  customer_name: string;
  customer_phone: string;
  customer_location: string | null;
  total_mwk: number;
  subtotal_mwk?: number;
  delivery_fee_mwk?: number;
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

const STATUS_MESSAGES: Record<string, string> = {
  confirmed: "Your order has been confirmed! We're preparing it for you.",
  dispatched: "Great news! Your order is on its way.",
  delivered: "Your order has been delivered! Enjoy your PowerPod products.",
  cancelled: "We're sorry, your order has been cancelled.",
};

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

  const sendWhatsAppNotification = (order: Order, newStatus: string) => {
    const phone = order.customer_phone.replace(/[^0-9]/g, "");
    const waPhone = phone.startsWith("0") ? `265${phone.slice(1)}` : phone;
    const message = `Hi ${order.customer_name}!\n\n${STATUS_MESSAGES[newStatus]}\n\nOrder #${order.id.slice(0, 8).toUpperCase()}\nStatus: ${newStatus}\n\nTrack your order: https://powerpod-store.vercel.app/track/${order.id}\n\nThanks for choosing PowerPod!`;
    window.open(`https://wa.me/${waPhone}?text=${encodeURIComponent(message)}`, "_blank");
  };

  const updateStatus = async (orderId: string, newStatus: string) => {
    const order = orders.find(o => o.id === orderId);
    await supabase.from("orders").update({ status: newStatus }).eq("id", orderId);
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
    
    if (order && STATUS_MESSAGES[newStatus]) {
      sendWhatsAppNotification(order, newStatus);
    }
  };

  const viewOrder = async (order: Order) => {
    setSelectedOrder(order);
    const { data } = await supabase.from("order_items").select("id, product_name, unit_price_mwk, quantity").eq("order_id", order.id);
    setOrderItems(data || []);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-bold text-2xl">Orders</h1>
        <p className="text-muted-foreground">Manage and track customer orders</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        <button onClick={() => setFilter("all")} className={`px-3 py-1.5 rounded-full text-sm font-medium ${filter === "all" ? "bg-gradient-brand text-white" : "bg-card border border-border"}`}>
          All
        </button>
        {STATUSES.map((status) => (
          <button key={status} onClick={() => setFilter(status)} className={`px-3 py-1.5 rounded-full text-sm font-medium capitalize ${filter === status ? "bg-gradient-brand text-white" : "bg-card border border-border"}`}>
            {status}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin" /></div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 bg-card rounded-xl border border-border/60">
          <Package className="h-10 w-10 mx-auto text-muted-foreground" />
          <p className="mt-3 text-muted-foreground">No orders found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-card border border-border/60 rounded-xl p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold">#{order.id.slice(0, 8).toUpperCase()}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${statusColors[order.status]}`}>{order.status}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{format(new Date(order.created_at), "PPp")}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">{formatMWK(order.total_mwk)}</p>
                  <p className="text-sm text-muted-foreground">{order.customer_name}</p>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-1 text-muted-foreground"><Phone className="h-3 w-3" />{order.customer_phone}</div>
                <div className="flex items-center gap-1 text-muted-foreground"><MapPin className="h-3 w-3" />{order.customer_location || "No location"}</div>
              </div>

              <div className="mt-4 pt-3 border-t flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={() => viewOrder(order)}><Eye className="h-3 w-3" /> Details</Button>
                <Button variant="outline" size="sm" onClick={() => sendWhatsAppNotification(order, order.status)}><MessageCircle className="h-3 w-3" /> WhatsApp</Button>
                {order.status !== "delivered" && order.status !== "cancelled" && (
                  <div className="flex gap-1">
                    {STATUSES.slice(0, 4).map((status) => (
                      <Button key={status} variant={order.status === status ? "default" : "outline"} size="sm" onClick={() => updateStatus(order.id, status)} disabled={order.status === status}>
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Order #{selectedOrder?.id.slice(0, 8).toUpperCase()}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-1">
                {STATUSES.map((status) => (
                  <Button key={status} variant={selectedOrder.status === status ? "default" : "outline"} size="sm" onClick={() => { updateStatus(selectedOrder.id, status); setSelectedOrder({ ...selectedOrder, status }); }}>
                    <span className="capitalize">{status}</span>
                  </Button>
                ))}
              </div>
              <div className="space-y-2">
                {orderItems.map((item) => (
                  <div key={item.id} className="flex justify-between py-2 border-b border-border/30">
                    <span>{item.quantity} × {item.product_name}</span>
                    <span className="font-semibold">{formatMWK(item.unit_price_mwk * item.quantity)}</span>
                  </div>
                ))}
                <div className="flex justify-between font-bold pt-2">
                  <span>Total</span>
                  <span>{formatMWK(selectedOrder.total_mwk)}</span>
                </div>
              </div>
              <div className="p-3 bg-secondary/30 rounded-lg text-sm">
                <p><strong>{selectedOrder.customer_name}</strong></p>
                <p className="text-muted-foreground">{selectedOrder.customer_phone}</p>
                <p className="text-muted-foreground">{selectedOrder.customer_location || "No location"}</p>
                {selectedOrder.notes && <p className="mt-1 text-muted-foreground text-xs">Note: {selectedOrder.notes}</p>}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminOrders;