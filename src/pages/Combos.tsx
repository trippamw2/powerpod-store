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
    <div className="container py-8 sm:py-12">
      <div className="mb-4">
        <PromotionSlider page="combos" />
      </div>

      <div className="max-w-2xl space-y-3 mb-8">
        <h1 className="font-display font-bold text-3xl sm:text-4xl tracking-tight">Power Packs</h1>
        <p className="text-muted-foreground">Curated bundles for your lifestyle. Save more.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {combos.map((c, i) => (
          <motion.article
            key={c.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="relative rounded-2xl p-6 bg-card border border-border/60 overflow-hidden group hover:border-primary/50 transition-all"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-display font-bold text-xl sm:text-2xl">{c.name}</h2>
                <p className="text-sm text-muted-foreground mt-1">{c.tagline}</p>
              </div>
              <span className="shrink-0 px-2 py-1 rounded-full bg-green-500/20 text-green-500 text-xs font-semibold">
                Save {formatMWK(c.saving)}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2">
              {c.items.map((item) => (
                <div key={item} className="aspect-square rounded-lg overflow-hidden bg-secondary">
                  <img src={getItemImage(item)} alt={item} loading="lazy" className="h-full w-full object-cover" />
                </div>
              ))}
            </div>

            <div className="mt-4 space-y-1">
              {c.items.map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Check className="h-3 w-3 text-green-500" /> {item}
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