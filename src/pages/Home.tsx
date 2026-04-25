import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { PromotionSlider } from "@/components/PromotionSlider";
import { Testimonials } from "@/components/Testimonials";
import { PartnerBrands } from "@/components/PartnerBrands";
import { products, combos, formatMWK } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { Headphones, Heart, ArrowRight, ShieldCheck, Truck, ShoppingBag, Clock, Zap } from "lucide-react";
import hero from "@/assets/hero-lifestyle.jpg";
import { toast } from "@/hooks/use-toast";
import { getItemImage } from "@/data/products";

const Home = () => {
  const { add } = useCart();
  const [countdown, setCountdown] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = new Date();
    target.setHours(23, 59, 59, 999);
    const interval = setInterval(() => {
      const now = new Date();
      const diff = target.getTime() - now.getTime();
      if (diff <= 0) {
        target.setDate(target.getDate() + 1);
      }
      setCountdown({
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleAddComboToCart = (combo: typeof combos[0]) => {
    add({
      productKey: `combo-${combo.id}`,
      name: combo.name,
      price: combo.price,
      image: getItemImage(combo.items[0]),
    });
    toast({ title: "Added to cart!", description: combo.name });
  };

  return (
    <div>
      {/* Hot Deals Marquee */}
      <div className="bg-orange-500 text-white py-2 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...Array(4)].map((_, i) => (
            <span key={i} className="mx-4 flex items-center gap-2">
              <Zap className="h-4 w-4" />
              🔥 HOT DEALS: Up to 30% off on power banks • Free shipping over MWK 50,000 • New Oraimo products just landed!
            </span>
          ))}
        </div>
      </div>

      <section className="container pt-4">
        <PromotionSlider page="home" />
      </section>

      <section className="relative overflow-hidden">
        <div className="container relative grid lg:grid-cols-2 gap-8 items-center py-10 lg:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-5"
          >
            {/* Countdown Timer */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 rounded-full">
              <Clock className="h-4 w-4 text-red-500" />
              <span className="text-sm font-medium text-red-600">Ends at midnight</span>
              <div className="flex gap-1">
                {Object.entries(countdown).map(([unit, value]) => (
                  <span key={unit} className="px-2 py-1 bg-red-500 text-white text-sm font-bold rounded">
                    {String(value).padStart(2, "0")}
                  </span>
                ))}
              </div>
            </div>

            <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl leading-tight">
              Keep the<br />
              <span className="text-gradient">Vibe Alive.</span>
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg max-w-md">
              Power and sound for your everyday. From campus to the party, never miss a moment.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild variant="hero" size="lg">
                <Link to="/shop">Shop Now <ArrowRight className="h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" className="bg-gray-900 hover:bg-gray-800">
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
            
            {/* Social Proof */}
            <div className="flex items-center gap-4 pt-2">
              <div className="flex -space-x-2">
                {[1,2,3,4].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white" />
                ))}
              </div>
              <div className="text-sm">
                <span className="font-semibold">2,500+</span> happy customers
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-gradient-brand opacity-20 blur-3xl rounded-full" />
            <div className="relative rounded-2xl overflow-hidden border border-border/50">
              <img src={hero} alt="PowerPod lifestyle" className="w-full aspect-[4/5] object-cover" />
            </div>
          </motion.div>
        </div>
      </section>

      <section className="border-y border-border/50 bg-card/30">
        <div className="container py-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Heart, title: "Stay Connected", sub: "Music. Calls." },
            { icon: Headphones, title: "Your Sound", sub: "Deep bass." },
            { icon: ShieldCheck, title: "Always Ready", sub: "Power lasts." },
            { icon: Truck, title: "Fast Delivery", sub: "Malawi-wide." },
          ].map((v) => (
            <div key={v.title} className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-lg bg-gradient-brand flex items-center justify-center shrink-0">
                <v.icon className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="font-semibold text-sm">{v.title}</p>
                <p className="text-xs text-muted-foreground">{v.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container py-12">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <p className="text-sm font-semibold text-gradient uppercase tracking-widest">Power Packs</p>
            <h2 className="font-display font-bold text-2xl sm:text-3xl">Bundles for you</h2>
          </div>
          <Button asChild variant="ghost" size="sm">
            <Link to="/combos">View All <ArrowRight className="h-4 w-4" /></Link>
          </Button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {combos.slice(0, 4).map((c) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-xl p-4 bg-card border border-border/60 hover:border-primary/50 transition-all"
            >
              <h3 className="font-display font-bold text-lg">{c.name}</h3>
              <p className="text-xs text-muted-foreground mt-1">{c.tagline}</p>
              <div className="flex items-center justify-between mt-3">
                <p className="font-bold text-lg">{formatMWK(c.price)}</p>
                <Button onClick={() => handleAddComboToCart(c)} variant="hero" size="sm">
                  <ShoppingBag className="h-3 w-3" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="container py-12">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <p className="text-sm font-semibold text-gradient uppercase tracking-widest">Trending</p>
            <h2 className="font-display font-bold text-2xl sm:text-3xl">Featured Products</h2>
          </div>
          <Button asChild variant="ghost" size="sm">
            <Link to="/shop">Shop All <ArrowRight className="h-4 w-4" /></Link>
          </Button>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.slice(0, 3).map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>

      <Testimonials />

      <PartnerBrands />

      <section className="container pb-12">
        <div className="relative rounded-2xl overflow-hidden bg-gradient-brand p-8 md:p-12 text-center text-white">
          <h2 className="font-display font-bold text-2xl sm:text-3xl">Ready to order?</h2>
          <p className="text-white/80 text-sm mt-2">We deliver anywhere in Malawi.</p>
          <Button asChild size="lg" className="mt-4 bg-white text-foreground hover:bg-white/90">
            <Link to="/checkout">Proceed to Checkout</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;