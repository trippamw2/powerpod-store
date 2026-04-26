export type PromoType = "percentage" | "fixed";

export interface PromoCode {
  id: string;
  code: string;
  name: string;
  type: PromoType;
  value: number;
  min_order: number;
  max_uses: number;
  used_count: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
}

export const applyPromoCode = async (
  code: string,
  subtotal: number
): Promise<{ valid: boolean; discount: number; message: string; promo?: PromoCode }> => {
  try {
    const { data: promos, error } = await supabase
      .from("promo_codes")
      .select("*")
      .eq("code", code.toUpperCase())
      .eq("is_active", true)
      .single();

    if (error || !promos) {
      return { valid: false, discount: 0, message: "Invalid promo code" };
    }

    const now = new Date();
    const start = new Date(promos.start_date);
    const end = new Date(promos.end_date);

    if (now < start) {
      return { valid: false, discount: 0, message: "Promo code not yet active" };
    }

    if (now > end) {
      return { valid: false, discount: 0, message: "Promo code has expired" };
    }

    if (promos.used_count >= promos.max_uses) {
      return { valid: false, discount: 0, message: "Promo code usage limit reached" };
    }

    if (subtotal < promos.min_order) {
      return { 
        valid: false, 
        discount: 0, 
        message: `Minimum order ${formatMWK(promos.min_order)} required` 
      };
    }

    let discount = 0;
    if (promos.type === "percentage") {
      discount = Math.round(subtotal * (promos.value / 100));
    } else {
      discount = Math.min(promos.value, subtotal);
    }

    return {
      valid: true,
      discount,
      message: promos.type === "percentage" 
        ? `${promos.value}% off (${formatMWK(discount)})`
        : `${formatMWK(discount)} off`,
      promo: promos,
    };
  } catch {
    return { valid: false, discount: 0, message: "Invalid promo code" };
  }
};

export const usePromoCode = async (code: string): Promise<void> => {
  await supabase.rpc("increment_promo_usage", { promo_code: code });
};