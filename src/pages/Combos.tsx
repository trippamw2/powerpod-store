import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { combos, formatMWK, getItemImage } from "@/data/products";
import { PromotionSlider } from "@/components/PromotionSlider";
import { useCart } from "@/contexts/CartContext";
import { Check, ShoppingBag } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Combos = () => {
  const { add } = useCart();

  const handleAddToCart = (combo: typeof combos[0]) => {
    add({
      productKey: `combo-${combo.id}`,
      name: combo.name,
      price: combo.price,
      image: getItemImage(combo.items[0]),
    });
    toast({ title: "Added to cart!", description: combo.name });
  };

  return (
    <div className="container py-4 sm:py-8 md:py-12">
      <div className="mb-4 sm:mb-6">
        <PromotionSlider page="combos" />
      </div>

      <div className="max-w-2xl space-y-2 sm:space-y-3 mb-4 sm:mb-8">
        <h1 className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl tracking-tight">Power Packs</h1>
        <p className="text-muted-foreground text-sm sm:text-base">Curated bundles for your lifestyle. Save more.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
        {combos.map((c, i) => (
          <motion.article
            key={c.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="relative rounded-xl sm:rounded-2xl p-4 sm:p-6 bg-card border border-border/60 overflow-hidden group hover:border-primary/50 transition-all"
          >
            <div className="flex items-start justify-between gap-2 sm:gap-3">
              <div>
                <h2 className="font-display font-bold text-base sm:text-xl lg:text-2xl">{c.name}</h2>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1 line-clamp-1">{c.tagline}</p>
              </div>
              <span className="shrink-0 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full bg-green-500/20 text-green-500 text-xs font-semibold">
                Save {formatMWK(c.saving)}
              </span>
            </div>

            <div className="mt-3 sm:mt-4 grid grid-cols-3 gap-1.5 sm:gap-2">
              {c.items.map((item) => (
                <div key={item} className="aspect-square rounded-lg overflow-hidden bg-secondary">
                  <img src={getItemImage(item)} alt={item} loading="lazy" className="h-full w-full object-cover" />
                </div>
              ))}
            </div>

            <div className="mt-3 sm:mt-4 space-y-0.5 sm:space-y-1">
              {c.items.map((item) => (
                <div key={item} className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
                  <Check className="h-2.5 sm:h-3 w-2.5 sm:w-3 text-green-500" /> <span className="truncate">{item}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/60">
              <div>
                <p className="text-xs text-muted-foreground">Bundle Price</p>
                <p className="font-display font-bold text-2xl text-gradient">{formatMWK(c.price)}</p>
              </div>
              <Button onClick={() => handleAddToCart(c)} variant="hero" size="sm">
                <ShoppingBag className="h-4 w-4" /> Add to Cart
              </Button>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
};

export default Combos;