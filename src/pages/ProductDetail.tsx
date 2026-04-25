import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { products, formatMWK } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Minus, Plus, ShoppingBag, Check, Truck, ShieldCheck } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { toast } from "@/hooks/use-toast";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const product = products.find((p) => p.id === id);
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [selectedType, setSelectedType] = useState(product?.types[0]?.id || "");

  if (!product) {
    return (
      <div className="container py-20 text-center space-y-4">
        <h1 className="font-display font-bold text-3xl">Product not found</h1>
        <Button asChild variant="hero"><Link to="/shop">Back to shop</Link></Button>
      </div>
    );
  }

  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 3);

  const handleAdd = () => {
    const typeName = product.types.find(t => t.id === selectedType)?.name || product.types[0]?.name || "";
    const fullName = `${product.name} (${typeName})`;
    add({ productKey: `${product.id}-${selectedType}`, name: fullName, price: product.price, image: product.image }, qty);
    toast({ title: "Added to cart", description: `${qty} × ${fullName}` });
  };

  return (
    <div className="container py-10 sm:py-14">
      <Link to="/shop" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to shop
      </Link>

      <div className="grid lg:grid-cols-2 gap-10">
        <div className="rounded-3xl overflow-hidden bg-gradient-brand-soft border border-border/60">
          <img src={product.image} alt={product.name} className="w-full aspect-square object-cover" />
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            {product.brand && (
              <span className="text-sm font-medium text-orange-600 bg-orange-50 px-3 py-1 rounded-full inline-block">
                {product.brand}
              </span>
            )}
            <p className="text-sm font-semibold text-gradient uppercase tracking-widest">{product.category}</p>
            <h1 className="font-display font-bold text-4xl sm:text-5xl tracking-tight">{product.name}</h1>
            <p className="text-muted-foreground text-lg">{product.benefit}</p>
          </div>

          <p className="font-display font-bold text-4xl text-gradient">{formatMWK(product.price)}</p>

          {product.types.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Select Type:</p>
              <div className="flex gap-2 flex-wrap">
                {product.types.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                      selectedType === type.id
                        ? "bg-gradient-brand text-white border-transparent"
                        : "bg-card border-border text-muted-foreground hover:text-foreground hover:border-primary/40"
                    }`}
                  >
                    {type.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> Fast checkout with PayChangu</li>
            <li className="flex items-center gap-2"><Truck className="h-4 w-4 text-green-500" /> Delivery across Malawi</li>
            <li className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-green-500" /> Tested & trusted products</li>
          </ul>

          <div className="flex items-center gap-3">
            <div className="flex items-center rounded-full border border-border bg-card">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="p-3 hover:text-primary" aria-label="Decrease"><Minus className="h-4 w-4" /></button>
              <span className="w-10 text-center font-semibold">{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} className="p-3 hover:text-primary" aria-label="Increase"><Plus className="h-4 w-4" /></button>
            </div>
            <Button onClick={handleAdd} variant="hero" size="lg" className="flex-1">
              <ShoppingBag className="h-5 w-5" /> Add to cart
            </Button>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="font-display font-bold text-2xl sm:text-3xl mb-6">You may also like</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {related.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetail;
