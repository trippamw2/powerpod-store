import { buildWhatsAppLink, defaultMessage } from "@/lib/whatsapp";
import { MessageCircle } from "lucide-react";

export const WhatsAppFab = () => (
  <a
    href={buildWhatsAppLink(defaultMessage)}
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Order on WhatsApp"
    className="fixed bottom-5 right-5 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[hsl(142_70%_45%)] text-white shadow-button hover:scale-110 transition-transform animate-pulse-glow"
  >
    <MessageCircle className="h-6 w-6" />
  </a>
);
