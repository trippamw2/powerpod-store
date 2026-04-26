import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || "https://pxltbgfcwylnounuzszg.supabase.co";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_SERVICE_KEY;

interface WebhookPayload {
  tx_ref?: string;
  status?: string;
  amount?: string;
  transaction_id?: string;
  message?: string;
}

export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const payload = req.body as WebhookPayload;
    const tx_ref = payload.tx_ref;
    const status = payload.status;

    if (!tx_ref) {
      console.error("Missing tx_ref in webhook");
      return res.status(400).json({ error: "Missing tx_ref" });
    }

    console.log("Payment callback received:", payload);

    const successfulStatuses = ["successful", "completed", "success"];
    const isSuccessful = successfulStatuses.includes(status?.toLowerCase() || "");

    if (!isSuccessful) {
      console.log("Payment not successful, status:", status);
      return res.status(200).json({ received: true, status: "not_successful" });
    }

    if (SUPABASE_SERVICE_KEY) {
      const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

      const orderId = tx_ref.startsWith("PP-") 
        ? tx_ref.replace("PP-", "").toLowerCase()
        : tx_ref.toLowerCase();

      const { error: updateError } = await supabase
        .from("orders")
        .update({
          status: "confirmed",
          updated_at: new Date().toISOString(),
        })
        .eq("id", orderId);

      if (updateError) {
        console.error("Failed to update order:", updateError);
        return res.status(500).json({ error: "Failed to update order" });
      }

      console.log("Order confirmed:", orderId);
      return res.status(200).json({ success: true, orderId });
    }

    console.warn("No SUPABASE_SERVICE_KEY - cannot update order");
    return res.status(200).json({ received: true, warning: "no_service_key" });
  } catch (error) {
    console.error("Payment callback error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}