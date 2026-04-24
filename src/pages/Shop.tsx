import { useState } from "react";
import { products, categories, Category } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";
import { PromotionSlider } from "@/components/PromotionSlider";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";

const Shop = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = products.filter(p => {
    const matchesCategory = selectedCategory === "all" || p.category === selectedCategory;
    const matchesSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.benefit.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const clearFilters = () => {
    setSelectedCategory("all");
    setSearchQuery("");
  };

  const hasFilters = selectedCategory !== "all" || searchQuery;

  return (
    <div className="container py-8 sm:py-12">
      <div className="mb-6">
        <PromotionSlider page="shop" className="shadow-lg" />
      </div>

      <div className="max-w-2xl space-y-3 mb-8">
        <h1 className="font-display font-bold text-4xl sm:text-5xl tracking-tight">Shop</h1>
        <p className="text-gray-500 text-lg">Power and sound for your everyday.</p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
            </button>
          )}
        </div>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            selectedCategory === "all"
              ? "bg-gray-900 text-white"
              : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"
          }`}
        >
          All
        </button>
        {categories.filter(c => c.id !== "all").map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCategory(c.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedCategory === c.id
                ? "bg-orange-500 text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:border-orange-300"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Clear filters */}
      {hasFilters && (
        <button
          onClick={clearFilters}
          className="text-sm text-muted-foreground hover:text-foreground mb-4 flex items-center gap-1"
        >
          <X className="h-4 w-4" /> Clear filters
        </button>
      )}

      {/* Results count */}
      <p className="text-sm text-muted-foreground mb-4">
        {filtered.length} {filtered.length === 1 ? "product" : "products"} found
      </p>

      {/* Products Grid */}
      {filtered.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 space-y-4">
          <p className="text-muted-foreground text-lg">No products found</p>
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-orange-500 text-white rounded-full text-sm font-medium"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
};

export default Shop;