// PowerPod WhatsApp helpers
export const WHATSAPP_NUMBER = "265991234567"; // Replace with real PowerPod number
export const STORE_URL = "https://powerpod-store.vercel.app";

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

export interface CartItem {
  productKey: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface CustomerDetails {
  name: string;
  phone: string;
  location: string;
  deliveryMethod: string;
  notes?: string;
}

export const buildOrderMessage = (
  items: CartItem[],
  total: number,
  customer: CustomerDetails,
  orderId?: string,
  storeUrl?: string
) => {
  const itemsTxt = items
    .map((i) => `• ${i.quantity} × ${i.name} — MK ${(i.price * i.quantity).toLocaleString("en-US")}`)
    .join("\n");

  const imagesSection = storeUrl
    ? `\n📸 Product images: ${storeUrl}`
    : "";

  return `📦 *NEW ORDER - PowerPod* ⚡

━━━━━━━━━━━━━━━━━━━━━━━━

*📋 ORDER #${orderId ? orderId.slice(0, 8).toUpperCase() : "PENDING"}*

━━━━━━━━━━━━━━━━━━━━━━━━

*👤 CUSTOMER DETAILS*
━━━━━━━━━━━━━━━━━━━━━━━━
👤 Name: ${customer.name}
📞 Phone: ${customer.phone}
📍 Location: ${customer.location}
🚚 Delivery: ${customer.deliveryMethod}
${customer.notes ? `📝 Notes: ${customer.notes}` : ""}

━━━━━━━━━━━━━━━━━━━━━━━━

*🛒 ORDER ITEMS*
━━━━━━━━━━━━━━━━━━━━━━━━
${itemsTxt}

━━━━━━━━━━━━━━━━━━━━━━━━

*💰 PAYMENT SUMMARY*
━━━━━━━━━━━━━━━━━━━━━━━━
Subtotal: MK ${total.toLocaleString("en-US")}
Delivery: FREE 🚚
━━━━━━━━━━━━━━━━━━━━━━━━
*TOTAL: MK ${total.toLocaleString("en-US")}*
━━━━━━━━━━━━━━━━━━━━━━━━

Please confirm order and send payment link. Thank you! 🙏`;

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

export interface CartLine { name: string; quantity: number; price: number; imageUrl?: string }