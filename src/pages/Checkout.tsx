import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { formatMWK } from "@/data/products";
import { useDeliverySettings } from "@/hooks/useDeliverySettings";
import { useLoyalty } from "@/hooks/useLoyalty";
import { ArrowLeft, Check, Loader2, Truck, CreditCard, MapPin, Tag, Zap, Gift } from "lucide-react";

const Checkout = () => {
  const { user } = useAuth();
  const { items, subtotal, clear } = useCart();
  const navigate = useNavigate();
  const { settings, loading: settingsLoading } = useDeliverySettings();
  const { loyalty, program, getRewardValue, redeemPoints } = useLoyalty(user?.id, user?.email);

  const [formData, setFormData] = useState({
    name: user?.user_metadata?.full_name || user?.email?.split("@")[0] || "",
    phone: user?.user_metadata?.phone || "",
    location: "",
    deliveryNote: "",
  });
  const [deliveryMethod, setDeliveryMethod] = useState<"standard" | "express">("standard");
  const [paymentMethod, setPaymentMethod] = useState<"paychangu" | "offline">("paychangu");
  const [submitting, setSubmitting] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState<{ code: string; discount: number } | null>(null);
  const [usePoints, setUsePoints] = useState(false);
  const [redeeming, setRedeeming] = useState(false);

  // Calculate totals
  const deliveryFee = settingsLoading ? 0 : (
    deliveryMethod === "express"
      ? (subtotal >= (settings.freeDeliveryThreshold || 50000) ? 3500 : (settings.expressDeliveryFee || 8500))
      : (subtotal >= (settings.freeDeliveryThreshold || 50000) ? 0 : (settings.deliveryFee || 5000))
  );
  const promoDiscount = promoApplied?.discount || 0;
  
  // Calculate loyalty discount
  const availablePoints = loyalty?.available_points || 0;
  const maxPointsToUse = Math.min(availablePoints, program?.points_to_redeem || 100);
  const loyaltyDiscount = usePoints && loyalty && program 
    ? Math.floor(maxPointsToUse / program.points_to_redeem) * program.reward_value_mwk 
    : 0;
  
  const totalDiscount = promoDiscount + loyaltyDiscount;
  const total = subtotal - totalDiscount + deliveryFee;

  const handleRedeemPoints = async () => {
    if (!user || !loyalty || !program) return;
    
    const maxPoints = Math.min(availablePoints, program.points_to_redeem);
    if (maxPoints < program.points_to_redeem) {
      toast({ title: `Need ${program.points_to_redeem} points to redeem`, variant: "destructive" });
      return;
    }
    
    setRedeeming(true);
    try {
      const result = await redeemPoints(maxPoints, subtotal);
      if (result.success) {
        setUsePoints(true);
        toast({ title: "Points applied!", description: `-${formatMWK(result.discount)} discount` });
      } else {
        toast({ title: "Could not redeem", description: result.error, variant: "destructive" });
      }
    } catch {
      toast({ title: "Error redeeming points", variant: "destructive" });
    } finally {
      setRedeeming(false);
    }
  };

  const applyPromo = async () => {
    if (!promoCode.trim()) return;
    try {
      const { data } = await supabase.from("promo_codes").select("*")
        .eq("code", promoCode.toUpperCase()).eq("is_active", true).single();
      if (!data) { toast({ title: "Invalid code", variant: "destructive" }); return; }
      
      const now = new Date();
      if (new Date(data.start_date) > now || new Date(data.end_date) < now) {
        toast({ title: "Code expired", variant: "destructive" }); return;
      }
      
      const disc = data.type === "percentage" 
        ? Math.round(subtotal * (data.value / 100))
        : Math.min(data.value, subtotal);
      setPromoApplied({ code: data.code, discount: disc });
      toast({ title: "Promo applied!", description: `-${formatMWK(disc)}` });
    } catch { toast({ title: "Invalid code", variant: "destructive" }); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.location) {
      toast({ title: "Please fill all fields", variant: "destructive" });
      return;
    }
    if (items.length === 0) { toast({ title: "Cart is empty", variant: "destructive" }); return; }

    setSubmitting(true);
    try {
      // Create order
      const { data: order, error } = await supabase.from("orders").insert({
        user_id: user?.id,
        customer_name: formData.name,
        customer_phone: formData.phone,
        customer_location: formData.location,
        notes: formData.deliveryNote,
        subtotal_mwk: subtotal,
        delivery_fee_mwk: deliveryFee,
        discount_mwk: totalDiscount,
        total_mwk: total,
        payment_method: paymentMethod,
        delivery_method: deliveryMethod,
        status: paymentMethod === "offline" ? "pending_payment" : "new",
      }).select().single();

      if (error) throw error;
      const orderId = order.id;

      // Add order items
      const orderItems = items.map(item => ({
        order_id: orderId,
        product_id: item.productKey.split("-")[0],
        product_name: item.name,
        unit_price_mwk: item.price,
        quantity: item.quantity,
      }));
      await supabase.from("order_items").insert(orderItems);

      // Use promo code
      if (promoApplied) {
        await supabase.from("promo_codes").update({ used_count: 1 })
          .eq("code", promoApplied.code);
      }

      // Use loyalty points
      if (usePoints && loyalty && program) {
        const pointsToRedeem = Math.min(loyalty.available_points, program.points_to_redeem);
        // Points will be deducted by the redeemPoints function
      }

      // Payment flow
      if (paymentMethod === "offline") {
        const whatsAppMessage = `Hello PowerPod! I want to pay for my order #${orderId.slice(0, 8).toUpperCase()} (${formatMWK(total)}). Please send payment details.`;
        const whatsAppLink = `https://wa.me/265884400000?text=${encodeURIComponent(whatsAppMessage)}`;
        clear();
        window.open(whatsAppLink, "_blank");
        navigate(`/orders/${orderId}?payment=pending`);
        toast({ title: "Order placed!", description: "Check WhatsApp for payment details" });
        return;
      }

      // PayChangu
      try {
        const { createPayChanguPayment } = await import("@/lib/paychangu");
        const payment = await createPayChanguPayment({
          amount: total,
          currency: "MWK",
          email: `${formData.phone.replace(/[^0-9]/g, "")}@powerpod.mw`,
          firstName: formData.name.split(" ")[0],
          lastName: formData.name.split(" ").slice(1).join(" ") || "",
          txRef: `PP-${orderId.slice(0, 8).toUpperCase()}`,
          callbackUrl: `${window.location.origin}/api/payment/callback?orderId=${orderId}`,
          returnUrl: `${window.location.origin}/orders/${orderId}?payment=complete`,
          title: "PowerPod Order",
          description: `Order #${orderId.slice(0, 8).toUpperCase()}`,
        });

        if (payment.link) {
          window.location.replace(payment.link);
        } else {
          toast({ title: "Order placed! We'll contact you for payment." });
          clear();
          navigate(`/orders/${orderId}`);
        }
      } catch (payError: any) {
        console.error("PayChangu error:", payError);
        toast({ title: "Payment issue", description: "We'll call you for payment details." });
        clear();
        navigate(`/orders/${orderId}?payment=pending`);
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container py-12 text-center">
        <CreditCard className="h-12 w-12 mx-auto text-gray-300 mb-4" />
        <h2 className="text-xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-4">Add some products to checkout</p>
        <Button asChild><Link to="/shop">Shop Now</Link></Button>
      </div>
    );
  }

  return (
    <div className="container py-4 sm:py-8 max-w-2xl">
      <Link to="/shop" className="inline-flex items-center gap-2 text-sm text-gray-500 mb-4">
        <ArrowLeft className="h-4 w-4" /> Back to shop
      </Link>

      <h1 className="font-display font-bold text-2xl sm:text-3xl mb-6">Checkout</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Contact Info */}
        <div className="bg-gray-50 rounded-xl p-4 sm:p-5">
          <h2 className="font-semibold mb-3 flex items-center gap-2">
            <Check className="h-4 w-4 text-green-500" /> Your Details
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Full Name *</Label>
              <Input
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                placeholder="Your name"
                required
              />
            </div>
            <div>
              <Label className="text-xs">Phone Number *</Label>
              <Input
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
                placeholder="e.g., 888000000"
                required
              />
            </div>
          </div>
        </div>

        {/* Delivery */}
        <div className="bg-gray-50 rounded-xl p-4 sm:p-5">
          <h2 className="font-semibold mb-3 flex items-center gap-2">
            <Truck className="h-4 w-4 text-green-500" /> Delivery
          </h2>
          <div className="space-y-3">
            <div>
              <Label className="text-xs">Location / Area *</Label>
              <Input
                value={formData.location}
                onChange={e => setFormData({...formData, location: e.target.value})}
                placeholder="e.g., Area 9, Blantyre or Lilongwe"
                required
              />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setDeliveryMethod("standard")}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium border ${
                  deliveryMethod === "standard" 
                    ? "bg-orange-500 text-white border-orange-500" 
                    : "bg-white border-gray-200"
                }`}
              >
                Standard {subtotal >= 50000 ? "(Free)" : `(~${formatMWK(5000)})`}
              </button>
              <button
                type="button"
                onClick={() => setDeliveryMethod("express")}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium border ${
                  deliveryMethod === "express"
                    ? "bg-orange-500 text-white border-orange-500"
                    : "bg-white border-gray-200"
                }`}
              >
                Express {subtotal >= 50000 ? "(+3500)" : `(~${formatMWK(8500)})`}
              </button>
            </div>
          </div>
        </div>

        {/* Payment */}
        <div className="bg-gray-50 rounded-xl p-4 sm:p-5">
          <h2 className="font-semibold mb-3 flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-green-500" /> Payment Method
          </h2>
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => setPaymentMethod("paychangu")}
              className={`w-full py-4 px-4 rounded-xl border-2 flex items-center gap-3 transition-all ${
                paymentMethod === "paychangu"
                  ? "border-orange-500 bg-orange-50 shadow-sm"
                  : "bg-white border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-sm">
                <CreditCard className="h-6 w-6 text-white" />
              </div>
              <div className="text-left flex-1">
                <p className="font-semibold">Pay Online</p>
                <p className="text-xs text-gray-500">Airtel Money • TNM Mpamba • Cards</p>
              </div>
              <div className={`h-5 w-5 rounded-full border-2 ${paymentMethod === "paychangu" ? "bg-orange-500 border-orange-500" : "border-gray-300"}`}>
                {paymentMethod === "paychangu" && <Check className="h-4 w-4 text-white" />}
              </div>
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod("offline")}
              className={`w-full py-4 px-4 rounded-xl border-2 flex items-center gap-3 transition-all ${
                paymentMethod === "offline"
                  ? "border-orange-500 bg-orange-50 shadow-sm"
                  : "bg-white border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm">
                <svg viewBox="0 0 24 24" className="h-6 w-6 text-white" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.198-.347.223-.644.075-.297-.15-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.149-.15.347-.347.52-.521.151-.174.198-.298.297-.496.149-.198.074-.347-.05-.486-.124-.149-.297-.347-.446-.521-.149-.174-.297-.297-.495-.297h-.45c.262 0 .521-.074.643.371.149.372.52 1.22.567 1.387.074.15.223.174.446.074.223-.074.52-.148.767-.297.272-.174.442-.273.589-.347.272-.149.521-.124.714.124.173.223.52.595.698.795.173.174.347.223.496.149.173-.074.348-.124.595-.372.272-.272.395-.52.52-.795.074-.174.074-.348.025-.521-.074-.173-.149-.297-.272-.397h-.396c.223 0 .521.025.768.372zM2.58 2.205c.521-.644.944-.396 1.598-.099.654.297 1.095.694 1.318 1.006.223.312.124.669-.074 1.006-.173.312-.521 1.006-.595 1.083-.074.074-.223.124-.372.025-.149-.099-.521-.347-1.006-.669-.471-.321-1.006-.595-1.44-.669-.421-.074-.919-.025-1.318.223-.421.272-.595.595-.669.743-.074.149-.025.223.124.347.149.124.347.347.521.521.173.173.347.223.496.347.173.124.272.223.371.372.124.149.149.272.049.446-.074.173-.347.595-.595.92-.248.322-.471.546-.595.645-.124.099-.272.074-.371-.025-.099-.099-.521-.595-.768-1.006-.248-.421-.347-.595-.496-.744-.149-.149-.272-.272-.372-.297-.099-.025-.198-.025-.297.025-.099.049-.272.124-.495.297z"/>
                </svg>
              </div>
              <div className="text-left flex-1">
                <p className="font-semibold">WhatsApp Payment</p>
                <p className="text-xs text-gray-500">We'll send details on WhatsApp</p>
              </div>
              <div className={`h-5 w-5 rounded-full border-2 ${paymentMethod === "offline" ? "bg-orange-500 border-orange-500" : "border-gray-300"}`}>
                {paymentMethod === "offline" && <Check className="h-4 w-4 text-white" />}
              </div>
            </button>
          </div>
        </div>

        {/* Loyalty Points - only show if logged in and has points */}
        {user && loyalty && loyalty.available_points >= (program?.points_to_redeem || 100) && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gift className="h-5 w-5 text-amber-600" />
                <div>
                  <p className="font-medium text-sm">Use Rewards Points</p>
                  <p className="text-xs text-gray-600">{loyalty.available_points} points available</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleRedeemPoints}
                disabled={redeeming || usePoints}
                className={`py-1.5 px-3 rounded-lg text-sm font-medium ${
                  usePoints 
                    ? "bg-green-500 text-white"
                    : "bg-amber-500 text-white hover:bg-amber-600"
                }`}
              >
                {redeeming ? "Applying..." : usePoints ? "Applied!" : "Use Points"}
              </button>
            </div>
            {loyaltyDiscount > 0 && (
              <p className="text-xs text-green-600 mt-2">✓ -{formatMWK(loyaltyDiscount)} discount applied!</p>
            )}
          </div>
        )}

        {/* Promo */}
        <div className="bg-gray-50 rounded-xl p-4">
          <Label className="text-xs">Promo Code</Label>
          <div className="flex gap-2 mt-1">
            <Input
              value={promoCode}
              onChange={e => setPromoCode(e.target.value)}
              placeholder="Enter code"
              className="flex-1"
            />
            <Button type="button" variant="outline" onClick={applyPromo}>Apply</Button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-gray-900 text-white rounded-xl p-4 sm:p-5">
          <h2 className="font-semibold mb-3">Order Summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>{items.length} items</span>
              <span>{formatMWK(subtotal)}</span>
            </div>
            {promoDiscount > 0 && (
              <div className="flex justify-between text-green-400">
                <span>Promo ({promoApplied?.code})</span>
                <span>-{formatMWK(promoDiscount)}</span>
              </div>
            )}
            {loyaltyDiscount > 0 && (
              <div className="flex justify-between text-green-400">
                <span>Rewards Points</span>
                <span>-{formatMWK(loyaltyDiscount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Delivery</span>
              <span>{deliveryFee === 0 ? "Free" : formatMWK(deliveryFee)}</span>
            </div>
            <div className="border-t border-white/20 pt-2 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>{formatMWK(total)}</span>
            </div>
          </div>
        </div>

        <Button 
          type="submit" 
          disabled={submitting || settingsLoading}
          className="w-full py-3 text-lg bg-orange-500 hover:bg-orange-600"
        >
          {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : (
            <> {paymentMethod === "offline" ? "Place Order" : "Pay Now"} <Zap className="h-5 w-5 ml-2" /></>
          )}
        </Button>
      </form>
    </div>
  );
};

export default Checkout;