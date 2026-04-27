// PowerPod Brevo Email Integration
// Send transactional emails via Brevo (formerly Sendinblue)

const BREVO_API_KEY = import.meta.env.VITE_BREVO_API_KEY;
const BREVO_LIST_ID = import.meta.env.VITE_BREVO_LIST_ID || "2";
const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || "powerpodstore.mw@gmail.com";

// Brand configuration
const BRAND = {
  name: "PowerPod",
  tagline: "Your Power, Your Music",
  email: "orders@powerpod.mw",
  website: "https://powerpod-store.vercel.app",
  // Use text-based header since images can be blocked
  useLogoImage: false,
  phone: "+265 991 234 567",
  facebook: "https://facebook.com/powerpodmw",
  instagram: "https://instagram.com/powerpodmw",
  whatsapp: "https://wa.me/265991234567",
  address: "Blantyre, Malawi",
  businessName: "PowerPod Electronics",
};

// Email wrapper with branding
const wrapEmail = (content: string, title: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #111111;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #111111; padding: 40px 0;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #1a1a1a; border-radius: 16px; overflow: hidden; border: 1px solid #333333;">
          <!-- Header with Logo -->
          <tr>
            <td style="background: linear-gradient(135deg, #FF6B00 0%, #FF8C00 100%); padding: 32px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 36px; font-weight: 900; letter-spacing: 2px;">⚡ ${BRAND.name}</h1>
              <p style="color: #ffffff; margin: 8px 0 0 0; font-size: 16px; font-weight: 500; letter-spacing: 2px; text-transform: uppercase;">${BRAND.tagline}</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 32px; color: #ffffff;">
              ${content}
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #0a0a0a; padding: 24px 32px; border-top: 1px solid #333333;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <p style="color: #888888; font-size: 13px; margin: 0 0 8px 0;">${BRAND.businessName} • ${BRAND.address}</p>
                    <p style="color: #666666; font-size: 12px; margin: 0 0 16px 0;">📱 ${BRAND.phone} • 📧 ${BRAND.email}</p>
                    
                    <!-- Social Links -->
                    <table cellpadding="0" cellspacing="0" style="margin: 0 auto 16px auto;">
                      <tr>
                        <td style="padding: 0 16px;">
                          <a href="${BRAND.website}" style="color: #FF6B00; text-decoration: none; font-size: 13px; font-weight: 600;">SHOP</a>
                        </td>
                        <td style="padding: 0 16px;">
                          <a href="${BRAND.whatsapp}" style="color: #FF6B00; text-decoration: none; font-size: 13px; font-weight: 600;">WHATSAPP</a>
                        </td>
                        <td style="padding: 0 16px;">
                          <a href="${BRAND.facebook}" style="color: #FF6B00; text-decoration: none; font-size: 13px; font-weight: 600;">FACEBOOK</a>
                        </td>
                        <td style="padding: 0 16px;">
                          <a href="${BRAND.instagram}" style="color: #FF6B00; text-decoration: none; font-size: 13px; font-weight: 600;">INSTAGRAM</a>
                        </td>
                      </tr>
                    </table>
                    
                    <p style="color: #444444; font-size: 10px; margin: 16px 0 0 0; border-top: 1px solid #222222; padding-top: 16px;">
                      © ${new Date().getFullYear()} ${BRAND.name}. ${BRAND.tagline}<br>
                      <span style="color: #555555;">This email was sent because of your order on ${BRAND.website}</span>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
        
        <!-- Extra spacing -->
        <p style="color: #555555; font-size: 11px; text-align: center; margin: 24px 0;">${BRAND.tagline} 💪🏿</p>
      </td>
    </tr>
  </table>
</body>
</html>
`;

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
    // Wrap content with brand template
    const htmlContent = wrapEmail(params.htmlContent || params.textContent || "", params.subject);

    const response = await fetch(`${BREVO_API_URL}/smtp/email`, {
      method: "POST",
      headers: {
        "api-key": BREVO_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sender: {
          name: BRAND.name,
          email: BRAND.email,
        },
        to: [
          {
            email: params.to,
            name: params.toName || params.to,
          },
        ],
        subject: params.subject,
        htmlContent: htmlContent,
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
// SEND ADMIN NOTIFICATION (New Order Alert)
// ============================================
export const sendAdminNotificationEmail = async (order: OrderEmailParams) => {
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
      <h2 style="color: #f97316;">🛒 New Order Received!</h2>
      
      <table style="width: 100%; border-collapse: collapse;">
        ${itemsHtml}
        <tr style="border-top: 2px solid #f97316;">
          <td style="padding: 12px 0; font-weight: bold;">Total</td>
          <td style="padding: 12px 0; text-align: right; font-weight: bold;">MK ${order.total.toLocaleString()}</td>
        </tr>
      </table>
      
      <div style="background: #f3f4f6; padding: 16px; margin: 16px 0; border-radius: 8px;">
        <p style="margin: 4px 0;"><strong>👤 Customer:</strong> ${order.toName}</p>
        <p style="margin: 4px 0;"><strong>📱 Phone:</strong> ${order.to}</p>
        <p style="margin: 4px 0;"><strong>📍 Location:</strong> ${order.location}</p>
        <p style="margin: 4px 0;"><strong>🚚 Delivery:</strong> ${order.deliveryMethod}</p>
      </div>
      
      <p>Order #${order.orderId.slice(0, 8).toUpperCase()}</p>
      <p style="margin-top: 16px;">
        <a href="https://powerpod-store.vercel.app/admin/orders" style="background: #f97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px;">View in Admin</a>
      </p>
    </div>
  `;

  return sendBrevoEmail({
    to: ADMIN_EMAIL,
    toName: "PowerPod Admin",
    subject: `🛒 NEW ORDER #${order.orderId.slice(0, 8).toUpperCase()} - MK ${order.total.toLocaleString()}`,
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