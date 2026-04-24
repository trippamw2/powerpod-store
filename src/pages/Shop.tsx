import { useState } from "react";
import { products, categories, Category } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";
import { cn } from "@/lib/utils";

const Shop = () => {
  const [active, setActive] = useState<Category | "all">("all");

  const filtered = active === "all" ? products : products.filter((p) => p.category === active);

  return (
    <div className="container py-12 sm:py-16">
      <div className="max-w-2xl space-y-3 mb-10">
        <h1 className="font-display font-bold text-4xl sm:text-6xl tracking-tight">Gear Up.</h1>
        <p className="text-muted-foreground text-lg">Power and sound for your everyday. All delivered via WhatsApp.</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-3 mb-8 -mx-4 px-4 scrollbar-none">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setActive(c.id)}
            className={cn(
              "px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all border",
              active === c.id
                ? "bg-gradient-brand text-white border-transparent shadow-button"
                : "bg-card border-border text-muted-foreground hover:text-foreground hover:border-primary/40"
            )}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center py-20 text-muted-foreground">Nothing here yet. Check back soon.</p>
      )}
    </div>
  );
};

export default Shop;