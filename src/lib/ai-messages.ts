// PowerPod AI WhatsApp Message Templates
// Personalized, human-like messages powered by AI

interface OrderDetails {
  orderId: string;
  customerName: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  total: number;
  location: string;
  deliveryMethod: string;
  paymentMethod?: string;
  eta?: string;
}

interface StatusUpdate {
  orderId: string;
  customerName: string;
  customerPhone?: string;
  status: 'new' | 'confirmed' | 'processing' | 'dispatched' | 'delivered' | 'cancelled';
  items: Array<{ name: string; quantity: number; price?: number }>;
  total?: number;
  eta?: string;
}

// Generate confirmation code for tracking
const generateTrackingCode = (orderId: string) => `PP-${orderId.slice(0, 6).toUpperCase()}`;

// Format price in MWK
const formatMWK = (amount: number) => `MK ${amount.toLocaleString('en-US')}`;

// ============================================
// ORDER CONFIRMATION MESSAGE (Order Created)
// ============================================
export const orderConfirmation = (details: OrderDetails) => {
  const { customerName, items, total, location, deliveryMethod, eta = '1-2 days' } = details;
  const trackingCode = generateTrackingCode(details.orderId);
  
  const itemsList = items.map(i => `• ${i.quantity}× ${i.name}`).join('\n');

  return `🛒 *Order Confirmed!* ${customerName.split(' ')[0]} ✅

Your PowerPod order has been received!

📦 *ORDER DETAILS*
${itemsList}

━━━━━━━━━━━━━━━━━━━━
💰 Total: ${formatMWK(total)}
📍 Delivery: ${location}
🚚 Type: ${deliveryMethod}
📦 ETA: ${eta}
🔢 Ref: ${trackingCode}
━━━━━━━━━━━━━━━━━━━━

📌 *Next Steps*
1. We'll confirm payment shortly
2. Prepare your items
3. Dispatch & notify you

Track: https://powerpod-store.vercel.app/track/${details.orderId}`;
};

// ============================================
// PAYMENT CONFIRMATION MESSAGE  
// ============================================
export const paymentReceived = (details: OrderDetails) => {
  const { orderId, customerName, items, total, location, deliveryMethod, eta = '1-2 days' } = details;
  const trackingCode = generateTrackingCode(orderId);
  
  const itemsList = items.map(i => `• ${i.quantity}× ${i.name}`).join('\n');

  return `✅ *Payment Confirmed!* ${customerName.split(' ')[0]} 🎉

Thank you for your payment! Your order is now being prepared.

📦 *ORDER DETAILS*
${itemsList}

━━━━━━━━━━━━━━━━━━━━
💰 Total Paid: ${formatMWK(total)}
📍 Delivery to: ${location}
🚚 Delivery: ${deliveryMethod}
📦 ETA: ${eta}
🔢 Tracking: ${trackingCode}
━━━━━━━━━━━━━━━━━━━━

We'll notify you when it's dispatched! 📦

Track: https://powerpod-store.vercel.app/track/${orderId}`;
};

// ============================================
// ORDER DISPATCHED MESSAGE (Out for delivery)
// ============================================
export const orderDispatched = (update: StatusUpdate) => {
  const { orderId, customerName, items, eta = 'Today/Tomorrow' } = update;
  const trackingCode = generateTrackingCode(orderId);
  
  const itemsList = items.map(i => `• ${i.quantity}× ${i.name}`).join('\n');

  return `🚚 *Order On The Way!* ${customerName.split(' ')[0]} 📦

Your PowerPod order is out for delivery!

📦 *ITEMS*
${itemsList}

━━━━━━━━━━━━━━━━━━━━
🔢 Order Ref: ${trackingCode}
📦 Est. Delivery: ${eta}
━━━━━━━━━━━━━━━━━━━━

📌 Please ensure someone is available to receive your order.

Track your delivery: https://powerpod-store.vercel.app/track/${orderId}

Questions? Just reply here! 🙏`;
};

// ============================================
// ORDER DELIVERED MESSAGE (Complete)
// ============================================
export const orderDelivered = (update: StatusUpdate) => {
  const { orderId, customerName, items } = update;
  const trackingCode = generateTrackingCode(orderId);
  
  const itemsList = items.map(i => `• ${i.quantity}× ${i.name}`).join('\n');

  return `🎉 *Order Delivered!* ${customerName.split(' ')[0]} 🙌

You received your PowerPod order! 🎉

📦 *DELIVERED ITEMS*
${itemsList}

━━━━━━━━━━━━━━━━━━━━
🔢 Ref: ${trackingCode}
━━━━━━━━━━━━━━━━━━━━

Thank you for choosing PowerPod! 🙏

📝 Please leave a review to help other customers:
https://powerpod-store.vercel.app/product/powerbank-001

Need anything else? Just reply! ✨`;

};

// ============================================
// ORDER CANCELLED MESSAGE
// ============================================
export const orderCancelled = (update: StatusUpdate) => {
  const { orderId, customerName, total } = update;
  const trackingCode = generateTrackingCode(orderId);

  return `😔 *Order Cancelled* ${customerName.split(' ')[0]}

Your order ${trackingCode} (${formatMWK(total)}) has been cancelled.

If this was a mistake, we'd love to help you reorder! 

Browse: https://powerpod-store.vercel.app/shop

Questions? Just reply here! 🙏`;

};

// ============================================
// STATUS CHECK MESSAGE (for customers asking)
// ============================================
export const getStatusMessage = (orderId: string, status: string, items: any[], eta?: string) => {
  return `📦 *Order Status*

Your order #${generateTrackingCode(orderId)}:

📋 Status: *${status.toUpperCase()}*
${eta ? `📦 ETA: ${eta}` : ''}

${items.map(i => `• ${i.quantity}× ${i.name}`).join('\n')}

Track: https://powerpod-store.vercel.app/track/${orderId}`;
};

// ============================================
// GENERAL STATUS CHECK
// ============================================
export const statusCheck = (status: string, eta?: string) => {
  const statusMessages: Record<string, string> = {
    new: 'Just received! We\'re reviewing it now.',
    confirmed: 'Ready! We\'re preparing your order.',
    processing: 'Being packed with care...',
    dispatched: 'On its way to you!',
    delivered: 'You should have it now!',
  };
  
  return statusMessages[status] || 'Checking on it for you...';
};

// ============================================
// REMINDER MESSAGES (for admin to send)
// ============================================
export const reminderMessage = (details: OrderDetails, daysOverdue: number) => {
  return `⏰ *Payment Reminder* @${details.customerName.split(' ')[0]}

Just a friendly reminder about your PowerPod order!

📦 Order: ${generateTrackingCode(details.orderId)}
💰 Outstanding: ${formatMWK(details.total)}
📍 Delivery to: ${details.location}

Please confirm payment to secure your items. 

Questions? Reply here! 🙏`;
};

// ============================================
// THANK YOU / Upsell MESSAGE
// ============================================
export const thankYouMessage = (orderId: string, customerName: string) => {
  return `🙏 *Thanks for your order, @${customerName.split(' ')[0]}!*

We appreciate you choosing PowerPod!

🎁 As a returning customer, you'll get an exclusive discount on your next order. Just ask!

Check back soon for new arrivals! 🔥

Questions? I'm here! 😊`;
};

// ============================================
// BUILD WHATSAPP LINK
// ============================================
export const buildWhatsAppLink = (message: string, phone?: string) => {
  const defaultPhone = "265991234567"; // PowerPod WhatsApp
  const phoneNumber = phone?.replace(/[^0-9]/g, '') || defaultPhone;
  const formatted = phoneNumber.startsWith('0') 
    ? `265${phoneNumber.slice(1)}` 
    : phoneNumber;
  
  return `https://wa.me/${formatted}?text=${encodeURIComponent(message)}`;
};

// Default store contact
export const STORE_PHONE = "265991234567";
export const STORE_URL = "https://powerpod-store.vercel.app";
export const defaultMessage = "Hi PowerPod! I want to order.";