// PowerPod AI WhatsApp Message Templates
// Personalized, human-like messages powered by AI

interface OrderDetails {
  orderId: string;
  customerName: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  total: number;
  location: string;
  deliveryMethod: string;
  paymentMethod: string;
  eta?: string;
}

interface StatusUpdate {
  orderId: string;
  customerName: string;
  customerPhone: string;
  status: 'confirmed' | 'processing' | 'dispatched' | 'delivered' | 'cancelled';
  items: Array<{ name: string; quantity: number }>;
  eta?: string;
}

// Generate confirmation code for tracking
const generateTrackingCode = (orderId: string) => `PP-${orderId.slice(0, 6).toUpperCase()}`;

// Format price in MWK
const formatMWK = (amount: number) => `MK ${amount.toLocaleString('en-US')}`;

// ============================================
// ORDER CONFIRMATION MESSAGE
// ============================================
export const orderConfirmation = (details: OrderDetails) => {
  const { customerName, items, total, location, deliveryMethod, eta = '1-2 days' } = details;
  const trackingCode = generateTrackingCode(details.orderId);
  
  const itemsList = items
    .map(i => `• ${i.quantity}× ${i.name}`)
    .join('\n');

  return `🛒 *Order Confirmed!* @${customerName.split(' ')[0]} ✅

Your PowerPod order is in! Here's the summary:

${itemsList}

━━━━━━━━━━━━━━━━━━
💰 Total: ${formatMWK(total)}
🚚 Delivery: ${location}
📦 ETA: ${eta} (${deliveryMethod})
🔢 Tracking: ${trackingCode}
━━━━━━━━━━━━━━━━━━

We'll WhatsApp you when it's dispatched! 

Need help? Just reply here. 🙏

Track: https://powerpod-store.vercel.app/track/${details.orderId}`;
};

// ============================================
// PAYMENT CONFIRMATION MESSAGE  
// ============================================
export const paymentReceived = (details: OrderDetails) => {
  const { orderId, customerName, items, total, location } = details;
  const trackingCode = generateTrackingCode(orderId);

  return `✅ *Payment Confirmed!* @${customerName.split(' ')[0]}

Thanks for paying! 🎉 Your order is now being processed.

📦 Order: ${trackingCode}
💰 Amount: ${formatMWK(total)}
📍 Shipping to: ${location}

We'll let you know when it's on its way!

Track: https://powerpod-store.vercel.app/track/${orderId}`;
};

// ============================================
// ORDER DISPATCHED MESSAGE
// ============================================
export const orderDispatched = (update: StatusUpdate) => {
  const { orderId, customerName, items, eta = 'Today' } = update;
  const trackingCode = generateTrackingCode(orderId);
  
  const itemsList = items.map(i => `• ${i.quantity}× ${i.name}`).join('\n');

  return `🚚 *Order On The Way!* @${customerName.split(' ')[0]}

Your PowerPod order is out for delivery! 📦

${itemsList}

━━━━━━━━━━━━━━━━━━
🔢 Order: ${trackingCode}
📦 Est. delivery: ${eta}
━━━━━━━━━━━━━━━━━━

Track your rider: https://powerpod-store.vercel.app/track/${orderId}

Questions? Just reply here! 🙏`;
};

// ============================================
// ORDER DELIVERED MESSAGE
// ============================================
export const orderDelivered = (update: StatusUpdate) => {
  const { orderId, customerName, items } = update;
  const trackingCode = generateTrackingCode(orderId);
  
  const itemsList = items.map(i => `• ${i.quantity}× ${i.name}`).join('\n');

  return `🎉 *Order Delivered!* @${customerName.split(' ')[0]}

You got it! 🙌 

${itemsList}

━━━━━━━━━━━━━━━━━━
🔢 Order: ${trackingCode}
━━━━━━━━━━━━━━━━━━

Hope you love your PowerPod gear! 

Leave a review? It helps other customers! ⭐

Thanks for choosing PowerPod! 🙏✨

Feedback: https://powerpod-store.vercel.app/reviews`;
};

// ============================================
// ORDER CANCELLED MESSAGE
// ============================================
export const orderCancelled = (update: StatusUpdate) => {
  const { orderId, customerName, total } = update;

  return `😔 *Order Cancelled* @${customerName.split(' ')[0]}

Your order #${generateTrackingCode(orderId)} (${formatMWK(total)}) has been cancelled.

If this was a mistake or you want to reorder, just let us know! We're always here to help. 👍

Questions? Reply here! 🙏`;
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