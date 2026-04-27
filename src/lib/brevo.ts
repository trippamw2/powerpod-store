// PowerPod Brevo Email Integration
// Send transactional emails via Brevo (formerly Sendinblue)

const BREVO_API_KEY = import.meta.env.VITE_BREVO_API_KEY;
const BREVO_LIST_ID = import.meta.env.VITE_BREVO_LIST_ID || "2";

interface SendEmailParams {
  to: string;
  toName?: string;
  subject: string;
  htmlContent?: string;
  textContent?: string;
  params?: Record<string, string>;
}

interface OrderEmailParams {
  to: string;
  toName: string;
  orderId: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  total: number;
  location: string;
  deliveryMethod: string;
  eta?: string;
  type: 'confirmation' | 'payment' | 'dispatched' | 'delivered';
}

// Template IDs - create these in Brevo dashboard
const TEMPLATES = {
  orderConfirmation: 1,
  paymentReceived: 2, 
  orderDispatched: 3,
  orderDelivered: 4,
};

const BREVO_API_URL = "https://api.brevo.com/v3";

export const config = {
  api: {
    bodyParser: {
      raw: true,
    },
  },
};

// ============================================
// SEND TRANSACTIONAL EMAIL
// ============================================
async function sendBrevoEmail(params: SendEmailParams): Promise<boolean> {
  if (!BREVO_API_KEY) {
    console.warn("[Brevo] No API key configured");
    return false;
  }

  try {
    const response = await fetch(`${BREVO_API_URL}/smtp/email`, {
      method: "POST",
      headers: {
        "api-key": BREVO_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sender: {
          name: "PowerPod Store",
          email: "orders@powerpod.mw",
        },
        to: [
          {
            email: params.to,
            name: params.toName || params.to,
          },
        ],
        subject: params.subject,
        htmlContent: params.htmlContent || params.textContent || "",
        textContent: params.textContent || "",
        params: params.params || {},
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("[Brevo] Error:", error);
      return false;
    }

    console.log("[Brevo] Email sent:", params.subject);
    return true;
  } catch (error) {
    console.error("[Brevo] Failed:", error);
    return false;
  }
}

// ============================================
// ORDER CONFIRMATION EMAIL
// ============================================
export const sendOrderConfirmationEmail = async (order: OrderEmailParams) => {
  const itemsHtml = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 8px 0;">${item.quantity} × ${item.name}</td>
        <td style="padding: 8px 0; text-align: right;">MK ${(item.price * item.quantity).toLocaleString()}</td>
      </tr>
    `
    )
    .join("");

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #f97316;">🛒 Order Confirmed!</h2>
      <p>Hi ${order.toName},</p>
      <p>Your PowerPod order is in! Here's the summary:</p>
      
      <table style="width: 100%; border-collapse: collapse;">
        ${itemsHtml}
        <tr style="border-top: 2px solid #f97316;">
          <td style="padding: 12px 0; font-weight: bold;">Total</td>
          <td style="padding: 12px 0; text-align: right; font-weight: bold;">MK ${order.total.toLocaleString()}</td>
        </tr>
      </table>
      
      <div style="background: #f3f4f6; padding: 16px; margin: 16px 0; border-radius: 8px;">
        <p style="margin: 4px 0;"><strong>📍 Delivery:</strong> ${order.location}</p>
        <p style="margin: 4px 0;"><strong>🚚 Method:</strong> ${order.deliveryMethod}</p>
        ${order.eta ? `<p style="margin: 4px 0;"><strong>📦 ETA:</strong> ${order.eta}</p>` : ""}
      </div>
      
      <p>Order #${order.orderId.slice(0, 8).toUpperCase()}</p>
      <p style="color: #6b7280; font-size: 14px;">We'll WhatsApp you with updates!</p>
      <p style="margin-top: 24px;">Thanks, PowerPod Team 🙏</p>
    </div>
  `;

  return sendBrevoEmail({
    to: order.to,
    toName: order.toName,
    subject: `Order Confirmed! 🎉 #${order.orderId.slice(0, 8).toUpperCase()}`,
    htmlContent: html,
  });
};

// ============================================
// PAYMENT RECEIVED EMAIL
// ============================================
export const sendPaymentReceivedEmail = async (order: OrderEmailParams) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #22c55e;">✅ Payment Confirmed!</h2>
      <p>Hi ${order.toName},</p>
      <p>Thanks for paying! Your order is being prepared.</p>
      
      <div style="background: #f3f4f6; padding: 16px; margin: 16px 0; border-radius: 8px;">
        <p style="margin: 4px 0;"><strong>Order #:</strong> ${order.orderId.slice(0, 8).toUpperCase()}</p>
        <p style="margin: 4px 0;"><strong>Amount Paid:</strong> MK ${order.total.toLocaleString()}</p>
        <p style="margin: 4px 0;"><strong>Delivery:</strong> ${order.location}</p>
      </div>
      
      <p>We'll let you know when it's dispatched! 🚚</p>
      <p style="margin-top: 24px;">Thanks, PowerPod Team 🙏</p>
    </div>
  `;

  return sendBrevoEmail({
    to: order.to,
    toName: order.toName,
    subject: `Payment Received! ✅ #${order.orderId.slice(0, 8).toUpperCase()}`,
    htmlContent: html,
  });
};

// ============================================
// ORDER DISPATCHED EMAIL
// ============================================
export const sendDispatchedEmail = async (order: OrderEmailParams) => {
  const itemsHtml = order.items
    .map((item) => `<li>${item.quantity} × ${item.name}</li>`)
    .join("");

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #3b82f6;">🚚 On The Way!</h2>
      <p>Hi ${order.toName},</p>
      <p>Your PowerPod order is out for delivery!</p>
      
      <ul>${itemsHtml}</ul>
      
      <p>Est. delivery: ${order.eta || "later today"}</p>
      <p style="margin-top: 16px;">Track: powerpod-store.vercel.app/track/${order.orderId}</p>
      <p style="margin-top: 24px;">Thanks, PowerPod Team 🙏</p>
    </div>
  `;

  return sendBrevoEmail({
    to: order.to,
    toName: order.toName,
    subject: `Order On The Way! 🚚 #${order.orderId.slice(0, 8).toUpperCase()}`,
    htmlContent: html,
  });
};

// ============================================
// ORDER DELIVERED EMAIL
// ============================================
export const sendDeliveredEmail = async (order: OrderEmailParams) => {
  const itemsHtml = order.items
    .map((item) => `<li>${item.quantity} × ${item.name}</li>`)
    .join("");

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #22c55e;">🎉 Delivered!</h2>
      <p>Hi ${order.toName},</p>
      <p>You got it! 🙌</p>
      
      <ul>${itemsHtml}</ul>
      
      <p style="margin: 16px 0;">Hope you love your PowerPod gear!</p>
      <p>Please leave a review: powerpod-store.vercel.app/reviews</p>
      <p style="margin-top: 24px;">Thanks for choosing PowerPod! 🙏⭐</p>
    </div>
  `;

  return sendBrevoEmail({
    to: order.to,
    toName: order.toName,
    subject: `Order Delivered! 🎉 #${order.orderId.slice(0, 8).toUpperCase()}`,
    htmlContent: html,
  });
};

// ============================================
// SEND GENERIC EMAIL
// ============================================
export const sendEmail = async (to: string, subject: string, html: string) => {
  return sendBrevoEmail({
    to,
    subject,
    htmlContent: html,
  });
};

// ============================================
// ADD TO BREVO LIST (Subscribe)
// ============================================
export const subscribeToList = async (email: string, name?: string) => {
  if (!BREVO_API_KEY) return false;

  try {
    const response = await fetch(`${BREVO_API_URL}/contacts/List`, {
      method: "POST",
      headers: {
        "api-key": BREVO_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        listIds: [parseInt(BREVO_LIST_ID)],
        attributes: {
          FIRSTNAME: name || email.split("@")[0],
        },
      }),
    });

    return response.ok;
  } catch (error) {
    console.error("[Brevo] Subscribe error:", error);
    return false;
  }
};

// Check if configured
export const isBrevoConfigured = () => !!BREVO_API_KEY;