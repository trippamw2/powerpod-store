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
import { ArrowLeft, Check, Loader2, Truck, CreditCard, MapPin, Tag, Zap } from "lucide-react";

const Checkout = () => {
  const { user } = useAuth();
  const { items, subtotal, clear } = useCart();
  const navigate = useNavigate();
  const { settings, loading: settingsLoading } = useDeliverySettings();

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

  // Calculate totals
  const deliveryFee = settingsLoading ? 0 : (
    deliveryMethod === "express"
      ? (subtotal >= (settings.freeDeliveryThreshold || 50000) ? 3500 : (settings.expressDeliveryFee || 8500))
      : (subtotal >= (settings.freeDeliveryThreshold || 50000) ? 0 : (settings.deliveryFee || 5000))
  );
  const discount = promoApplied?.discount || 0;
  const total = subtotal - discount + deliveryFee;

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
        customer_id: user?.id,
        customer_name: formData.name,
        customer_phone: formData.phone,
        customer_location: formData.location,
        notes: formData.deliveryNote,
        subtotal_mwk: subtotal,
        delivery_fee_mwk: deliveryFee,
        discount_mwk: discount,
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

      // Payment flow
      if (paymentMethod === "offline") {
        clear();
        navigate(`/orders/${orderId}?payment=pending`);
        toast({ title: "Order placed!", description: "Complete payment via bank transfer" });
        return;
      }

      // PayChangu
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
        clear();
        navigate(`/orders/${orderId}`);
        toast({ title: "Order placed!" });
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
            <CreditCard className="h-4 w-4 text-green-500" /> Payment
          </h2>
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => setPaymentMethod("paychangu")}
              className={`w-full py-3 px-4 rounded-lg border flex items-center gap-3 ${
                paymentMethod === "paychangu"
                  ? "border-orange-500 bg-orange-50"
                  : "bg-white border-gray-200"
              }`}
            >
              <div className="h-10 w-10 rounded-lg bg-green-500 flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-white" />
              </div>
              <div className="text-left">
                <p className="font-medium">Pay Online</p>
                <p className="text-xs text-gray-500">Airtel Money, TNM Mpamba, Visa</p>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod("offline")}
              className={`w-full py-3 px-4 rounded-lg border flex items-center gap-3 ${
                paymentMethod === "offline"
                  ? "border-orange-500 bg-orange-50"
                  : "bg-white border-gray-200"
              }`}
            >
              <div className="h-10 w-10 rounded-lg bg-blue-500 flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-white" />
              </div>
              <div className="text-left">
                <p className="font-medium">Bank Transfer</p>
                <p className="text-xs text-gray-500">Pay via offline bank transfer</p>
              </div>
            </button>
          </div>
        </div>

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
            {discount > 0 && (
              <div className="flex justify-between text-green-400">
                <span>Discount</span>
                <span>-{formatMWK(discount)}</span>
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