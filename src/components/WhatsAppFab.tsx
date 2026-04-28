import { useState } from "react";
import { buildWhatsAppLink, defaultMessage } from "@/lib/whatsapp";
import { MessageCircle, X, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const WhatsAppFab = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="absolute bottom-16 right-0 w-72 sm:w-80 bg-white rounded-2xl shadow-2xl border border-border p-4"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center">
                <MessageCircle className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">PowerPod Support</p>
                <p className="text-xs text-green-600">Typically replies instantly</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Hi! Need help with your order? Chat with us on WhatsApp for quick support!
            </p>
            <a
              href={buildWhatsAppLink(defaultMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-2.5 bg-green-500 hover:bg-green-600 text-white text-center rounded-xl font-medium text-sm transition-colors"
            >
              Start Chat
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setExpanded(!expanded)}
        aria-label={expanded ? "Close chat" : "Chat with us"}
        className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-button hover:scale-110 transition-transform"
      >
        {expanded ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>
    </div>
  );
};
