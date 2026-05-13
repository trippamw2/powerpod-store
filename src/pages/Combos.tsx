import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { formatMWK, getKitPrice, getKitSeparateTotal, getKitRealSaving, getKitDiscountPercent, getKitProducts } from "@/data/products";
import { useCombos } from "@/hooks/useCombos";
import { MessageCircle, ArrowRight, Zap, ShoppingBag, BookOpen, Briefcase, Headphones, Luggage } from "lucide-react";
import { buildWhatsAppLink } from "@/lib/whatsapp";

const lifestyleColors: Record<string, string> = {
  student: "bg-gradient-to-br from-blue-500 to-cyan-500",
  work: "bg-gradient-to-br from-purple-500 to-indigo-500",
  travel: "bg-gradient-to-br from-green-500 to-teal-500",
  audio: "bg-gradient-to-br from-orange-500 to-red-500",
  premium: "bg-gradient-to-br from-orange-500 to-orange-600",
};

const lifestyleIcons: Record<string, typeof BookOpen> = {
  student: BookOpen,
  work: Briefcase,
  travel: Luggage,
  audio: Headphones,
  premium: Zap,
};

const lifestyleLabels: Record<string, string> = {
  student: "Student",
  work: "Work",
  travel: "Travel",
  audio: "Audio",
  premium: "Premium",
};

const Combos = () => {
  const combos = useCombos();
  return (
    <div>
      {/* BANNER */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="container py-8 sm:py-12 lg:py-16">
          <div className="max-w-2xl mx-auto text-center">
            <span className="inline-flex px-3 py-1 rounded-full bg-white/10 text-white/80 text-xs font-semibold mb-3">Tech Kits. Malawi.</span>
            <h1 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl leading-tight">Not Sure Which Kit?</h1>
            <p className="text-white/70 text-sm sm:text-base mt-3 max-w-lg mx-auto">
              We picked the charger, power bank, cable and audio gear your phone needs. 
              Tested. Reliable. One box for less than separate. 30 day guarantee.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
              <a href={buildWhatsAppLink("Hi PowerPod! I need help choosing the right tech kit.")} target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="bg-green-500 hover:bg-green-600 text-white w-full sm:w-auto">
                  <MessageCircle className="h-5 w-5 mr-2" /> Chat on WhatsApp
                </Button>
              </a>
              <Button asChild size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 w-full sm:w-auto">
                <Link to="/shop">Browse Individual Items</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* KITS GRID */}
      <section className="container py-8 sm:py-12 lg:py-16">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div>
            <p className="text-sm font-semibold text-orange-600 uppercase tracking-widest">Pick Your Kit</p>
            <h2 className="font-display font-bold text-2xl sm:text-3xl mt-1">Choose Your Lifestyle</h2>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
          {combos.map((kit, i) => {
            const Icon = lifestyleIcons[kit.lifestyle] || BookOpen;
            const color = lifestyleColors[kit.lifestyle] || "bg-gradient-to-br from-orange-500 to-orange-600";
            const kitPrice = getKitPrice(kit);
            const separateTotal = getKitSeparateTotal(kit);
            const realSaving = getKitRealSaving(kit);
            const discount = getKitDiscountPercent(kit);
            const kitProducts = getKitProducts(kit);

            return (
              <motion.div
                key={kit.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Link
                  to={`/kits/${kit.id}`}
                  className="group relative block rounded-2xl bg-white border border-gray-100 hover:border-orange-200 hover:shadow-lg transition-all duration-200 overflow-hidden h-full"
                >
                  {/* Hero Image */}
                  <div className="relative bg-gray-50 border-b border-gray-100">
                    {kit.badge && (
                      <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-orange-500 text-white text-xs font-semibold z-10">
                        {kit.badge}
                      </span>
                    )}
                    {kit.stock !== undefined && kit.stock <= 5 && (
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full border border-orange-300 bg-white text-orange-600 text-[10px] font-medium z-10">
                        Only {kit.stock} left
                      </span>
                    )}
                    <div className="w-full aspect-[4/3] max-h-[320px] flex items-center justify-center p-4 sm:p-6">
                      <img
                        src={kit.image}
                        alt={kit.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>

                  <div className="p-5 sm:p-6">
                    {/* Lifestyle label */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className={`h-6 w-6 rounded-md ${color} flex items-center justify-center`}>
                        <Icon className="h-3.5 w-3.5 text-white" />
                      </div>
                      <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                        {lifestyleLabels[kit.lifestyle] || kit.lifestyle}
                      </span>
                    </div>

                    <h3 className="font-display font-bold text-xl sm:text-2xl text-gray-900">{kit.name}</h3>
                    <p className="text-sm font-medium text-orange-600 mt-0.5">{kit.hook}</p>
                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{kit.description}</p>

                    {/* What's Inside */}
                    <div className="mt-4 space-y-2">
                      <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">What's Inside</p>
                      <div className="space-y-1.5">
                        {kitProducts.slice(0, 4).map((product) => (
                          <div key={product.id} className="flex items-center gap-3 text-[12px]">
                            <img src={product.image} alt={product.name} className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl object-cover shrink-0 border border-gray-100" />
                            <span className="text-gray-600 truncate font-medium">{product.name}</span>
                            <span className="text-gray-400 line-through ml-auto shrink-0 text-[11px]">{formatMWK(product.price)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Pricing */}
                    <div className="mt-5 pt-4 border-t border-gray-100 flex items-end justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground mb-0.5">Kit price</p>
                        <p className="font-bold text-2xl sm:text-3xl text-gray-900">{formatMWK(kitPrice)}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs line-through text-gray-400">{formatMWK(separateTotal)}</span>
                          <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-medium">
                            Save {formatMWK(realSaving)}
                          </span>
                        </div>
                        <span className="text-[10px] text-orange-500 font-medium mt-0.5 block">
                          {discount}% cheaper than separate
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-sm font-semibold text-orange-600 opacity-0 group-hover:opacity-100 transition-opacity">
                        View Kit <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* BROWSE INDIVIDUAL ITEMS CTA */}
      <section className="bg-gray-50/50 py-10 sm:py-14">
        <div className="container text-center">
          <p className="text-sm font-semibold text-orange-600 uppercase tracking-widest">Need Just One Thing?</p>
          <h2 className="font-display font-bold text-2xl sm:text-3xl mt-1">Shop Individual Items</h2>
          <p className="text-muted-foreground text-sm mt-2">Or grab a kit above and save more</p>

          <div className="flex flex-wrap justify-center gap-3 mt-6">
            {[
              { label: "Power Banks", cat: "power-banks" },
              { label: "Earbuds", cat: "earbuds" },
              { label: "Headphones", cat: "headphones" },
              { label: "Headsets", cat: "headsets" },
              { label: "Speakers", cat: "speakers" },
              { label: "Car Chargers", cat: "car-chargers" },
            ].map((item) => (
              <Link key={item.cat} to={`/shop?cat=${item.cat}`} className="px-5 py-3 rounded-full bg-white border border-gray-200 text-sm font-medium text-gray-700 hover:border-orange-300 hover:text-orange-600 hover:shadow-sm transition-all">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Combos;
