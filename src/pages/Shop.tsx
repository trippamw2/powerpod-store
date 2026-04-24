import { useState } from "react";
import { products, categories, categoryGroups, Category } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";
import { cn } from "@/lib/utils";
import { Zap, Music } from "lucide-react";

const Shop = () => {
  const [active, setActive] = useState<Category | "all">("all");

  const filtered = active === "all" ? products : products.filter((p) => p.category === active);

  const powerCategories = categories.filter(c => c.id !== "all" && categoryGroups.power.categories.includes(c.id));
  const audioCategories = categories.filter(c => c.id !== "all" && categoryGroups.audio.categories.includes(c.id));

  return (
    <div className="container py-8 sm:py-12">
      <div className="max-w-2xl space-y-3 mb-10">
        <h1 className="font-display font-bold text-4xl sm:text-5xl tracking-tight">Shop</h1>
        <p className="text-gray-500 text-lg">Power and sound for your everyday. All delivered via WhatsApp.</p>
      </div>

      {/* Category Groups */}
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <button
          onClick={() => setActive("power")}
          className="flex items-center gap-4 p-6 rounded-2xl bg-gradient-to-r from-orange-500 to-yellow-500 text-white hover:opacity-90 transition-opacity"
        >
          <Zap className="h-8 w-8" />
          <div className="text-left">
            <p className="font-semibold text-lg">Power</p>
            <p className="text-sm opacity-80">Chargers, adapters, power banks & cables</p>
          </div>
        </button>
        <button
          onClick={() => setActive("audio")}
          className="flex items-center gap-4 p-6 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 transition-opacity"
        >
          <Music className="h-8 w-8" />
          <div className="text-left">
            <p className="font-semibold text-lg">Audio</p>
            <p className="text-sm opacity-80">Speakers, headphones & earbuds</p>
          </div>
        </button>
      </div>

      {/* Subcategories */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setActive("all")}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-semibold transition-all border-2",
              active === "all"
                ? "bg-gray-900 text-white border-gray-900"
                : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
            )}
          >
            All Products
          </button>
        </div>

        {/* Power Subcategories */}
        <div className="mb-4">
          <p className="text-sm font-semibold text-gray-500 mb-2 flex items-center gap-2">
            <Zap className="h-4 w-4" /> Power
          </p>
          <div className="flex flex-wrap gap-2">
            {powerCategories.map((c) => (
              <button
                key={c.id}
                onClick={() => setActive(c.id)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all border",
                  active === c.id
                    ? "bg-orange-500 text-white border-orange-500"
                    : "bg-white border-gray-200 text-gray-600 hover:border-orange-300"
                )}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Audio Subcategories */}
        <div>
          <p className="text-sm font-semibold text-gray-500 mb-2 flex items-center gap-2">
            <Music className="h-4 w-4" /> Audio
          </p>
          <div className="flex flex-wrap gap-2">
            {audioCategories.map((c) => (
              <button
                key={c.id}
                onClick={() => setActive(c.id)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all border",
                  active === c.id
                    ? "bg-purple-500 text-white border-purple-500"
                    : "bg-white border-gray-200 text-gray-600 hover:border-purple-300"
                )}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filtered.map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center py-20 text-gray-500">No products found in this category.</p>
      )}
    </div>
  );
};

export default Shop;