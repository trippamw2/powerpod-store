import { useState } from "react";
import { Link } from "react-router-dom";
import { Product, formatMWK } from "@/data/products";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { ShoppingBag } from "lucide-react";
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
    >
      <Link
        to={`/product/${product.id}`}
        className="group block rounded-3xl bg-card border border-border/60 overflow-hidden hover:border-primary/50 transition-all duration-500 hover:shadow-card"
      >
        <div className="aspect-square overflow-hidden bg-gradient-brand-soft">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            width={1024}
            height={1024}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        </div>
        <div className="p-5 space-y-3">
          <div>
            <h3 className="font-display font-semibold text-lg">{product.name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{product.benefit}</p>
          </div>
          {product.types.length > 0 && (
            <div className="flex gap-1 flex-wrap">
              {product.types.slice(0, 2).map((type) => (
                <button
                  key={type.id}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedType(type.id);
                  }}
                  className={`px-2 py-1 rounded-md text-xs font-medium transition-colors ${
                    selectedType === type.id
                      ? "bg-gradient-brand text-white"
                      : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {type.name}
                </button>
              ))}
            </div>
          )}
          <div className="flex items-center justify-between gap-2 pt-2">
            <span className="font-display font-bold text-gradient text-lg">{formatMWK(product.price)}</span>
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
