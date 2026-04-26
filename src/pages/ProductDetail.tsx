import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { products, formatMWK } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Minus, Plus, ShoppingBag, Check, Truck, ShieldCheck, Star, Heart, Share2, ChevronDown, ChevronUp } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { toast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const product = products.find((p) => p.id === id);
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [selectedType, setSelectedType] = useState(product?.types[0]?.id || "");
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  if (!product) {
    return (
      <div className="container py-20 text-center space-y-4">
        <h1 className="font-display font-bold text-3xl">Product not found</h1>
        <Button asChild variant="hero"><Link to="/shop">Back to shop</Link></Button>
      </div>
    );
  }

  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);
  
  const handleAdd = () => {
    const typeName = product.types.find(t => t.id === selectedType)?.name || product.types[0]?.name || "";
    const fullName = `${product.name} (${typeName})`;
    add({ productKey: `${product.id}-${selectedType}`, name: fullName, price: product.price, image: product.image }, qty);
    toast({ title: "Added to cart", description: `${qty} × ${fullName}` });
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast({
      title: isWishlisted ? "Removed from wishlist" : "Added to wishlist",
      description: product.name,
    });
  };

  const specs = [
    { label: "Brand", value: product.brand || "Generic" },
    { label: "Category", value: product.category },
    { label: "Warranty", value: "6 Months" },
    { label: "SKU", value: product.id.toUpperCase() },
  ];

  const faqs = [
    { q: "Is this product genuine?", a: "Yes, all our products are 100% genuine and sourced from authorized distributors." },
    { q: "Do you offer warranty?", a: "Yes, all electronics come with at least 6 months manufacturer warranty." },
    { q: "How long is delivery?", a: "Delivery takes 1-3 business days within Blantyre, 3-5 days for other districts." },
  ];

  return (
    <div className="container py-10 sm:py-14">
      <Link to="/shop" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to shop
      </Link>

      <div className="grid lg:grid-cols-2 gap-10">
        {/* Image Gallery */}
        <div className="space-y-4">
          <motion.div 
            className="relative rounded-3xl overflow-hidden bg-gray-100 border border-border/60 aspect-square"
          >
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover"
            />
            {/* Quick Actions */}
            <div className="absolute top-4 right-4 flex gap-2">
              <button
                onClick={handleWishlist}
                className="p-3 rounded-full bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white hover:scale-110 transition-all"
              >
                <Heart className={`h-5 w-5 ${isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
              </button>
              <button className="p-3 rounded-full bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white hover:scale-110 transition-all">
                <Share2 className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </motion.div>

          {/* Thumbnails */}
          <div className="flex gap-3">
            {[product.image, product.image, product.image].map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                  selectedImage === i ? "border-orange-500" : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div className="space-y-3">
            {product.brand && (
              <span className="text-sm font-semibold text-orange-600 bg-orange-50 px-3 py-1 rounded-full inline-block">
                {product.brand}
              </span>
            )}
            <p className="text-sm font-semibold text-gradient uppercase tracking-widest">{product.category}</p>
            <h1 className="font-display font-bold text-4xl sm:text-5xl tracking-tight">{product.name}</h1>
            <p className="text-muted-foreground text-lg">{product.benefit}</p>

            {/* Rating & Stock */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className={`h-5 w-5 ${star <= 4 ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}`} />
                ))}
                <span className="ml-1 text-sm text-gray-600">(24 reviews)</span>
              </div>
              <span className="flex items-center gap-1 text-sm text-green-600">
                <Check className="h-4 w-4" /> In Stock
              </span>
            </div>
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

          {/* Trust Badges */}
          <div className="grid grid-cols-2 gap-3 py-4 border-y border-border">
            <div className="flex items-center gap-2 text-sm">
              <Check className="h-5 w-5 text-green-500" />
              <span>Fast Checkout</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Truck className="h-5 w-5 text-green-500" />
              <span>Malawi Delivery</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <ShieldCheck className="h-5 w-5 text-green-500" />
              <span>Genuine Products</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Check className="h-5 w-5 text-green-500" />
              <span>6 Month Warranty</span>
            </div>
          </div>

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

      {/* Specifications */}
      <div className="mt-16">
        <h2 className="font-display font-bold text-2xl mb-6">Specifications</h2>
        <div className="rounded-2xl border border-border overflow-hidden">
          <table className="w-full">
            <tbody>
              {specs.map((spec, i) => (
                <tr key={spec.label} className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                  <td className="px-6 py-4 font-medium text-gray-600">{spec.label}</td>
                  <td className="px-6 py-4">{spec.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ */}
      <div className="mt-16">
        <h2 className="font-display font-bold text-2xl mb-6">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <FAQItem key={i} question={faq.q} answer={faq.a} />
          ))}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-16">
        <h2 className="font-display font-bold text-2xl mb-6">Customer Reviews</h2>
        <div className="rounded-2xl border border-border p-6">
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-5xl font-bold text-gray-900">4.8</div>
              <div className="flex mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className={`h-4 w-4 ${star <= 4 ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}`} />
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-1">24 reviews</p>
            </div>
            <div className="flex-1 space-y-2">
              {[5, 4, 3, 2, 1].map((stars) => (
                <div key={stars} className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 w-8">{stars}★</span>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-yellow-400 rounded-full" 
                      style={{ width: stars === 5 ? "70%" : stars === 4 ? "20%" : "10%" }}
                    />
                  </div>
                  <span className="text-sm text-gray-400 w-8">{stars === 5 ? "70%" : stars === 4 ? "20%" : "10%"}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="font-display font-bold text-2xl mb-6">You May Also Like</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} showBadge={i === 0 ? "hot" : null} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const FAQItem = ({ question, answer }: { question: string; answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between text-left"
      >
        <span className="font-medium">{question}</span>
        {isOpen ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="px-6 pb-4 text-gray-600">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductDetail;