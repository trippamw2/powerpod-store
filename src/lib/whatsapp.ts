// PowerPod WhatsApp helpers
export const WHATSAPP_NUMBER = "265888000000"; // TODO: replace with real PowerPod number
export const STORE_URL = "https://powerpod-life.vercel.app"; // Update with actual store URL

export const buildWhatsAppLink = (message: string) => {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;
};

export const defaultMessage = "Hi PowerPod, I want to order.";

export const productMessage = (name: string, price: number, imageUrl?: string) => {
  const imagePart = imageUrl ? `\n📷 View: ${imageUrl}` : "";
  return `Hi PowerPod 👋

I'd like to order:
• ${name} — MK ${price.toLocaleString("en-US")}
${imagePart}

Please share next steps. Thanks!`;
};

export const comboMessage = (name: string, price: number, imageUrl?: string) => {
  const imagePart = imageUrl ? `\n📷 View: ${imageUrl}` : "";
  return `Hi PowerPod 👋

I'd like to order the *${name}* bundle — MK ${price.toLocaleString("en-US")}.
${imagePart}

Please share next steps. Thanks!`;
};

export interface CartLine { name: string; quantity: number; price: number; imageUrl?: string }
export interface CustomerDetails { name: string; phone: string; location: string; notes?: string }

export const cartMessage = (lines: CartLine[], total: number, customer: CustomerDetails, orderId?: string) => {
  const itemsTxt = lines
    .map((l) => `• ${l.quantity} × ${l.name} — MK ${(l.price * l.quantity).toLocaleString("en-US")}`)
    .join("\n");
  return [
    "Hi PowerPod 👋  I'd like to place this order:",
    "",
    itemsTxt,
    "",
    `*Total: MK ${total.toLocaleString("en-US")}*`,
    "",
    `👤 ${customer.name}`,
    `📞 ${customer.phone}`,
    `📍 ${customer.location}`,
    customer.notes ? `📝 ${customer.notes}` : "",
    orderId ? `\nOrder ref: ${orderId.slice(0, 8).toUpperCase()}` : "",
    "\nThanks!",
  ].filter(Boolean).join("\n");
};
