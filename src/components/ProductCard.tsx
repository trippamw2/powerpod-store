import { useState } from "react";
import { Link } from "react-router-dom";
import { Product, formatMWK } from "@/data/products";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { ShoppingBag, Plus, Heart, Star, Check, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "@/hooks/use-toast";

interface ProductCardProps {
  product: Product;
  index?: number;
  showBadge?: "new" | "sale" | "best" | "hot" | null;
  discount?: number;
}

export const ProductCard = ({ product, index = 0, showBadge = null, discount = 0 }: ProductCardProps) => {
  const { add } = useCart();
  const [selectedType, setSelectedType] = useState(product.types[0]?.id || "");
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const typeName = product.types.find(t => t.id === selectedType)?.name || product.types[0]?.name || "";
    const fullName = `${product.name} (${typeName})`;
    add({ productKey: `${product.id}-${selectedType}`, name: fullName, price: product.price, image: product.image });
    toast({ title: "Added to cart", description: fullName });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    toast({
      title: isWishlisting ? "Removed from wishlist" : "Added to wishlist",
      description: product.name,
    });
  };

  const visibleTypes = product.types.slice(0, 3);
  const hiddenTypes = product.types.length > 3 ? product.types.slice(3) : [];
  const displayPrice = discount > 0 ? product.price * (1 - discount / 100) : product.price;
  const stockQty = product.stock ?? 10;
  const isInStock = stockQty > 0;

  const badgeConfig = {
    new: { label: "New", bg: "bg-green-500", text: "text-white" },
    sale: { label: `-${discount}%`, bg: "bg-red-500", text: "text-white" },
    best: { label: "Best Seller", bg: "bg-orange-500", text: "text-white" },
    hot: { label: "Hot Deal", bg: "bg-yellow-500", text: "text-gray-900" },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
    >
      <Link
        to={`/product/${product.id}`}
        className="group block rounded-2xl bg-white border border-gray-100 overflow-hidden hover:border-orange-200 hover:shadow-xl transition-all duration-300"
      >
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          
          {/* Badges */}
          {(showBadge || discount > 0) && (
            <div className="absolute top-3 left-3 flex flex-col gap-1">
              {discount > 0 && (
                <span className="px-2 py-1 text-xs font-bold rounded-md bg-red-500 text-white">
                  -{discount}%
                </span>
              )}
              {showBadge && showBadge !== "sale" && (
                <span className={`px-2 py-1 text-xs font-bold rounded-md ${badgeConfig[showBadge].bg} ${badgeConfig[showBadge].text}`}>
                  {badgeConfig[showBadge].label}
                </span>
              )}
            </div>
          )}

          {/* Wishlist Button */}
          <button
            onClick={handleWishlist}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-md hover:bg-white hover:scale-110 transition-all duration-200"
          >
            <Heart
              className={`h-4 w-4 transition-colors ${
                isWishlisted ? "fill-red-500 text-red-500" : "text-gray-400"
              }`}
            />
          </button>

          {/* Stock Status */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
            <span className={`flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${
              isInStock ? (stockQty <= 5 ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700") : "bg-red-100 text-red-700"
            }`}>
              {isInStock ? <Check className="h-3 w-3" /> : null}
              {isInStock ? (stockQty <= 5 ? `Only ${stockQty} left` : "In Stock") : "Out of Stock"}
            </span>
          </div>

          {/* Quick View Overlay */}
          <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
            <Link to={`/product/${product.id}`} className="flex items-center justify-center w-full py-2 px-4 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-100 transition-colors">
              View Product
            </Link>
          </div>
        </div>

        <div className="p-4 sm:p-5 space-y-3">
          {/* Brand */}
          {(product as any).brand && (
            <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full inline-block">
              {(product as any).brand}
            </span>
          )}

          {/* Name & Rating */}
          <div>
            <h3 className="font-semibold text-gray-900 text-base sm:text-lg line-clamp-2">{product.name}</h3>
            <p className="text-xs sm:text-sm text-gray-500 line-clamp-2 mt-1">{product.benefit}</p>
            
            {/* Rating Display */}
            <div className="flex items-center gap-1 mt-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-3 w-3 sm:h-3.5 sm:w-3.5 ${
                      star <= 4 ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-400"></span>
            </div>
          </div>

          {/* Type Selection */}
          {product.types.length > 0 && (
            <div className="flex gap-1.5 flex-wrap">
              {visibleTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedType(type.id);
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    selectedType === type.id
                      ? "bg-orange-500 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {type.name}
                </button>
              ))}
              {hiddenTypes.length > 0 && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  className="px-3 py-1.5 rounded-full text-xs font-medium bg-gray-50 text-gray-500 flex items-center gap-1"
                >
                  <Plus className="h-3 w-3" /> +{hiddenTypes.length}
                </button>
              )}
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-2 pt-2">
            <span className="font-bold text-xl sm:text-2xl text-gray-900">
              {formatMWK(discount > 0 ? displayPrice : product.price)}
            </span>
            {discount > 0 && (
              <span className="text-xs sm:text-sm text-gray-400 line-through">
                {formatMWK(product.price)}
              </span>
            )}
          </div>

          <Button onClick={handleAdd} variant="hero" size="default" className="w-full text-sm">
            <ShoppingBag className="h-4 w-4" />
            Add to cart
          </Button>
        </div>
      </Link>
    </motion.div>
  );
};