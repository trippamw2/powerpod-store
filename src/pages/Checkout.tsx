import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { buildWhatsAppLink, cartMessage } from "@/lib/whatsapp";
import { formatMWK } from "@/data/products";
import { DeliveryOptions, DeliveryCompany, getDeliveryCompanies } from "@/components/DeliveryOptions";
import { MessageCircle, Loader2, ShoppingBag, Truck, MapPin, Phone } from "lucide-react";

const checkoutSchema = z.object({
  name: z.string().trim().min(1, "Name required").max(100),
  phone: z.string().trim().min(7, "Phone required").max(20),
  location: z.string().trim().min(2, "Location required").max(200),
  delivery_company: z.string().min(1, "Delivery method required"),
  notes: z.string().trim().max(500).optional(),
});

const Checkout = () => {
  const { user, loading: authLoading } = useAuth();
  const { items, total, clear } = useCart();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryCompany | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  useEffect(() => {
    if (location) {
      const companies = getDeliveryCompanies(location);
      if (companies.length > 0) {
        setSelectedDelivery(companies[0]);
      }
    }
  }, [location]);

  if (!authLoading && !user) {
    navigate("/auth?redirect=/checkout", { replace: true });
    return null;
  }

  if (items.length === 0) {
    return (
      <div className="container py-20 text-center space-y-4">
        <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground" />
        <h1 className="font-display font-bold text-3xl">Your cart is empty</h1>
        <Button asChild variant="hero"><Link to="/shop">Start shopping</Link></Button>
      </div>
    );
  }

  const deliveryFee = 0; // Free delivery included in product price
  const orderTotal = total;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!agreedToTerms) {
      toast({ title: "Please agree to terms", description: "You must agree to the terms to place an order.", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      const parsed = checkoutSchema.safeParse({ 
        name, 
        phone, 
        location, 
        delivery_company: selectedDelivery?.id || "",
        notes 
      });
      if (!parsed.success) throw new Error(parsed.error.issues[0].message);

      const locationForWhatsApp = `${parsed.data.location}${selectedDelivery?.is_same_day ? " (Same Day)" : ""}`;

      const { data: order, error: orderErr } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          customer_name: parsed.data.name,
          customer_phone: parsed.data.phone,
          customer_location: parsed.data.location,
          notes: `Delivery: ${selectedDelivery?.name} (FREE)\n${parsed.data.notes || ""}`.trim(),
          total_mwk: orderTotal,
          status: "new",
        })
        .select()
        .single();
      if (orderErr) throw orderErr;

      const { error: itemsErr } = await supabase.from("order_items").insert(
        items.map((i) => ({
          order_id: order.id,
          product_key: i.productKey,
          product_name: i.name,
          unit_price_mwk: i.price,
          quantity: i.quantity,
        }))
      );
      if (itemsErr) throw itemsErr;

      await supabase.from("orders").update({ whatsapp_sent: true }).eq("id", order.id);

      const itemsText = items
        .map((i) => `• ${i.quantity} × ${i.name} — MWK ${(i.price * i.quantity).toLocaleString()}`)
        .join("\n");

      const msg = [
        "📦 NEW ORDER ⚡",
        "",
        `👤 Customer: ${parsed.data.name}`,
        `📞 Phone: ${parsed.data.phone}`,
        `📍 Delivery: ${locationForWhatsApp}`,
        `🚚 Delivery: ${selectedDelivery?.name} (FREE)`,
        "",
        "🛒 Items:",
        itemsText,
        "",
        `💵 *TOTAL: MWK ${orderTotal.toLocaleString()}* (Including FREE Delivery)`,
        "",
        order.id ? `🔖 Order Ref: #${order.id.slice(0, 8).toUpperCase()}` : "",
        "",
        "Please confirm and send payment link. Thanks!",
      ].filter(Boolean).join("\n");

      window.open(buildWhatsAppLink(msg), "_blank", "noopener,noreferrer");

      clear();
      toast({ title: "Order placed!", description: `Order #${order.id.slice(0, 8).toUpperCase()} - Check WhatsApp for payment link.` });
      navigate(`/orders/${order.id}`);
    } catch (err: any) {
      toast({ title: "Couldn't place order", description: err.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container py-12 sm:py-16">
      <div className="max-w-2xl mx-auto space-y-3 mb-10">
        <p className="text-sm font-semibold text-gradient uppercase tracking-widest">Checkout</p>
        <h1 className="font-display font-bold text-4xl tracking-tight">Complete your order</h1>
        <p className="text-muted-foreground">Fill in your details and choose delivery. We'll confirm via WhatsApp.</p>
      </div>

      <div className="grid lg:grid-cols-[1fr_400px] gap-8 max-w-6xl mx-auto">
        <form onSubmit={handlePlaceOrder} className="space-y-6 rounded-3xl bg-card border border-border/60 p-6">
          <div className="space-y-4">
            <h2 className="font-display font-semibold text-lg flex items-center gap-2">
              <MapPin className="h-5 w-5" /> Delivery Details
            </h2>
            
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required maxLength={100} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">WhatsApp number</Label>
                <Input id="phone" type="tel" placeholder="+265 ..." value={phone} onChange={(e) => setPhone(e.target.value)} required maxLength={20} />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Delivery location</Label>
              <Input 
                id="location" 
                placeholder="Area, city (e.g. Limbe, Blantyre, Lilongwe)" 
                value={location} 
                onChange={(e) => setLocation(e.target.value)} 
                required 
                maxLength={200} 
              />
              <p className="text-xs text-muted-foreground">
                {location.toLowerCase().includes("blantyre") || location.toLowerCase().includes("limbe")
                  ? "📍 Same day delivery available in Blantyre!"
                  : "🚚 We'll use a courier service for your area"}
              </p>
            </div>
          </div>

          <div className="border-t border-border/50 pt-6 space-y-4">
            <h2 className="font-display font-semibold text-lg flex items-center gap-2">
              <Truck className="h-5 w-5" /> Delivery Method
            </h2>
            
            <DeliveryOptions 
              selectedCompany={selectedDelivery} 
              onSelect={setSelectedDelivery}
              location={location}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea 
              id="notes" 
              value={notes} 
              onChange={(e) => setNotes(e.target.value)} 
              maxLength={500} 
              placeholder="Landmark, color preference, specific time, etc." 
            />
          </div>

          <div className="flex items-start gap-3 p-4 bg-secondary/30 rounded-xl">
            <input
              type="checkbox"
              id="terms"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-1 h-4 w-4"
            />
            <label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer">
              I agree to the terms and conditions. My order details will be sent to WhatsApp for confirmation and payment link.
            </label>
          </div>

          <Button type="submit" variant="whatsapp" size="lg" className="w-full" disabled={submitting}>
            {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <MessageCircle className="h-5 w-5" />}
            Place Order - MWK {orderTotal.toLocaleString()}
          </Button>
          <p className="text-xs text-muted-foreground text-center">You'll receive a payment link via WhatsApp to complete your order.</p>
        </form>

        <aside className="rounded-3xl bg-card border border-border/60 p-6 h-fit space-y-4 sticky top-24">
          <h2 className="font-display font-bold text-xl">Your order</h2>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {items.map((i) => (
              <div key={i.productKey} className="flex items-center gap-3">
                <div className="h-14 w-14 rounded-xl overflow-hidden bg-gradient-brand-soft shrink-0">
                  <img src={i.image} alt={i.name} className="h-full w-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{i.name}</p>
                  <p className="text-xs text-muted-foreground">{i.quantity} × {formatMWK(i.price)}</p>
                </div>
                <p className="text-sm font-semibold">{formatMWK(i.price * i.quantity)}</p>
              </div>
            ))}
          </div>
          
          <div className="border-t border-border/60 pt-4 space-y-2">
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
              <span className="font-display font-bold text-2xl text-gradient">{formatMWK(orderTotal)}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Checkout;