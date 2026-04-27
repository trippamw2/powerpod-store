import { formatMWK } from "@/data/products";

const PAYCHANGU_PUBLIC_KEY = import.meta.env.VITE_PAYCHANGU_PUBLIC_KEY;
const PAYCHANGU_SECRET_KEY = import.meta.env.VITE_PAYCHANGU_SECRET_KEY;

export interface PayChanguPaymentParams {
  amount: number;
  currency?: string;
  email: string;
  firstName: string;
  lastName: string;
  txRef: string;
  callbackUrl: string;
  returnUrl: string;
  title?: string;
  description?: string;
}

export interface PayChanguResponse {
  link: string;
  txRef: string;
}

export const createPayChanguPayment = async (params: PayChanguPaymentParams): Promise<PayChanguResponse> => {
  const PAYCHANGU_API_URL = "https://api.paychangu.com/v1/payment";
  
  const payload = {
    amount: params.amount.toString(),
    currency: params.currency || "MWK",
    email: params.email,
    first_name: params.firstName,
    last_name: params.lastName,
    tx_ref: params.txRef,
    callback_url: params.callbackUrl,
    return_url: params.returnUrl,
    customization: {
      title: params.title || "PowerPod Order",
      description: params.description || "Order payment",
    },
  };

  console.log("PayChangu API URL:", PAYCHANGU_API_URL);
  console.log("PayChangu payload:", payload);

  try {
    const response = await fetch(PAYCHANGU_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${PAYCHANGU_SECRET_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    console.log("PayChangu response:", data);
    console.log("Response status:", response.status);

    if (response.ok && (data.data?.checkout_url || data.link || data.checkout_url)) {
      const checkoutUrl = data.data?.checkout_url || data.checkout_url || data.link;
      const txRef = data.data?.tx_ref || data.tx_ref;
      console.log("PayChangu checkout URL:", checkoutUrl);
      console.log("PayChangu tx_ref:", txRef);
      return {
        link: checkoutUrl,
        txRef: txRef,
      };
    }

    console.error("PayChangu full response:", JSON.stringify(data, null, 2));
    throw new Error(data.message || data.data?.message || `Payment creation failed: ${response.status}`);
  } catch (error) {
    console.error("PayChangu error:", error);
    throw error;
  }
};

export const formatPayChanguAmount = (amount: number): string => {
  return amount.toString();
};

export const getPayChanguPaymentLink = async (orderId: string, amount: number, customerName: string, customerEmail: string): Promise<string> => {
  const baseUrl = window.location.origin;
  
  const params: PayChanguPaymentParams = {
    amount: amount,
    currency: "MWK",
    email: customerEmail,
    firstName: customerName.split(" ")[0] || customerName,
    lastName: customerName.split(" ").slice(1).join(" ") || "",
    txRef: `PP-${orderId.slice(0, 8).toUpperCase()}`,
    callbackUrl: `${baseUrl}/api/payment/callback?orderId=${orderId}`,
    returnUrl: `${baseUrl}/orders/${orderId}?payment=complete`,
    title: "PowerPod Order Payment",
    description: `Order #${orderId.slice(0, 8).toUpperCase()}`,
  };

  const payment = await createPayChanguPayment(params);
  return payment.link;
};

export const PAYCHANGU_CONFIG = {
  publicKey: PAYCHANGU_PUBLIC_KEY,
  testMode: !PAYCHANGU_PUBLIC_KEY || !PAYCHANGU_SECRET_KEY || PAYCHANGU_SECRET_KEY?.startsWith("your_"),
  hasKeys: !!(PAYCHANGU_PUBLIC_KEY && PAYCHANGU_SECRET_KEY),
};