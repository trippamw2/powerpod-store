import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { formatMWK, kits } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { CheckCircle, ArrowRight, MessageCircle, Zap, ShoppingBag, BookOpen, Briefcase, Headphones, Luggage } from "lucide-react";
import { buildWhatsAppLink } from "@/lib/whatsapp";

const lifestyleIcons: Record<string, typeof BookOpen> = {
  student: BookOpen,
  work: Briefcase,
  travel: Luggage,
  audio: Headphones,
  premium: Zap,
};

const lifestyleColors: Record<string, string> = {
  student: "from-blue-500 to-cyan-500",
  work: "from-purple-500 to-indigo-500",
  travel: "from-green-500 to-teal-500",
  audio: "from-orange-500 to-red-500",
  premium: "from-orange-500 to-orange-600",
};

const Combos = () => {
  const { add } = useCart();
  const [addingId, setAddingId] = useState<string | null>(null);

  const handleAddKit = (kit: typeof kits[0]) => {
    setAddingId(kit.id);
    add({ productKey: kit.id, name: kit.name, price: kit.price, image: "" }, 1);
    setTimeout(() => setAddingId(null), 1000);
  };

  return (
    <div>
      {/* HEADER */}
      <section className="bg-gradient-to-b from-orange-50/50 to-white py-10 sm:py-14">
        <div className="container text-center">
          <span className="inline-flex px-3 py-1 rounded-full bg-orange-100 text-orange-600 text-xs font-semibold mb-3">The PowerPod System. Malawi</span>
          <h1 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl">Never Run Out of Battery Again</h1>
          <p className="text-muted-foreground text-sm sm:text-base mt-2 max-w-lg mx-auto">
            No more dead phones. No more broken cables. No more bad sound. 
            We picked everything you need. Charger, cable, power bank, earbuds. So you don't have to.
            Better price than buying separate. One box. 30 day guarantee.
          </p>
          <p className="text-xs text-orange-600 font-medium mt-3">Selling fast. Order now for quick dispatch.</p>
        </div>
      </section>

      {/* KITS GRID */}
      <section className="container py-8 sm:py-12 lg:py-16">
        <div className="grid gap-8 sm:gap-10 lg:gap-12 max-w-4xl mx-auto">
          {kits.map((kit, i) => {
            const Icon = lifestyleIcons[kit.lifestyle] || BookOpen;
            const color = lifestyleColors[kit.lifestyle] || "from-orange-500 to-orange-600";

            return (
              <motion.div
                key={kit.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden"
              >
                {kit.badge && (
                  <span className="absolute top-4 right-4 px-3 py-1 rounded-full bg-orange-500 text-white text-xs font-semibold z-10">
                    {kit.badge}
                  </span>
                )}
                {kit.stock !== undefined && kit.stock <= 5 && (
                  <span className="absolute top-4 left-4 px-2.5 py-1 rounded-full border border-orange-300 bg-white text-orange-600 text-[10px] font-medium z-10">
                    Only {kit.stock} left
                  </span>
                )}

                <div className="grid md:grid-cols-5 gap-0">
                  <div className="md:col-span-2 p-6 sm:p-8 flex flex-col justify-center bg-gradient-to-br from-gray-50 to-white">
                    <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-4`}>
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    <p className="text-xs font-semibold text-orange-600 uppercase tracking-wider mb-1">{kit.name}</p>
                    <h2 className="font-display font-bold text-xl sm:text-2xl text-gray-900 leading-tight">{kit.hook}</h2>
                    <p className="text-sm text-muted-foreground mt-2">{kit.description}</p>
                    
                    <div className="mt-4 flex items-center gap-3 text-xs">
                      <div className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-500">
                        <span className="line-through">Buying separately</span>
                      </div>
                      <ArrowRight className="h-4 w-4 text-orange-500" />
                      <div className="px-3 py-1.5 rounded-lg bg-green-50 text-green-700 font-medium">
                        Save {formatMWK(kit.saving)}
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-3 p-6 sm:p-8 flex flex-col justify-between">
                    <div>
                      <h3 className="font-semibold text-sm text-gray-500 mb-3 uppercase tracking-wider">What's Inside</h3>
                      <ul className="space-y-2.5">
                        {kit.items.map((item) => (
                          <li key={item} className="flex items-start gap-2.5 text-sm text-gray-700">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-100">
                      <div className="flex items-end justify-between gap-4">
                        <div>
                          <p className="text-xs text-gray-400 mb-0.5">Kit price</p>
                          <p className="font-bold text-2xl sm:text-3xl text-gray-900">{formatMWK(kit.price)}</p>
                          <p className="text-xs text-green-600 font-medium mt-0.5">Save {formatMWK(kit.saving)} vs buying separate</p>
                          <p className="text-[10px] text-green-500 mt-0.5">30 day guarantee</p>
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={() => handleAddKit(kit)} variant="hero" size="sm" className="text-xs sm:text-sm" disabled={addingId === kit.id}>
                            {addingId === kit.id ? "Added!" : <><ShoppingBag className="h-3.5 w-3.5 mr-1.5" /> Add to Cart</>}
                          </Button>
                          <a href={buildWhatsAppLink(`I want to order the ${kit.name} (${kit.items.join(", ")}). Total: ${formatMWK(kit.price)}`)} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" size="sm" className="text-xs sm:text-sm border-green-300 text-green-700 hover:bg-green-50">
                              <MessageCircle className="h-3.5 w-3.5 mr-1.5" /> WhatsApp
                            </Button>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className="bg-gray-50/50 py-12 sm:py-16">
        <div className="container">
          <div className="text-center mb-6 sm:mb-8">
            <p className="text-sm font-semibold text-orange-600 uppercase tracking-widest">Need Just One Thing?</p>
            <h2 className="font-display font-bold text-2xl sm:text-3xl mt-1">Shop Individual Items</h2>
            <p className="text-muted-foreground text-sm mt-1">Or grab a kit above and save more</p>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {[
              { label: "Chargers", cat: "power-wired" },
              { label: "Power Banks", cat: "power-banks" },
              { label: "Earbuds", cat: "earbuds" },
              { label: "Headphones", cat: "headphones" },
              { label: "Cables", cat: "cables" },
              { label: "Speakers", cat: "speakers" },
            ].map((item) => (
              <Link key={item.cat} to={`/shop?cat=${item.cat}`} className="px-5 py-3 rounded-full bg-white border border-gray-200 text-sm font-medium text-gray-700 hover:border-orange-300 hover:text-orange-600 hover:shadow-sm transition-all">
                {item.label}
              </Link>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button asChild variant="outline" size="sm">
              <Link to="/shop">Browse All Products <ArrowRight className="h-3.5 w-3.5 ml-1" /></Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="container py-12 sm:py-16">
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 p-8 sm:p-12 text-center text-white">
          <h2 className="font-display font-bold text-2xl sm:text-3xl">Not Sure Which Kit?</h2>
          <p className="text-white/70 text-sm sm:text-base mt-2 max-w-md mx-auto">
            Chat with us on WhatsApp. We'll help you pick the right one. Not happy after 30 days? Send it back, no questions asked.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
            <a href={buildWhatsAppLink("Hi PowerPod! I need help choosing the right tech kit.")} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-green-500 hover:bg-green-600 text-white">
                <MessageCircle className="h-5 w-5 mr-2" /> Chat on WhatsApp
              </Button>
            </a>
            <Button asChild size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
              <Link to="/shop">Browse Individual Items</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Combos;