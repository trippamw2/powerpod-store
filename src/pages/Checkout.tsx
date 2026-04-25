import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCart, DELIVERY_FEE_MWK, FREE_DELIVERY_THRESHOLD_MWK } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { formatMWK } from "@/data/products";
import { ArrowLeft, User, Truck, CreditCard, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { getPayChanguPaymentLink, PAYCHANGU_CONFIG } from "@/lib/paychangu";

type Step = "details" | "delivery" | "payment";

const STEPS = [
  { key: "details" as Step, label: "Details", icon: User },
  { key: "delivery" as Step, label: "Delivery", icon: Truck },
  { key: "payment" as Step, label: "Payment", icon: CreditCard },
];

const EXPRESS_DELIVERY_FEE = 2000;

const Checkout = () => {
  const { user, loading: authLoading } = useAuth();
  const { items, subtotal, deliveryFee: cartDeliveryFee, total: cartTotal, clear } = useCart();
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>("details");
  const [formData, setFormData] = useState({
    name: user?.user_metadata?.full_name || "",
    phone: user?.user_metadata?.phone || "",
    location: "",
    deliveryNote: "",
  });
  const [deliveryMethod, setDeliveryMethod] = useState<"standard" | "express">("standard");
  const [paymentMethod, setPaymentMethod] = useState<"paychangu">("paychangu");
  const [submitting, setSubmitting] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const calculatedDeliveryFee = deliveryMethod === "express" ? EXPRESS_DELIVERY_FEE : cartDeliveryFee;
  const calculatedTotal = subtotal + calculatedDeliveryFee;

  if (!authLoading && !user) {
    navigate("/auth?redirect=/checkout", { replace: true });
    return null;
  }

  if (items.length === 0 && !orderId) {
    return (
      <div className="container py-20 text-center space-y-4">
        <h1 className="font-display font-bold text-3xl">Your cart is empty</h1>
        <p className="text-muted-foreground">Add products to checkout.</p>
        <Button asChild variant="hero" size="lg"><Link to="/shop">Shop Now</Link></Button>
      </div>
    );
  }

  const stepIndex = STEPS.findIndex(s => s.key === step);

  const handleDetailsSubmit = (e: React.FormEvent) => {
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

  const handleDeliverySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("payment");
  };

  const createOrder = async () => {
    if (!user) return null;
    try {
      const { data: order, error } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          customer_name: formData.name,
          customer_phone: formData.phone,
          customer_location: formData.location,
          notes: `Delivery: ${deliveryMethod}\n${formData.deliveryNote}`.trim(),
          total_mwk: calculatedTotal,
          subtotal_mwk: subtotal,
          delivery_fee_mwk: calculatedDeliveryFee,
          status: "new",
          payment_method: paymentMethod,
        })
        .select()
        .single();

      if (error) throw error;

      await supabase.from("order_items").insert(
        items.map((i) => ({
          order_id: order.id,
          product_key: i.productKey,
          product_name: i.name,
          unit_price_mwk: i.price,
          quantity: i.quantity,
        }))
      );

      sendOrderConfirmationWhatsApp(order.id);
      return order.id;
    } catch (err: any) {
      toast({ title: "Order failed", description: err.message, variant: "destructive" });
      return null;
    }
  };

  const sendOrderConfirmationWhatsApp = (orderId: string) => {
    const phone = formData.phone.replace(/[^0-9]/g, "");
    const waPhone = phone.startsWith("0") ? `265${phone.slice(1)}` : phone;
    const itemsTxt = items.map(i => `• ${i.quantity} × ${i.name}`).join('\n');
    const msg = `🎉 *ORDER CONFIRMED - PowerPod* ⚡

Hi ${formData.name}!

Your order #${orderId.slice(0, 8).toUpperCase()} has been received!

🛒 Items:
${itemsTxt}

💰 Total: ${formatMWK(calculatedTotal)}
🚚 Delivery: ${formData.location}
📝 Status: Processing

We'll send WhatsApp updates as your order progresses.

Track: https://powerpod-store.vercel.app/track/${orderId}

Thanks for choosing PowerPod! 🙏`;
    window.open(`https://wa.me/${waPhone}?text=${encodeURIComponent(msg)}`, "_blank");
  };

const handlePayment = async () => {
    setSubmitting(true);
    try {
      const newOrderId = await createOrder();
      if (!newOrderId) return;

      setOrderId(newOrderId);

      const customerEmail = `${formData.phone.replace(/[^0-9]/g, "")}@powerpod.mw`;

      if (PAYCHANGU_CONFIG.publicKey && !PAYCHANGU_CONFIG.testMode) {
        const paymentLink = await getPayChanguPaymentLink(
          newOrderId,
          calculatedTotal,
          formData.name,
          customerEmail
        );

        window.location.href = paymentLink;
      } else {
        const msg = `🎉 *ORDER PLACED - PowerPod* ⚡

Hi ${formData.name}!

Your order #${newOrderId.slice(0, 8).toUpperCase()} is confirmed!

🛒 Items:
${items.map(i => `• ${i.quantity} × ${i.name}`).join('\n')}

💰 Total: ${formatMWK(calculatedTotal)}
🚚 Delivery to: ${formData.location}

Pay here: https://paychangu.com/pay/${newOrderId.slice(0, 8)}

Track: https://powerpod-store.vercel.app/track/${newOrderId}

Thanks! 🙏`;
        const phone = formData.phone.replace(/[^0-9]/g, "");
        const waPhone = phone.startsWith("0") ? `265${phone.slice(1)}` : phone;
        window.open(`https://wa.me/${waPhone}?text=${encodeURIComponent(msg)}`, "_blank");

        clear();
        toast({ title: "Order placed!", description: `Order #${newOrderId.slice(0, 8).toUpperCase()}` });
        navigate(`/orders/${newOrderId}`);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container py-8 max-w-3xl">
      <Link to="/shop" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" /> Continue Shopping
      </Link>

      <h1 className="font-display font-bold text-2xl mb-6">Checkout</h1>

      {/* Progress Steps */}
      <div className="flex items-center gap-2 mb-8">
        {STEPS.map((s, i) => (
          <div key={s.key} className="flex items-center flex-1">
            <button
              onClick={() => {
                if (i <= stepIndex) setStep(s.key);
              }}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                i === stepIndex
                  ? "bg-gradient-brand text-white"
                  : i < stepIndex
                  ? "bg-green-500/20 text-green-500"
                  : "bg-secondary text-muted-foreground"
              )}
            >
              {i < stepIndex ? <Check className="h-4 w-4" /> : <s.icon className="h-4 w-4" />}
              <span className="hidden sm:inline">{s.label}</span>
            </button>
            {i < STEPS.length - 1 && (
              <div className={cn("flex-1 h-1 mx-2 rounded", i < stepIndex ? "bg-green-500" : "bg-secondary")} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Details */}
      {step === "details" && (
        <div className="rounded-xl bg-card border border-border/60 p-6">
          <h2 className="font-display font-bold text-lg mb-4">Your Details</h2>
          <form onSubmit={handleDetailsSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Full Name *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                  placeholder="Your full name"
                />
              </div>
              <div className="space-y-2">
                <Label>WhatsApp Number *</Label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(p => ({ ...p, phone: e.target.value }))}
                  placeholder="+265 99..."
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Delivery Location *</Label>
              <Input
                value={formData.location}
                onChange={(e) => setFormData(p => ({ ...p, location: e.target.value }))}
                placeholder="Area, City (e.g. Chitimukulu, Lilongwe)"
              />
            </div>
            <Button type="submit" variant="hero" className="w-full sm:w-auto">
              Continue to Delivery
            </Button>
          </form>
        </div>
      )}

      {/* Step 2: Delivery */}
      {step === "delivery" && (
        <div className="rounded-xl bg-card border border-border/60 p-6">
          <h2 className="font-display font-bold text-lg mb-4">Delivery Method</h2>
          <form onSubmit={handleDeliverySubmit} className="space-y-4">
            <div className="space-y-3">
              <label className={cn(
                "flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors",
                deliveryMethod === "standard" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
              )}>
                <input
                  type="radio"
                  name="delivery"
                  value="standard"
                  checked={deliveryMethod === "standard"}
                  onChange={(e) => setDeliveryMethod(e.target.value)}
                  className="h-4 w-4"
                />
                <div className="flex-1">
                  <p className="font-medium">Standard Delivery</p>
                  <p className="text-sm text-muted-foreground">3-5 business days</p>
                </div>
<span className="font-semibold text-green-500">
                  {subtotal >= FREE_DELIVERY_THRESHOLD_MWK ? "FREE" : formatMWK(DELIVERY_FEE_MWK)}
                </span>
              </label>

              <label className={cn(
                "flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors",
                deliveryMethod === "express" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
              )}>
                <input
                  type="radio"
                  name="delivery"
                  value="express"
                  checked={deliveryMethod === "express"}
                  onChange={(e) => setDeliveryMethod(e.target.value as "express")}
                  className="h-4 w-4"
                />
                <div className="flex-1">
                  <p className="font-medium">Express Delivery</p>
                  <p className="text-sm text-muted-foreground">1-2 business days (Blantyre/Lilongwe)</p>
                </div>
                <span className="font-semibold">{formatMWK(EXPRESS_DELIVERY_FEE)}</span>
              </label>
            </div>

            <div className="space-y-2">
              <Label>Delivery Notes (optional)</Label>
              <Input
                value={formData.deliveryNote}
                onChange={(e) => setFormData(p => ({ ...p, deliveryNote: e.target.value }))}
                placeholder="Any special instructions..."
              />
            </div>

            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={() => setStep("details")}>
                Back
              </Button>
              <Button type="submit" variant="hero" className="flex-1">
                Continue to Payment
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Step 3: Payment */}
      {step === "payment" && (
        <div className="space-y-6">
          <div className="rounded-xl bg-card border border-border/60 p-6">
            <h2 className="font-display font-bold text-lg mb-4">Payment Method</h2>
            <div className="p-4 rounded-xl border-2 border-primary bg-primary/5">
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-primary" />
                <div className="flex-1">
                  <p className="font-medium">PayChangu (Airtel Money / TNM Mpamba)</p>
                  <p className="text-sm text-muted-foreground">Pay securely via mobile money</p>
                </div>
                <Check className="h-5 w-5 text-green-500" />
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-card border border-border/60 p-6">
            <h2 className="font-display font-bold text-lg mb-4">Order Summary</h2>
            <div className="space-y-2">
              {items.map((item) => (
                <div key={item.productKey} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{item.quantity}× {item.name}</span>
                  <span>{formatMWK(item.price * item.quantity)}</span>
                </div>
              ))}
              <div className="border-t border-border/60 pt-2 mt-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatMWK(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Delivery</span>
                  <span className={calculatedDeliveryFee === 0 ? "text-green-500" : ""}>
                    {calculatedDeliveryFee === 0 ? "FREE" : formatMWK(calculatedDeliveryFee)}
                  </span>
                </div>
                {calculatedDeliveryFee > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Free delivery on orders over {formatMWK(FREE_DELIVERY_THRESHOLD_MWK)}
                  </p>
                )}
                <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t border-border/60">
                  <span>Total</span>
                  <span className="text-gradient">{formatMWK(calculatedTotal)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={() => setStep("delivery")}>
              Back
            </Button>
            <Button
              variant="hero"
              size="lg"
              className="flex-1"
              onClick={handlePayment}
              disabled={submitting}
            >
              {submitting ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Processing...</> : `Pay ${formatMWK(calculatedTotal)} via PayChangu`}
            </Button>
          </div>
        </div>
      )}

      {orderId && (
        <div className="mt-8 p-6 rounded-xl bg-green-500/10 border border-green-500/20 text-center">
          <Check className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h2 className="font-display font-bold text-xl mb-2">Order Placed!</h2>
          <p className="text-muted-foreground">Order #{orderId.slice(0, 8).toUpperCase()}</p>
          <Button asChild variant="hero" className="mt-4" onClick={() => navigate("/orders")}>
            <Link to="/orders">View Orders</Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default Checkout;