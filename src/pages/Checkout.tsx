import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { buildOrderMessage } from "@/lib/whatsapp";
import { formatMWK } from "@/data/products";
import { DeliveryOptions, DeliveryCompany } from "@/components/DeliveryOptions";
import { MessageCircle, Loader2, ShoppingBag, Truck, MapPin, User, Package, ArrowLeft } from "lucide-react";

const Checkout = () => {
  const { user, loading: authLoading } = useAuth();
  const { items, total, clear } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.user_metadata?.full_name || "",
    phone: user?.user_metadata?.phone || "",
    location: "",
  });
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryCompany | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!authLoading && !user) {
    navigate("/auth?redirect=/checkout", { replace: true });
    return null;
  }

  if (items.length === 0) {
    return (
      <div className="container py-20 text-center space-y-4">
        <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground" />
        <h1 className="font-display font-bold text-4xl">Your cart is empty</h1>
        <p className="text-muted-foreground">Add some products to get started.</p>
        <Button asChild variant="hero" size="lg"><Link to="/shop">Start Shopping</Link></Button>
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    if (!user) return;

    if (!formData.name.trim()) {
      toast({ title: "Name required", description: "Please enter your name", variant: "destructive" });
      return;
    }
    if (!formData.phone.trim() || formData.phone.length < 7) {
      toast({ title: "Phone required", description: "Please enter a valid WhatsApp number", variant: "destructive" });
      return;
    }
    if (!formData.location.trim()) {
      toast({ title: "Location required", description: "Please enter your delivery location", variant: "destructive" });
      return;
    }
    if (!selectedDelivery) {
      toast({ title: "Delivery required", description: "Please select a delivery method", variant: "destructive" });
      return;
    }

    setSubmitting(true);

    try {
      const { data: order, error: orderErr } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          customer_name: formData.name,
          customer_phone: formData.phone,
          customer_location: formData.location,
          notes: `Delivery: ${selectedDelivery?.name} (FREE)`,
          total_mwk: total,
          status: "new",
        })
        .select()
        .single();

      if (orderErr) throw orderErr;

      await supabase.from("order_items").insert(
        items.map((i) => ({
          order_id: order.id,
          product_key: i.productKey,
          product_name: i.name,
          unit_price_mwk: i.price,
          quantity: i.quantity,
        }))
      );

      await supabase.from("orders").update({ whatsapp_sent: true }).eq("id", order.id);

      const msg = buildOrderMessage(
        items,
        total,
        {
          name: formData.name,
          phone: formData.phone,
          location: formData.location,
          deliveryMethod: `${selectedDelivery?.name} (FREE)`,
          notes: "",
        },
        order.id,
        "https://powerpod-store-new.vercel.app"
      );

      window.open(`https://wa.me/265991234567?text=${encodeURIComponent(msg)}`, "_blank");

      clear();
      toast({ title: "Order placed!", description: `Order #${order.id.slice(0, 8).toUpperCase()} - Check WhatsApp for payment details.` });
      navigate(`/orders/${order.id}`);
    } catch (err: any) {
      toast({ title: "Order failed", description: err.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container py-8 lg:py-12 max-w-4xl">
      <Link to="/shop" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" /> Continue Shopping
      </Link>

      <h1 className="font-display font-bold text-3xl mb-8">Checkout</h1>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left: Form */}
        <div className="space-y-6">
          {/* Customer Details */}
          <div className="rounded-2xl bg-card border border-border/60 p-6">
            <h2 className="font-display font-bold text-xl mb-4 flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Your Details
            </h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Your full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">WhatsApp Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+265 99..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Delivery Location *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Area, City (e.g. Chitimukulu, Lilongwe)"
                />
              </div>
            </div>
          </div>

          {/* Delivery */}
          <div className="rounded-2xl bg-card border border-border/60 p-6">
            <h2 className="font-display font-bold text-xl mb-4 flex items-center gap-2">
              <Truck className="h-5 w-5 text-primary" />
              Delivery Method
            </h2>
            <DeliveryOptions
              selectedCompany={selectedDelivery}
              onSelect={setSelectedDelivery}
              location={formData.location}
            />
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="rounded-2xl bg-card border border-border/60 p-6 h-fit sticky top-24">
          <h2 className="font-display font-bold text-xl mb-4 flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            Order Summary
          </h2>

          <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
            {items.map((i) => (
              <div key={i.productKey} className="flex items-center gap-3">
                <img src={i.image} alt={i.name} className="w-12 h-12 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{i.name}</p>
                  <p className="text-xs text-muted-foreground">Qty: {i.quantity}</p>
                </div>
                <p className="text-sm font-semibold">{formatMWK(i.price * i.quantity)}</p>
              </div>
            ))}
          </div>

          <div className="border-t border-border/60 pt-4 space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatMWK(total)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Delivery</span>
              <span className="text-green-500 font-semibold">FREE</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-border/60">
              <span className="font-semibold">Total</span>
              <span className="font-display font-bold text-2xl text-gradient">{formatMWK(total)}</span>
            </div>
          </div>

          <Button
            variant="whatsapp"
            size="lg"
            onClick={handlePlaceOrder}
            disabled={submitting}
            className="w-full"
          >
            {submitting ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <MessageCircle className="h-5 w-5" />
                Place Order via WhatsApp - {formatMWK(total)}
              </>
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground mt-3">
            Order details will be sent to WhatsApp for payment
          </p>
        </div>
      </div>
    </div>
  );
};

export default Checkout;