import { Link } from "react-router-dom";
import { Logo } from "./Logo";
import { Instagram, Facebook, MessageCircle } from "lucide-react";
import { buildWhatsAppLink, defaultMessage } from "@/lib/whatsapp";

export const Footer = () => (
  <footer className="border-t border-border/50 mt-24">
    <div className="container py-12 grid gap-10 md:grid-cols-4">
      <div className="md:col-span-2 space-y-4">
        <Logo className="h-10" />
        <p className="text-muted-foreground max-w-sm">
          Power and sound for your everyday. Stay charged. Stay connected.
        </p>
        <p className="text-sm text-gradient font-semibold">Keep the vibe alive</p>
      </div>
      <div>
        <h4 className="font-display font-semibold mb-3">Shop</h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li><Link to="/shop" className="hover:text-foreground">All Products</Link></li>
          <li><Link to="/combos" className="hover:text-foreground">Bundles</Link></li>
          <li><Link to="/about" className="hover:text-foreground">Our Story</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="font-display font-semibold mb-3">Connect</h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li><a href={buildWhatsAppLink(defaultMessage)} className="hover:text-foreground inline-flex items-center gap-2"><MessageCircle className="h-4 w-4" /> WhatsApp</a></li>
          <li><a href="#" className="hover:text-foreground inline-flex items-center gap-2"><Instagram className="h-4 w-4" /> Instagram</a></li>
          <li><a href="#" className="hover:text-foreground inline-flex items-center gap-2"><Facebook className="h-4 w-4" /> Facebook</a></li>
        </ul>
      </div>
    </div>
    <div className="border-t border-border/50">
      <div className="container py-6 flex flex-col md:flex-row gap-3 items-center justify-between text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} PowerPod. Keep the vibe alive.</p>
        <p className="uppercase tracking-wider">Malawi</p>
      </div>
    </div>
  </footer>
);