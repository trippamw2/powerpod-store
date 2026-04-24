import { Link } from "react-router-dom";
import { Logo } from "./Logo";
import { Instagram, Facebook, MessageCircle } from "lucide-react";
import { buildWhatsAppLink, defaultMessage } from "@/lib/whatsapp";

export const Footer = () => (
  <footer className="bg-white border-t border-gray-200 mt-24">
    <div className="container py-12">
      <div className="grid md:grid-cols-4 gap-10">
        <div className="md:col-span-2 space-y-4">
          <Logo className="h-12" />
          <p className="text-gray-500 max-w-sm">
            Power and sound for your everyday. Stay charged. Stay connected.
          </p>
          <p className="text-sm bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent font-semibold">Keep the vibe alive</p>
        </div>
        <div>
          <h4 className="font-display font-semibold mb-3">Shop</h4>
          <ul className="space-y-2 text-sm text-gray-500">
            <li><Link to="/shop" className="hover:text-orange-500 transition-colors">All Products</Link></li>
            <li><Link to="/shop?cat=power" className="hover:text-orange-500 transition-colors">Power</Link></li>
            <li><Link to="/shop?cat=audio" className="hover:text-orange-500 transition-colors">Audio</Link></li>
            <li><Link to="/combos" className="hover:text-orange-500 transition-colors">Bundles</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display font-semibold mb-3">Help</h4>
          <ul className="space-y-2 text-sm text-gray-500">
            <li><Link to="/contact" className="hover:text-orange-500 transition-colors">Contact Us</Link></li>
            <li><Link to="/about" className="hover:text-orange-500 transition-colors">About Us</Link></li>
            <li><a href={buildWhatsAppLink(defaultMessage)} target="_blank" rel="noopener noreferrer" className="hover:text-orange-500 transition-colors inline-flex items-center gap-2"><MessageCircle className="h-4 w-4" /> WhatsApp</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-100 mt-12">
        <div className="container py-6 flex flex-col md:flex-row gap-3 items-center justify-between text-xs text-gray-400">
          <p>© {new Date().getFullYear()} PowerPod. Keep the vibe alive.</p>
          <p className="uppercase tracking-wider">Malawi 🇲🇼</p>
        </div>
      </div>
    </div>
  </footer>
);