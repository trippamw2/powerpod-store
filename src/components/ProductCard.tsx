import { useState } from "react";
import { Link } from "react-router-dom";
import { Product, formatMWK } from "@/data/products";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { ShoppingBag, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "@/hooks/use-toast";

export const ProductCard = ({ product, index = 0 }: { product: Product; index?: number }) => {
  const { add } = useCart();
  const [selectedType, setSelectedType] = useState(product.types[0]?.id || "");

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const typeName = product.types.find(t => t.id === selectedType)?.name || product.types[0]?.name || "";
    const fullName = `${product.name} (${typeName})`;
    add({ productKey: `${product.id}-${selectedType}`, name: fullName, price: product.price, image: product.image });
    toast({ title: "Added to cart", description: fullName });
  };

  const visibleTypes = product.types.slice(0, 3);
  const hiddenTypes = product.types.length > 3 ? product.types.slice(3) : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
    >
      <Link
        to={`/product/${product.id}`}
        className="group block rounded-2xl bg-white border border-gray-100 overflow-hidden hover:border-orange-200 hover:shadow-lg transition-all duration-300"
      >
        <div className="aspect-square overflow-hidden bg-gray-50">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="p-5 space-y-3">
          <div>
            <h3 className="font-semibold text-gray-900">{product.name}</h3>
            <p className="text-sm text-gray-500 line-clamp-2 mt-1">{product.benefit}</p>
          </div>
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
          <div className="flex items-center justify-between gap-2 pt-2">
            <span className="font-bold text-xl text-gray-900">{formatMWK(product.price)}</span>
          </div>
          <Button onClick={handleAdd} variant="hero" size="default" className="w-full">
            <ShoppingBag className="h-4 w-4" />
            Add to cart
          </Button>
        </div>
      </Link>
    </motion.div>
  );
};