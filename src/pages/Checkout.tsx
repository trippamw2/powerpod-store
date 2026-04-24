import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { buildOrderMessage } from "@/lib/whatsapp";
import { formatMWK } from "@/data/products";
import { DeliveryOptions, DeliveryCompany } from "@/components/DeliveryOptions";
import { MessageCircle, Loader2, ShoppingBag, Truck, MapPin, Phone, User, Package, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const Checkout = () => {
  const { user, loading: authLoading } = useAuth();
  const { items, total, clear } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.user_metadata?.full_name || "",
    phone: user?.user_metadata?.phone || "",
    location: "",
    notes: "",
  });
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryCompany | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [step, setStep] = useState<"details" | "delivery" | "confirm">("details");

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

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleContinueToDelivery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast({ title: "Name required", variant: "destructive" });
      return;
    }
    if (!formData.phone.trim() || formData.phone.length < 7) {
      toast({ title: "Valid phone required", variant: "destructive" });
      return;
    }
    if (!formData.location.trim()) {
      toast({ title: "Location required", variant: "destructive" });
      return;
    }
    setStep("delivery");
  };

  const handleContinueToConfirm = () => {
    if (!selectedDelivery) {
      toast({ title: "Select a delivery method", variant: "destructive" });
      return;
    }
    setStep("confirm");
  };

  const handlePlaceOrder = async () => {
    if (!user) return;
    if (!agreedToTerms) {
      toast({ title: "Please agree to terms", variant: "destructive" });
      return;
    }
    setSubmitting(true);

    try {
      // Save order to database
      const { data: order, error: orderErr } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          customer_name: formData.name,
          customer_phone: formData.phone,
          customer_location: formData.location,
          notes: `Delivery: ${selectedDelivery?.name} (FREE)\n${formData.notes || ""}`.trim(),
          total_mwk: total,
          status: "new",
        })
        .select()
        .single();

      if (orderErr) throw orderErr;

      // Save order items
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

      // Mark WhatsApp as sent
      await supabase.from("orders").update({ whatsapp_sent: true }).eq("id", order.id);

      // Build WhatsApp message
      const msg = buildOrderMessage(
        items,
        total,
        {
          name: formData.name,
          phone: formData.phone,
          location: formData.location,
          deliveryMethod: `${selectedDelivery?.name} (FREE)`,
          notes: formData.notes,
        },
        order.id,
        "https://powerpod-store.vercel.app/shop"
      );

      // Open WhatsApp
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

  const stepLabels = ["Your Details", "Delivery", "Confirm Order"];
  const stepIndex = step === "details" ? 0 : step === "delivery" ? 1 : 2;

  return (
    <div className="container py-8 lg:py-12">
      {/* Progress Steps */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          {stepLabels.map((label, i) => (
            <div key={label} className="flex items-center">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all",
                i <= stepIndex
                  ? "bg-gradient-brand text-white"
                  : "bg-secondary text-muted-foreground"
              )}>
                {i < stepIndex ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <span className={cn(
                "ml-2 text-sm font-medium hidden sm:block",
                i <= stepIndex ? "text-foreground" : "text-muted-foreground"
              )}>{label}</span>
              {i < stepLabels.length - 1 && (
                <div className={cn("w-8 sm:w-16 h-0.5 mx-2", i < stepIndex ? "bg-gradient-brand" : "bg-secondary")} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_380px] gap-8 max-w-5xl mx-auto">
        {/* Main Form */}
        <div className="space-y-6">
          {step === "details" && (
            <div className="rounded-3xl bg-card border border-border/60 p-6 lg:p-8">
              <h2 className="font-display font-bold text-2xl mb-6 flex items-center gap-3">
                <User className="h-6 w-6 text-primary" />
                Your Details
              </h2>
              <form onSubmit={handleContinueToDelivery} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Your full name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium">WhatsApp Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="+265 99..."
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-sm font-medium">Delivery Location *</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    placeholder="Area, City (e.g. Chitimukulu, Lilongwe)"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    {formData.location.toLowerCase().includes("blantyre") || formData.location.toLowerCase().includes("limbe")
                      ? "📍 Same day delivery available in Blantyre!"
                      : "🚚 We deliver nationwide with free shipping"}
                  </p>
                </div>
                <Button type="submit" variant="hero" size="lg" className="w-full sm:w-auto">
                  Continue to Delivery
                </Button>
              </form>
            </div>
          )}

          {step === "delivery" && (
            <div className="rounded-3xl bg-card border border-border/60 p-6 lg:p-8">
              <h2 className="font-display font-bold text-2xl mb-6 flex items-center gap-3">
                <Truck className="h-6 w-6 text-primary" />
                Choose Delivery
              </h2>
              <div className="space-y-5">
                <DeliveryOptions
                  selectedCompany={selectedDelivery}
                  onSelect={setSelectedDelivery}
                  location={formData.location}
                />
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep("details")} className="flex-1">
                    Back
                  </Button>
                  <Button variant="hero" onClick={handleContinueToConfirm} disabled={!selectedDelivery} className="flex-1">
                    Continue
                  </Button>
                </div>
              </div>
            </div>
          )}

          {step === "confirm" && (
            <div className="rounded-3xl bg-card border border-border/60 p-6 lg:p-8">
              <h2 className="font-display font-bold text-2xl mb-6 flex items-center gap-3">
                <Package className="h-6 w-6 text-primary" />
                Confirm Your Order
              </h2>

              <div className="space-y-5">
                {/* Summary */}
                <div className="bg-secondary/30 rounded-xl p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-semibold">{formData.name}</p>
                      <p className="text-sm text-muted-foreground">{formData.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-semibold">{formData.location}</p>
                      <p className="text-sm text-muted-foreground">{selectedDelivery?.name} (FREE)</p>
                    </div>
                  </div>
                  {formData.notes && (
                    <div className="flex items-start gap-3">
                      <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <p className="text-sm text-muted-foreground">{formData.notes}</p>
                    </div>
                  )}
                </div>

                {/* Order items */}
                <div className="space-y-3">
                  <h3 className="font-semibold">Items ({items.length})</h3>
                  {items.map((i) => (
                    <div key={i.productKey} className="flex items-center gap-3 p-3 bg-secondary/20 rounded-lg">
                      <img src={i.image} alt={i.name} className="w-12 h-12 rounded-lg object-cover" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{i.name}</p>
                        <p className="text-xs text-muted-foreground">Qty: {i.quantity}</p>
                      </div>
                      <p className="font-semibold">{formatMWK(i.price * i.quantity)}</p>
                    </div>
                  ))}
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-sm font-medium">Order Notes (optional)</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    placeholder="Any special instructions..."
                    rows={2}
                  />
                </div>

                {/* Terms */}
                <div className="flex items-start gap-3 p-4 bg-secondary/30 rounded-xl">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded"
                  />
                  <label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer">
                    I agree to receive order confirmation via WhatsApp. Order details will be sent for payment.
                  </label>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep("delivery")} className="flex-1">
                    Back
                  </Button>
                  <Button
                    variant="whatsapp"
                    size="lg"
                    onClick={handlePlaceOrder}
                    disabled={submitting || !agreedToTerms}
                    className="flex-1"
                  >
                    {submitting ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <>
                        <MessageCircle className="h-5 w-5" />
                        Place Order - {formatMWK(total)}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <aside className="rounded-3xl bg-card border border-border/60 p-6 h-fit space-y-5 sticky top-24">
          <h2 className="font-display font-bold text-xl">Order Summary</h2>

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
              <span className="text-green-500 font-semibold">FREE 🚚</span>
            </div>
            <div className="flex justify-between pt-3 border-t border-border/60">
              <span className="font-semibold">Total</span>
              <span className="font-display font-bold text-2xl text-gradient">{formatMWK(total)}</span>
            </div>
          </div>

          <div className="p-4 bg-green-500/10 rounded-xl border border-green-500/20">
            <p className="text-sm text-green-500 font-medium">✓ FREE Delivery on all orders!</p>
            <p className="text-xs text-muted-foreground mt-1">Powered by WhatsApp - easy payment link</p>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Checkout;