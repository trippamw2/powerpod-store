import { useState } from "react";
import { products, categories, Category, BRANDS } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";
import { PromotionSlider } from "@/components/PromotionSlider";
import { Search, X, Grid3X3, List, SlidersHorizontal, ChevronDown, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const Shop = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "price-low" | "price-high" | "name">("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(100000);

  const minPrice = Math.min(...products.map(p => p.price));
  const maxPrice = Math.max(...products.map(p => p.price));

  const filtered = products.filter(p => {
    const matchesCategory = selectedCategory === "all" || p.category === selectedCategory;
    const matchesSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.benefit.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes((p as any).brand || "");
    const matchesPrice = p.price >= priceMin && p.price <= priceMax;
    return matchesCategory && matchesSearch && matchesBrand && matchesPrice;
  });

  const sorted = [...filtered].sort((a, b) => {
    switch (sortBy) {
      case "price-low": return a.price - b.price;
      case "price-high": return b.price - a.price;
      case "name": return a.name.localeCompare(b.name);
      default: return 0;
    }
  });

  const clearFilters = () => {
    setSelectedCategory("all");
    setSearchQuery("");
    setSelectedBrands([]);
  };

  const toggleBrand = (brandId: string) => {
    setSelectedBrands(prev => 
      prev.includes(brandId) 
        ? prev.filter(b => b !== brandId)
        : [...prev, brandId]
    );
  };

  const hasFilters = selectedCategory !== "all" || searchQuery || selectedBrands.length > 0;

  return (
    <div className="container py-8 sm:py-12">
      <div className="mb-6">
        <PromotionSlider page="shop" className="shadow-lg" />
      </div>

      <div className="max-w-2xl space-y-3 mb-8">
        <h1 className="font-display font-bold text-4xl sm:text-5xl tracking-tight">Shop</h1>
        <p className="text-gray-500 text-lg">Power and sound for your everyday.</p>
      </div>

      {/* Search & Sort Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Filter Toggle */}
          <Button
            variant={showFilters ? "default" : "outline"}
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {selectedBrands.length > 0 && (
              <span className="ml-1 px-1.5 py-0.5 bg-white text-gray-900 rounded-full text-xs">{selectedBrands.length}</span>
            )}
          </Button>

          {/* Sort */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="appearance-none pl-4 pr-10 py-2 rounded-full border border-gray-200 bg-white text-sm font-medium focus:outline-none focus:border-teal-500"
            >
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name A-Z</option>
            </select>
            <ArrowUpDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>

          {/* View Toggle */}
          <div className="hidden md:flex border border-gray-200 rounded-full overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 ${viewMode === "grid" ? "bg-gray-100" : "bg-white"}`}
            >
              <Grid3X3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 ${viewMode === "list" ? "bg-gray-100" : "bg-white"}`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-gray-50 rounded-2xl p-6 mb-6 space-y-4">
              <div>
                <h3 className="font-medium mb-3">Brand</h3>
                <div className="flex flex-wrap gap-2">
                  {BRANDS.slice(0, 10).map((brand) => (
                    <button
                      key={brand.id}
                      onClick={() => toggleBrand(brand.id)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                        selectedBrands.includes(brand.id)
                          ? "bg-teal-600 text-white"
                          : "bg-white border border-gray-200 text-gray-600 hover:border-teal-300"
                      }`}
                    >
                      {brand.name}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-3">Price Range (MWK)</h3>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    value={priceMin}
                    onChange={(e) => setPriceMin(Number(e.target.value))}
                    placeholder="Min"
                    className="w-24 px-3 py-2 border border-gray-200 rounded-lg text-sm"
                  />
                  <span className="text-gray-400">to</span>
                  <input
                    type="number"
                    value={priceMax}
                    onChange={(e) => setPriceMax(Number(e.target.value))}
                    placeholder="Max"
                    className="w-24 px-3 py-2 border border-gray-200 rounded-lg text-sm"
                  />
                </div>
                <div className="flex gap-2 mt-2">
                  <button onClick={() => { setPriceMin(0); setPriceMax(10000); }} className="px-2 py-1 text-xs bg-gray-100 rounded hover:bg-gray-200">Under 10K</button>
                  <button onClick={() => { setPriceMin(10000); setPriceMax(25000); }} className="px-2 py-1 text-xs bg-gray-100 rounded hover:bg-gray-200">10K - 25K</button>
                  <button onClick={() => { setPriceMin(25000); setPriceMax(50000); }} className="px-2 py-1 text-xs bg-gray-100 rounded hover:bg-gray-200">25K - 50K</button>
                  <button onClick={() => { setPriceMin(50000); setPriceMax(1000000); }} className="px-2 py-1 text-xs bg-gray-100 rounded hover:bg-gray-200">50K+</button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Categories */}
      <div className="flex flex-wrap gap-2 mb-4">
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
                ? "bg-teal-500 text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:border-teal-300"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Active Filters */}
      {hasFilters && (
        <div className="flex flex-wrap gap-2 mb-4">
          {selectedCategory !== "all" && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm">
              {categories.find(c => c.id === selectedCategory)?.label}
              <button onClick={() => setSelectedCategory("all")}><X className="h-3 w-3" /></button>
            </span>
          )}
          {searchQuery && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm">
              "{searchQuery}"
              <button onClick={() => setSearchQuery("")}><X className="h-3 w-3" /></button>
            </span>
          )}
          <button onClick={clearFilters} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
            <X className="h-4 w-4" /> Clear all
          </button>
        </div>
      )}

      {/* Results count */}
      <p className="text-sm text-muted-foreground mb-4">
        Showing {sorted.length} of {products.length} products
      </p>

      {/* Products Grid */}
      {sorted.length > 0 ? (
        <div className={viewMode === "grid" 
          ? "grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5" 
          : "grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
        }>
          {sorted.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} showBadge={i === 0 ? "hot" : i === 1 ? "new" : null} discount={i === 0 ? 15 : 0} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 space-y-4">
          <p className="text-muted-foreground text-lg">No products found</p>
          <button onClick={clearFilters} className="px-4 py-2 bg-teal-500 text-white rounded-full text-sm font-medium">
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
};

export default Shop;