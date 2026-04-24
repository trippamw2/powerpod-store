import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { combos, formatMWK, getItemImage } from "@/data/products";
import { PromotionSlider } from "@/components/PromotionSlider";
import { buildWhatsAppLink, comboMessage } from "@/lib/whatsapp";
import { Check } from "lucide-react";

const Combos = () => (
  <div className="container py-12 sm:py-16">
    {/* Promotion Slider */}
    <div className="mb-8">
      <PromotionSlider page="combos" className="shadow-lg" />
    </div>

    <div className="max-w-2xl space-y-3 mb-12">
      <h1 className="font-display font-bold text-4xl sm:text-6xl tracking-tight">Power Packs.</h1>
      <p className="text-muted-foreground text-lg">Curated bundles for your lifestyle. Save more, vibe more.</p>
    </div>

    <div className="grid lg:grid-cols-2 gap-6">
      {combos.map((c, i) => (
        <motion.article
          key={c.id}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: i * 0.1 }}
          className="relative rounded-3xl p-8 bg-card border border-border/60 overflow-hidden group hover:border-primary/50 transition-all hover:shadow-card"
        >
          <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-gradient-brand opacity-15 blur-3xl group-hover:opacity-30 transition-opacity" aria-hidden />
          <div className="relative space-y-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-display font-bold text-2xl sm:text-3xl">{c.name}</h2>
                <p className="text-gradient font-semibold mt-1">{c.vibe}</p>
              </div>
              <span className="inline-flex shrink-0 items-center px-3 py-1 rounded-full bg-gradient-brand text-white text-xs font-bold">
                Save {formatMWK(c.saving)}
              </span>
            </div>
            <p className="text-muted-foreground">{c.description}</p>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {c.items.map((item) => (
                <div key={item} className="aspect-square rounded-xl overflow-hidden bg-gradient-brand-soft border border-border/60" title={item}>
                  <img src={getItemImage(item)} alt={item} loading="lazy" className="h-full w-full object-cover" />
                </div>
              ))}
            </div>

            <ul className="space-y-2">
              {c.items.map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-accent shrink-0" /> {item}
                </li>
              ))}
            </ul>
            <div className="flex items-center justify-between pt-3 border-t border-border/60">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Bundle Price</p>
                <p className="font-display font-bold text-3xl text-gradient">{formatMWK(c.price)}</p>
              </div>
              <Button asChild variant="whatsapp" size="lg">
                <a href={buildWhatsAppLink(comboMessage(c.name, c.price, window.location.origin))} target="_blank" rel="noopener noreferrer">
                  Order
                </a>
              </Button>
            </div>
          </div>
        </motion.article>
      ))}
    </div>
  </div>
);

export default Combos;