import { useState } from "react";
import { Link } from "react-router-dom";
import { Logo } from "./Logo";
import { Instagram, Facebook, MessageCircle, Mail, CheckCircle, Shield, Truck, CreditCard, Send, ArrowRight } from "lucide-react";
import { buildWhatsAppLink, defaultMessage } from "@/lib/whatsapp";
import { toast } from "@/hooks/use-toast";

export const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      toast({ title: "Subscribed!", description: "Get 10% off your first order" });
    }
  };

  const paymentMethods = [
    { name: "Visa", color: "#1A1F71" },
    { name: "Mastercard", color: "#EB001B" },
    { name: "Airtel Money", color: "#FF5A00" },
    { name: "TNM Mpamba", color: "#00A651" },
  ];

  return (
    <footer className="bg-white border-t border-gray-200 mt-24">
      {/* Newsletter & Trust Strip */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600">
        <div className="container py-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            {/* Newsletter */}
            <div className="text-white">
              <h3 className="font-display font-bold text-xl">Get 10% off your first order</h3>
              <p className="text-white/80 text-sm">Subscribe to our newsletter for exclusive deals</p>
            </div>
            {subscribed ? (
              <div className="flex items-center gap-2 bg-white/20 px-6 py-3 rounded-full">
                <CheckCircle className="h-5 w-5 text-white" />
                <span className="text-white font-medium">You're subscribed!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex w-full max-w-md gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-full text-gray-900 placeholder:text-gray-400 focus:outline-none"
                  required
                />
                <button type="submit" className="px-6 py-3 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors flex items-center gap-2">
                  Subscribe <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="border-b border-gray-100">
        <div className="container py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-orange-500" />
              <div>
                <p className="font-semibold text-sm">Secure Checkout</p>
                <p className="text-xs text-gray-500">256-bit SSL encryption</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-orange-500" />
              <div>
                <p className="font-semibold text-sm">Genuine Products</p>
                <p className="text-xs text-gray-500">100% authentic brands</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Truck className="h-8 w-8 text-orange-500" />
              <div>
                <p className="font-semibold text-sm">Fast Delivery</p>
                <p className="text-xs text-gray-500">Across all Malawi</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CreditCard className="h-8 w-8 text-orange-500" />
              <div>
                <p className="font-semibold text-sm">Easy Payments</p>
                <p className="text-xs text-gray-500">Mobile money & cards</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container py-12">
        <div className="grid md:grid-cols-5 gap-10">
          <div className="md:col-span-2 space-y-4">
            <Logo className="h-12" />
            <p className="text-gray-500 max-w-sm">
              Power and sound for your everyday. Stay charged. Stay connected.
            </p>
            <p className="text-sm bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent font-semibold">Keep the vibe alive</p>
            
            {/* Social */}
            <div className="flex gap-4 pt-2">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-gray-100 hover:bg-orange-100 hover:text-orange-600 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-gray-100 hover:bg-orange-100 hover:text-orange-600 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href={buildWhatsAppLink("Hi PowerPod!")} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-gray-100 hover:bg-orange-100 hover:text-orange-600 transition-colors">
                <MessageCircle className="h-5 w-5" />
              </a>
            </div>

            {/* Payment Methods */}
            <div className="pt-4">
              <p className="text-sm font-medium mb-3">We accept</p>
              <div className="flex gap-3">
                {paymentMethods.map((pm) => (
                  <div
                    key={pm.name}
                    className="px-3 py-1.5 rounded-md bg-gray-100 text-xs font-medium text-gray-600"
                  >
                    {pm.name}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-display font-semibold mb-3">Shop</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link to="/shop" className="hover:text-orange-500 transition-colors">All Products</Link></li>
              <li><Link to="/shop?cat=power-banks" className="hover:text-orange-500 transition-colors">Power Banks</Link></li>
              <li><Link to="/shop?cat=earbuds" className="hover:text-orange-500 transition-colors">Earbuds</Link></li>
              <li><Link to="/shop?cat=headphones" className="hover:text-orange-500 transition-colors">Headphones</Link></li>
              <li><Link to="/shop?cat=chargers" className="hover:text-orange-500 transition-colors">Chargers</Link></li>
              <li><Link to="/combos" className="hover:text-orange-500 transition-colors">Bundles</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold mb-3">Support</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link to="/track/order123" className="hover:text-orange-500 transition-colors">Track Order</Link></li>
              <li><Link to="/contact" className="hover:text-orange-500 transition-colors">Contact Us</Link></li>
              <li><a href={buildWhatsAppLink(defaultMessage)} target="_blank" rel="noopener noreferrer" className="hover:text-orange-500 transition-colors inline-flex items-center gap-2"><MessageCircle className="h-4 w-4" /> WhatsApp</a></li>
              <li><Link to="/about" className="hover:text-orange-500 transition-colors">About Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold mb-3">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link to="/terms" className="hover:text-orange-500 transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/privacy" className="hover:text-orange-500 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/return" className="hover:text-orange-500 transition-colors">Returns & Refunds</Link></li>
              <li><Link to="/warranty" className="hover:text-orange-500 transition-colors">Warranty Info</Link></li>
              <li><Link to="/faq" className="hover:text-orange-500 transition-colors">FAQ</Link></li>
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
};