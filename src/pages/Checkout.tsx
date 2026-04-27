import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCart, DELIVERY_FEE_MWK, FREE_DELIVERY_THRESHOLD_MWK } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { formatMWK } from "@/data/products";
import { ArrowLeft, User, Truck, CreditCard, Check, Loader2, MessageCircle, Wallet, Clock, MapPin, Tag, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { getDeliveryQuote, detectZone, PRICING, DELIVERY_ZONES } from "@/lib/delivery";

type Step = "details" | "delivery" | "payment";

const STEPS = [
  { key: "details" as Step, label: "Details", icon: User },
  { key: "delivery" as Step, label: "Delivery", icon: Truck },
  { key: "payment" as Step, label: "Payment", icon: CreditCard },
];

const EXPRESS_DELIVERY_FEE = 3500;

const Checkout = () => {
  const { user, loading: authLoading } = useAuth();
  const { items, subtotal, clear } = useCart();
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>("details");
  const [formData, setFormData] = useState({
    name: user?.user_metadata?.full_name || "",
    phone: user?.user_metadata?.phone || "",
    location: "",
    deliveryNote: "",
  });
  const [deliveryMethod, setDeliveryMethod] = useState<"standard" | "express">("standard");
  const [paymentMethod, setPaymentMethod] = useState<"paychangu" | "whatsapp">("paychangu");
  const [submitting, setSubmitting] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  // Promo code state
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState<{ code: string; discount: number } | null>(null);
  const [applyingPromo, setApplyingPromo] = useState(false);

  const calculatedDeliveryFee = deliveryMethod === "express" ? EXPRESS_DELIVERY_FEE : (subtotal >= 50000 ? 0 : 5000);
  const discount = promoApplied?.discount || 0;
  const finalSubtotal = subtotal - discount;
  const calculatedTotal = finalSubtotal + calculatedDeliveryFee;

  const applyPromoCode = async () => {
    if (!promoCode.trim()) return;
    setApplyingPromo(true);
    try {
      const { data, error } = await supabase
        .from("promo_codes")
        .select("*")
        .eq("code", promoCode.toUpperCase())
        .eq("is_active", true)
        .single();

      if (error || !data) {
        toast({ title: "Invalid promo code", variant: "destructive" });
        return;
      }

      const now = new Date();
      const start = new Date(data.start_date);
      const end = new Date(data.end_date);

      if (now < start) {
        toast({ title: "Promo code not yet active", variant: "destructive" });
        return;
      }
      if (now > end) {
        toast({ title: "Promo code has expired", variant: "destructive" });
        return;
      }
      if (data.used_count >= data.max_uses) {
        toast({ title: "Promo code usage limit reached", variant: "destructive" });
        return;
      }
      if (subtotal < data.min_order) {
        toast({ title: `Minimum order ${formatMWK(data.min_order)} required`, variant: "destructive" });
        return;
      }

      let discount = 0;
      if (data.type === "percentage") {
        discount = Math.round(subtotal * (data.value / 100));
      } else {
        discount = Math.min(data.value, subtotal);
      }

      setPromoApplied({ code: data.code, discount });
      toast({ title: `Promo applied: ${data.type === "percentage" ? `${data.value}% off` : formatMWK(data.value) + " off"}` });
    } catch {
      toast({ title: "Invalid promo code", variant: "destructive" });
    } finally {
      setApplyingPromo(false);
    }
  };

  const removePromo = () => {
    setPromoApplied(null);
    setPromoCode("");
  };

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
    try {
      const deliveryZone = detectZone(formData.location);
      const { data: order, error } = await supabase
        .from("orders")
        .insert({
          user_id: user?.id || null,
          customer_name: formData.name,
          customer_phone: formData.phone,
          customer_location: formData.location,
          notes: `Delivery: ${deliveryMethod}\n${formData.deliveryNote}`.trim(),
          total_mwk: calculatedTotal,
          subtotal_mwk: subtotal,
          delivery_fee_mwk: calculatedDeliveryFee,
          discount_mwk: discount || 0,
          promo_code: promoApplied?.code || null,
          status: "new",
          payment_method: paymentMethod,
          delivery_zone: deliveryZone,
          delivery_method: deliveryMethod,
          tracking_number: `PP-${Date.now().toString(36).toUpperCase()}`,
        })
        .select()
        .single();

if (error) throw error;

      // Increment promo code usage if applied
      if (promoApplied?.code) {
        await supabase.rpc("increment_promo_usage", { promo_code: promoApplied.code }).catch(() => {});
      }

      sendOrderConfirmationWhatsApp(order.id);
      return order.id;
    } catch (err: any) {
      toast({ title: "Order failed", description: err.message, variant: "destructive" });
      return null;
    }
  };

  const sendOrderConfirmationWhatsApp = (orderId: string, trackingNumber?: string) => {
    const phone = formData.phone.replace(/[^0-9]/g, "");
    const waPhone = phone.startsWith("0") ? `265${phone.slice(1)}` : phone;
    const itemsTxt = items.map(i => `• ${i.quantity} × ${i.name}`).join('\n');
    const zone = detectZone(formData.location);
    const zoneConfig = DELIVERY_ZONES[zone];
    const eta = deliveryMethod === "express" ? zoneConfig.expressEta : zoneConfig.standardEta;
    const trackNum = trackingNumber || `PP-${orderId.slice(0, 8).toUpperCase()}`;
    
    const msg = `🎉 *ORDER CONFIRMED - PowerPod* ⚡

Hi ${formData.name}!

Your order #${orderId.slice(0, 8).toUpperCase()} is confirmed!

🛒 Items:
${itemsTxt}

💰 Total: ${formatMWK(calculatedTotal)}
🚚 Delivery: ${formData.location}
📦 ETA: ${eta}
🔢 Tracking: ${trackNum}

We'll send WhatsApp updates as your order progresses.

Track: https://powerpod-store.vercel.app/track/${orderId}

Thanks for choosing PowerPod! 🙏`;
    window.open(`https://wa.me/${waPhone}?text=${encodeURIComponent(msg)}`, "_blank");
  };

const handlePayment = async () => {
    setSubmitting(true);
    try {
      const selectedMethod = paymentMethod;
      console.log("=== PAYMENT FLOW START ===");
      console.log("Selected method from state:", selectedMethod);
      
      const newOrderId = await createOrder();
      if (!newOrderId) {
        console.log("ERROR: No order ID created");
        return;
      }
      console.log("Order created:", newOrderId);

      // DIRECT check - not using else
      if (selectedMethod === "whatsapp") {
        console.log(">>> WHATSAPP FLOW CHOSEN <<<");
        // WhatsApp flow - open chat
        const phone = formData.phone.replace(/[^0-9]/g, "");
        const waPhone = phone.startsWith("0") ? `265${phone.slice(1)}` : phone;
        const itemsTxt = items.map(i => `• ${i.quantity} × ${i.name}`).join('\n');
        const msg = `🛒 *ORDER - PowerPod* #${newOrderId.slice(0, 8).toUpperCase()}

👤 ${formData.name}
📱 ${formData.phone}
📍 ${formData.location}

🛒 Items:
${itemsTxt}

💰 Total: ${formatMWK(calculatedTotal)}
🚚 Delivery: ${formData.location}

💳 Payment: Pay on Delivery

Thank you! 🙏`;
        console.log("Opening WhatsApp with phone:", waPhone);
        window.open(`https://wa.me/${waPhone}?text=${encodeURIComponent(msg)}`, "_blank");

        setOrderId(newOrderId);
        clear();
        navigate(`/orders/${newOrderId}`);
        toast({ title: "Order sent to WhatsApp!" });
        setSubmitting(false);
        return;
      }

      // PayChangu flow only reached if NOT whatsapp
      console.log(">>> PAYCHANGU FLOW CHOSEN <<<");
      const customerEmail = `${formData.phone.replace(/[^0-9]/g, "")}@powerpod.mw`;
      const customerName = formData.name;

      const { createPayChanguPayment } = await import("@/lib/paychangu");
        
      const payment = await createPayChanguPayment({
        amount: calculatedTotal,
        currency: "MWK",
        email: customerEmail,
        firstName: customerName.split(" ")[0] || customerName,
        lastName: customerName.split(" ").slice(1).join(" ") || "",
        txRef: `PP-${newOrderId.slice(0, 8).toUpperCase()}`,
        callbackUrl: `${window.location.origin}/api/payment/callback?orderId=${newOrderId}`,
        returnUrl: `${window.location.origin}/orders/${newOrderId}?payment=complete`,
        title: "PowerPod Order Payment",
        description: `Order #${newOrderId.slice(0, 8).toUpperCase()}`,
      });
      
      console.log("PayChangu response:", payment);
      
      if (payment.link) {
        console.log("!!! REDIRECTING TO PAYCHANGU:", payment.link);
        window.location.replace(payment.link);
      } else {
        console.log("ERROR: No link from PayChangu");
        setOrderId(newOrderId);
        clear();
        navigate(`/orders/${newOrderId}`);
        toast({ title: "Order placed!", description: `Order #${newOrderId.slice(0, 8).toUpperCase()}` });
      }
    } catch (err: any) {
      console.error("Payment error:", err);
      toast({ title: "Payment failed", description: err.message || "Please try again", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleWhatsAppOrder = async () => {
    setSubmitting(true);
    try {
      const newOrderId = await createOrder();
      if (!newOrderId) return;

      const phone = formData.phone.replace(/[^0-9]/g, "");
      const waPhone = phone.startsWith("0") ? `265${phone.slice(1)}` : phone;
      const itemsTxt = items.map(i => `• ${i.quantity} × ${i.name}`).join('\n');
      const msg = `🛒 *ORDER - PowerPod* #${newOrderId.slice(0, 8).toUpperCase()}

👤 ${formData.name}
📱 ${formData.phone}
📍 ${formData.location}

🛒 Items:
${itemsTxt}

💰 Total: ${formatMWK(calculatedTotal)}
🚚 Delivery: ${formData.location}

💳 Payment: Pay on Delivery

Thank you! 🙏`;
      window.open(`https://wa.me/${waPhone}?text=${encodeURIComponent(msg)}`, "_blank");

      setOrderId(newOrderId);
      clear();
      navigate(`/orders/${newOrderId}`);
      toast({ title: "Order sent to WhatsApp!", description: `Order #${newOrderId.slice(0, 8).toUpperCase()}` });
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
          <h2 className="font-display font-bold text-lg mb-4">
            <Truck className="h-5 w-5 inline mr-2" />
            Delivery Option
          </h2>
          <div className="mb-4 p-3 rounded-lg bg-blue-50 border border-blue-200 flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-blue-500" />
            <span>Delivering to: <strong>{formData.location}</strong></span>
          </div>
          <form onSubmit={handleDeliverySubmit} className="space-y-4">
            <div className="space-y-3">
              {(() => {
                const quotes = getDeliveryQuote(formData.location, subtotal);
                return quotes.map((quote) => (
                  <label key={quote.type} className={cn(
                    "flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors",
                    deliveryMethod === quote.type ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                  )}>
                    <input
                      type="radio"
                      name="delivery"
                      value={quote.type === "free" ? "standard" : quote.type}
                      checked={deliveryMethod === quote.type || (quote.type === "free" && deliveryMethod === "standard")}
                      onChange={(e) => setDeliveryMethod(e.target.value as "standard" | "express")}
                      className="h-4 w-4"
                    />
                    <Clock className={cn("h-5 w-5", quote.type === "express" ? "text-orange-500" : "text-green-500")} />
                    <div className="flex-1">
                      <p className="font-medium">
                        {quote.type === "free" ? "FREE Delivery" : quote.type === "express" ? "Express Delivery" : "Standard Delivery"}
                      </p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" /> Arrives in {quote.eta}
                      </p>
                    </div>
                    <span className={cn("font-semibold", quote.fee === 0 ? "text-green-500" : "")}>
                      {quote.fee === 0 ? "FREE" : formatMWK(quote.fee)}
                    </span>
                  </label>
                ));
              })()}
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
            <h2 className="font-display font-bold text-lg mb-4">Choose How to Pay</h2>
            <div className="space-y-3">
              <label className={cn(
                "flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors",
                paymentMethod === "paychangu" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
              )}>
                <input
                  type="radio"
                  name="payment"
                  value="paychangu"
                  checked={paymentMethod === "paychangu"}
                  onChange={() => {
                    console.log("Radio: Setting paymentMethod to paychangu");
                    setPaymentMethod("paychangu");
                  }}
                  className="h-4 w-4"
                />
                <Wallet className="h-5 w-5 text-green-600" />
                <div className="flex-1">
                  <p className="font-medium">Pay Now (Mobile Money / Card)</p>
                  <p className="text-sm text-muted-foreground">PayChangu - Airtel Money, TNM Mpamba, Visa</p>
                </div>
                <Check className={cn("h-5 w-5", paymentMethod === "paychangu" ? "text-green-500" : "text-gray-300")} />
              </label>

              <label className={cn(
                "flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors",
                paymentMethod === "whatsapp" ? "border-green-500 bg-green-500/5" : "border-border hover:border-green-500/50"
              )}>
                <input
                  type="radio"
                  name="payment"
                  value="whatsapp"
                  checked={paymentMethod === "whatsapp"}
                  onChange={() => {
                    console.log("Radio: Setting paymentMethod to whatsapp");
                    setPaymentMethod("whatsapp");
                  }}
                  className="h-4 w-4"
                />
                <MessageCircle className="h-5 w-5 text-green-500" />
                <div className="flex-1">
                  <p className="font-medium">Pay via WhatsApp (Bank Transfer)</p>
                  <p className="text-sm text-muted-foreground">We'll send bank details - transfer first, we confirm</p>
                </div>
                <Check className={cn("h-5 w-5", paymentMethod === "whatsapp" ? "text-green-500" : "text-gray-300")} />
              </label>
            </div>
          </div>

          <div className="rounded-xl bg-card border border-border/60 p-6">
            <h2 className="font-display font-bold text-lg mb-4">Order Summary</h2>
            
            {/* Promo Code Input */}
            {!promoApplied ? (
              <div className="mb-4 p-3 rounded-lg bg-gray-50 border border-border/60">
                <div className="flex gap-2">
                  <Input
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    placeholder="Enter promo code"
                    className="flex-1"
                  />
                  <Button
                    onClick={applyPromoCode}
                    disabled={applyingPromo || !promoCode.trim()}
                    variant="outline"
                  >
                    {applyingPromo ? <Loader2 className="h-4 w-4 animate-spin" /> : "Apply"}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">{promoApplied.code}</span>
                  <span className="text-sm text-green-600">-{formatMWK(promoApplied.discount)}</span>
                </div>
                <button onClick={removePromo} className="p-1 hover:bg-green-100 rounded">
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

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
                {promoApplied && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span className="text-muted-foreground">Discount</span>
                    <span>-{formatMWK(promoApplied.discount)}</span>
                  </div>
                )}
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
              {submitting ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Processing...</> : (
                paymentMethod === "whatsapp" 
                  ? <><MessageCircle className="h-4 w-4 mr-2" /> Complete via WhatsApp</>
                  : <><Wallet className="h-4 w-4 mr-2" /> Pay {formatMWK(calculatedTotal)} Now</>
              )}
            </Button>
          </div>
        </div>
      )}

      {orderId && (
        <div className="mt-8 p-6 rounded-xl bg-green-500/10 border border-green-500/20 text-center">
          <Check className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h2 className="font-display font-bold text-xl mb-2">Order Placed!</h2>
          <p className="text-muted-foreground">Order #{orderId.slice(0, 8).toUpperCase()}</p>
          <Button asChild variant="hero" className="mt-4">
            <Link to="/orders">View Orders</Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default Checkout;