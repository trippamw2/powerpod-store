import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { products, combos, formatMWK } from "@/data/products";
import { buildWhatsAppLink, defaultMessage, comboMessage } from "@/lib/whatsapp";
import { Headphones, Heart, ArrowRight, ShieldCheck, Truck } from "lucide-react";
import hero from "@/assets/hero-lifestyle.jpg";
import lifestyleMusic from "@/assets/lifestyle-music.jpg";

const Home = () => {
  return (
    <div>
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="container relative grid lg:grid-cols-2 gap-10 items-center py-12 lg:py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="space-y-7 relative z-10"
          >
            <h1 className="font-display font-extrabold text-5xl sm:text-6xl lg:text-7xl leading-[1.05] tracking-tight">
              Keep the<br />
              <span className="text-gradient">Vibe Alive.</span>
            </h1>
            <p className="text-muted-foreground text-lg sm:text-xl max-w-md leading-relaxed">
              Power and sound for your everyday. From campus to the party, 
              never miss a moment with your sounds, your charge, your vibe.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild variant="hero" size="xl">
                <Link to="/shop">Shop Now <ArrowRight className="h-5 w-5" /></Link>
              </Button>
              <Button asChild variant="whatsapp" size="xl">
                <a href={buildWhatsAppLink(defaultMessage)} target="_blank" rel="noopener noreferrer">
                  Message on WhatsApp
                </a>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-gradient-brand opacity-30 blur-3xl rounded-full" aria-hidden />
            <div className="relative rounded-3xl overflow-hidden border border-border/50 shadow-glow">
              <img
                src={hero}
                alt="PowerPod lifestyle"
                width={1080}
                height={1350}
                className="w-full aspect-[4/5] sm:aspect-[3/4] lg:aspect-[4/5] object-cover"
              />
              <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-background/70 backdrop-blur-xl border border-border/50 p-4">
                <p className="font-display font-semibold">Your vibe. Your way.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* WHY POWERPOD */}
      <section className="border-y border-border/50 bg-card/30">
        <div className="container py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: Heart, title: "Stay Connected", sub: "Music. Calls. Never miss a beat." },
            { icon: Headphones, title: "Your Sound", sub: "Deep bass. Clear calls." },
            { icon: ShieldCheck, title: "Always Ready", sub: "Power that lasts." },
            { icon: Truck, title: "Free Delivery", sub: "Anywhere in Malawi." },
          ].map((v) => (
            <div key={v.title} className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-brand-soft border border-border flex items-center justify-center shrink-0">
                <v.icon className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="font-display font-semibold text-sm">{v.title}</p>
                <p className="text-xs text-muted-foreground">{v.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* COMBOS SECTION */}
      <section className="container py-20">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-sm font-semibold text-gradient uppercase tracking-widest mb-2">Power Packs</p>
            <h2 className="font-display font-bold text-3xl sm:text-5xl tracking-tight">Everything you need.</h2>
            <p className="text-muted-foreground mt-2">Bundles curated for your lifestyle.</p>
          </div>
          <Button asChild variant="outlineGlow">
            <Link to="/combos">View All <ArrowRight className="h-4 w-4" /></Link>
          </Button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {combos.map((c, i) => (
            <motion.article
              key={c.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="relative rounded-3xl p-6 bg-card border border-border/60 hover:border-primary/50 transition-all hover:shadow-card overflow-hidden group"
            >
              <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-gradient-brand opacity-20 blur-2xl group-hover:opacity-40 transition-opacity" aria-hidden />
              <div className="relative space-y-4">
                <div>
                  <h3 className="font-display font-bold text-xl">{c.name}</h3>
                  <p className="text-sm text-gradient font-semibold mt-1">{c.vibe}</p>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{c.tagline}</p>
                <div>
                  <p className="font-display font-bold text-2xl">{formatMWK(c.price)}</p>
                  <p className="text-xs text-muted-foreground">Save {formatMWK(c.saving)}</p>
                </div>
                <Button asChild variant="whatsapp" size="sm" className="w-full">
                  <a href={buildWhatsAppLink(comboMessage(c.name, c.price, window.location.origin))} target="_blank" rel="noopener noreferrer">
                    Order
                  </a>
                </Button>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* LIFESTYLE BANNER */}
      <section className="container">
        <div className="relative rounded-3xl overflow-hidden border border-border/50">
          <img src={lifestyleMusic} alt="PowerPod lifestyle" loading="lazy" width={1280} height={960} className="w-full h-[420px] object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
          <div className="absolute inset-0 flex items-center">
            <div className="container max-w-xl space-y-5">
              <h2 className="font-display font-bold text-4xl sm:text-5xl leading-tight">Your Sound.<br /><span className="text-gradient">Your Vibe.</span></h2>
              <p className="text-muted-foreground text-lg">From study sessions to weekend parties, we've got the gear to power your life.</p>
              <Button asChild variant="hero" size="lg">
                <Link to="/about">Our Story <ArrowRight className="h-4 w-4" /></Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="container py-20">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-sm font-semibold text-gradient uppercase tracking-widest mb-2">Trending</p>
            <h2 className="font-display font-bold text-3xl sm:text-5xl tracking-tight">Gear up.</h2>
          </div>
          <Button asChild variant="outlineGlow">
            <Link to="/shop">Shop All <ArrowRight className="h-4 w-4" /></Link>
          </Button>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.slice(0, 3).map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="container py-20">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-brand p-10 md:p-16 text-center text-white">
          <div className="relative z-10 max-w-2xl mx-auto space-y-5">
            <h2 className="font-display font-bold text-3xl sm:text-5xl">Ready to vibe?</h2>
            <p className="text-white/85 text-lg">Order through WhatsApp. We deliver anywhere in Malawi.</p>
            <Button asChild size="xl" className="bg-background text-foreground hover:bg-background/90">
              <a href={buildWhatsAppLink(defaultMessage)} target="_blank" rel="noopener noreferrer">
                Message Us
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;