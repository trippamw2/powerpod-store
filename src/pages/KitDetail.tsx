import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { formatMWK, kits, products, getItemImage, getKitSeparateTotal, getKitRealSaving, getKitDiscountPercent } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { ArrowLeft, ShoppingBag, MessageCircle, Check, Truck, ShieldCheck, Package } from "lucide-react";
import { buildWhatsAppLink } from "@/lib/whatsapp";

const KitDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { add } = useCart();
  const kit = kits.find((k) => k.id === id);
  const [adding, setAdding] = useState(false);

  if (!kit) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-2">Kit not found</p>
          <Link to="/combos" className="text-orange-500 hover:underline">Back to Kits</Link>
        </div>
      </div>
    );
  }

  const separateTotal = getKitSeparateTotal(kit);
  const realSaving = getKitRealSaving(kit);
  const discountPercent = getKitDiscountPercent(kit);
  const otherKits = kits.filter((k) => k.id !== kit.id).slice(0, 3);

  const handleAdd = () => {
    setAdding(true);
    add({ productKey: kit.id, name: kit.name, price: kit.price, image: kit.image }, 1);
    setTimeout(() => setAdding(false), 1200);
  };

  return (
    <div>
      {/* Back link */}
      <div className="container pt-4 sm:pt-6">
        <button onClick={() => navigate("/combos")} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Kits
        </button>
      </div>

      {/* Kit Hero */}
      <section className="container py-6 sm:py-10">
        <div className="grid lg:grid-cols-5 gap-8 sm:gap-12">
          {/* Left - Kit Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 space-y-4 sm:space-y-5"
          >
            {kit.badge && (
              <span className="inline-flex px-3 py-1 rounded-full bg-orange-500 text-white text-xs font-semibold">
                {kit.badge}
              </span>
            )}
            {kit.stock !== undefined && kit.stock <= 5 && (
              <span className="inline-flex px-3 py-1 rounded-full border border-orange-300 bg-white text-orange-600 text-xs font-medium ml-2">
                Only {kit.stock} left
              </span>
            )}

            <h1 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl leading-tight">{kit.name}</h1>
            <p className="text-lg sm:text-xl text-orange-600 font-medium">{kit.hook}</p>
            <p className="text-sm text-muted-foreground leading-relaxed">{kit.description}</p>

            {/* Price block */}
            <div className="bg-gray-50 rounded-xl p-5 sm:p-6 space-y-3">
              <div className="flex items-baseline gap-3">
                <span className="font-bold text-3xl sm:text-4xl text-gray-900">{formatMWK(kit.price)}</span>
                <span className="text-sm line-through text-gray-400">{formatMWK(separateTotal)}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                  <Check className="h-3 w-3" /> Save {formatMWK(realSaving)}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-100 text-orange-600 text-xs font-medium">
                  {discountPercent}% off separate
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-100 text-blue-600 text-xs font-medium">
                  <Package className="h-3 w-3" /> One box
                </span>
              </div>

              <div className="pt-3 flex flex-col sm:flex-row gap-3">
                <Button onClick={handleAdd} variant="hero" size="lg" className="text-sm flex-1" disabled={adding}>
                  {adding ? "Added!" : <><ShoppingBag className="h-4 w-4 mr-2" /> Add to Cart</>}
                </Button>
                <a
                  href={buildWhatsAppLink(`I want to order the ${kit.name} (${kit.items.join(", ")}). Total: ${formatMWK(kit.price)}`)}
                  target="_blank" rel="noopener noreferrer"
                >
                  <Button variant="outline" size="lg" className="text-sm w-full border-green-300 text-green-700 hover:bg-green-50">
                    <MessageCircle className="h-4 w-4 mr-2" /> Order on WhatsApp
                  </Button>
                </a>
              </div>
            </div>

            {/* Guarantees */}
            <div className="grid grid-cols-2 gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-orange-500 shrink-0" /> Free delivery over MK 50,000
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-orange-500 shrink-0" /> 30 day guarantee
              </div>
            </div>
          </motion.div>

          {/* Right - What's Inside */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-3"
          >
            <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8">
              <h2 className="font-display font-bold text-xl sm:text-2xl mb-6">What's Inside</h2>
              <div className="space-y-4">
                {kit.items.map((item) => {
                  const product = products.find((p) => p.name === item);
                  return (
                    <div key={item} className="flex items-center gap-4 p-3 sm:p-4 rounded-xl bg-gray-50 border border-gray-100">
                      <img src={getItemImage(item)} alt={item} className="h-16 w-16 sm:h-20 sm:w-20 rounded-xl object-cover border border-gray-200" />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm sm:text-base text-gray-900 truncate">{item}</p>
                        {product && (
                          <p className="text-xs text-muted-foreground mt-0.5">{product.benefit}</p>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                        {product && (
                          <p className="font-medium text-sm text-gray-500">{formatMWK(product.price)}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Price breakdown */}
              <div className="mt-6 pt-6 border-t border-gray-100 space-y-2 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Separate total</span>
                  <span>{formatMWK(separateTotal)}</span>
                </div>
                <div className="flex justify-between text-green-600 font-medium">
                  <span>Kit savings</span>
                  <span>-{formatMWK(realSaving)}</span>
                </div>
                <div className="flex justify-between font-bold text-base border-t border-gray-200 pt-2">
                  <span>Kit price</span>
                  <span className="text-orange-600">{formatMWK(kit.price)}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* You Might Also Like */}
      {otherKits.length > 0 && (
        <section className="bg-gray-50/50 py-10 sm:py-14">
          <div className="container">
            <h2 className="font-display font-bold text-xl sm:text-2xl mb-6">Other Kits You Might Like</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {otherKits.map((other, i) => (
                <motion.div
                  key={other.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    to={`/kits/${other.id}`}
                    className="block group relative rounded-xl bg-white border border-gray-100 hover:border-orange-200 hover:shadow-lg transition-all overflow-hidden"
                  >
                    <div className="p-5">
                      {other.badge && (
                        <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-orange-500 text-white text-[10px] font-semibold uppercase tracking-wider z-10">
                          {other.badge}
                        </span>
                      )}
                      <h3 className="font-display font-bold text-lg text-gray-900">{other.name}</h3>
                      <p className="text-sm text-orange-600 font-medium mt-0.5">{other.hook}</p>
                      <p className="text-xs text-muted-foreground mt-2">{other.description}</p>
                      <div className="flex -space-x-2 mt-3">
                        {other.items.slice(0, 4).map((item) => (
                          <img key={item} src={getItemImage(item)} alt={item} className="h-8 w-8 rounded-lg border-2 border-white object-cover shadow-sm" title={item} />
                        ))}
                        {other.items.length > 4 && (
                          <div className="h-8 w-8 rounded-lg border-2 border-white bg-gray-100 flex items-center justify-center text-[10px] text-gray-500 font-medium shadow-sm">
                            +{other.items.length - 4}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                        <div>
                          <p className="font-bold text-base text-gray-900">{formatMWK(other.price)}</p>
                          <p className="text-xs text-green-600 font-medium">Save {formatMWK(other.saving)}</p>
                        </div>
                        <span className="text-xs font-semibold text-orange-600 opacity-0 group-hover:opacity-100 transition-opacity">
                          View Kit
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default KitDetail;
