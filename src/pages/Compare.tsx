import { Link } from "react-router-dom";
import { useCompare } from "@/contexts/CompareContext";
import { formatMWK } from "@/data/products";
import { X, ArrowLeft, Star, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { toast } from "@/hooks/use-toast";

const Compare = () => {
  const { compareList, removeFromCompare, clearCompare } = useCompare();
  const { add } = useCart();

  const handleAddToCart = (product: typeof compareList[0]) => {
    add({
      productKey: `${product.id}-${product.types[0]?.id || "default"}`,
      name: product.name,
      price: product.is_on_sale
        ? Math.round(product.price * (1 - product.discount_percent / 100))
        : product.price,
      image: product.image,
    });
    toast({ title: "Added to cart!", description: product.name });
  };

  if (compareList.length === 0) {
    return (
      <div className="container py-12 text-center">
        <h1 className="font-display font-bold text-2xl mb-4">Compare Products</h1>
        <p className="text-gray-500 mb-6">No products to compare yet.</p>
        <Link to="/shop">
          <Button>Browse Shop</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link to="/shop" className="flex items-center gap-2 text-gray-500 hover:text-gray-900">
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
          <h1 className="font-display font-bold text-2xl">Compare Products</h1>
        </div>
        <Button variant="outline" onClick={clearCompare} className="text-red-500">
          Clear All
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="text-left p-3 bg-gray-50 w-32"></th>
              {compareList.map((p) => (
                <th key={p.id} className="p-3 bg-gray-50 relative">
                  <button
                    onClick={() => removeFromCompare(p.id)}
                    className="absolute top-2 right-2 p-1 rounded-full bg-gray-200 hover:bg-gray-300"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-32 h-32 object-contain mx-auto mb-2"
                  />
                  <p className="font-medium text-sm line-clamp-2">{p.name}</p>
                </th>
              ))}
              {[...Array(4 - compareList.length)].map((_, i) => (
                <th key={`empty-${i}`} className="p-3 bg-gray-50 border-dashed border-2 border-gray-200">
                  <Link to="/shop" className="text-orange-500 text-sm hover:underline">
                    + Add Product
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-t">
              <td className="p-3 font-medium text-gray-500">Price</td>
              {compareList.map((p) => (
                <td key={p.id} className="p-3 text-center">
                  {p.is_on_sale ? (
                    <>
                      <span className="text-red-500 font-bold">
                        {formatMWK(Math.round(p.price * (1 - p.discount_percent / 100)))}
                      </span>
                      <span className="text-gray-400 line-through ml-2 text-sm">
                        {formatMWK(p.price)}
                      </span>
                    </>
                  ) : (
                    <span className="font-bold">{formatMWK(p.price)}</span>
                  )}
                </td>
              ))}
              {[...Array(4 - compareList.length)].map((_, i) => (
                <td key={`empty-${i}`} className="p-3"></td>
              ))}
            </tr>
            <tr className="border-t">
              <td className="p-3 font-medium text-gray-500">Brand</td>
              {compareList.map((p) => (
                <td key={p.id} className="p-3 text-center">{p.brand || "Generic"}</td>
              ))}
              {[...Array(4 - compareList.length)].map((_, i) => (
                <td key={`empty-${i}`} className="p-3"></td>
              ))}
            </tr>
            <tr className="border-t">
              <td className="p-3 font-medium text-gray-500">Rating</td>
              {compareList.map((p) => (
                <td key={p.id} className="p-3 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{p.rating || "N/A"}</span>
                  </div>
                </td>
              ))}
              {[...Array(4 - compareList.length)].map((_, i) => (
                <td key={`empty-${i}`} className="p-3"></td>
              ))}
            </tr>
            <tr className="border-t">
              <td className="p-3 font-medium text-gray-500">Stock</td>
              {compareList.map((p) => (
                <td key={p.id} className="p-3 text-center">
                  <span className={p.stock && p.stock > 0 ? "text-green-500" : "text-red-500"}>
                    {p.stock && p.stock > 0 ? `${p.stock} available` : "Out of stock"}
                  </span>
                </td>
              ))}
              {[...Array(4 - compareList.length)].map((_, i) => (
                <td key={`empty-${i}`} className="p-3"></td>
              ))}
            </tr>
            <tr className="border-t">
              <td className="p-3 font-medium text-gray-500">Benefit</td>
              {compareList.map((p) => (
                <td key={p.id} className="p-3 text-sm text-gray-600">
                  {p.benefit}
                </td>
              ))}
              {[...Array(4 - compareList.length)].map((_, i) => (
                <td key={`empty-${i}`} className="p-3"></td>
              ))}
            </tr>
            <tr className="border-t">
              <td className="p-3"></td>
              {compareList.map((p) => (
                <td key={p.id} className="p-3 text-center">
                  <Button
                    size="sm"
                    onClick={() => handleAddToCart(p)}
                    disabled={!p.stock || p.stock <= 0}
                    className="bg-orange-500 hover:bg-orange-600"
                  >
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </td>
              ))}
              {[...Array(4 - compareList.length)].map((_, i) => (
                <td key={`empty-${i}`} className="p-3"></td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Compare;