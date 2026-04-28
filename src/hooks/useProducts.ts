import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { products as staticProducts, Product } from "@/data/products";

interface DatabaseProduct {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  brand: string | null;
  image: string | null;
  is_active: boolean;
  created_at: string;
}

interface InventoryRecord {
  product_id: string;
  quantity: number;
  reserved_quantity: number;
  cost_price_mwk: number;
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch products from database (all products, no filter)
      const { data: dbProducts, error: productsError } = await supabase
        .from("products")
        .select("*");

      if (productsError) {
        console.error("Fetch products error:", productsError);
        throw productsError;
      }

      // Fetch inventory for stock levels
      const { data: inventory, error: inventoryError } = await supabase
        .from("inventory")
        .select("product_id, quantity, reserved_quantity");

      if (inventoryError) {
        console.error("Fetch inventory error:", inventoryError);
      }

      // Build inventory map
      const inventoryMap = new Map<string, InventoryRecord>();
      inventory?.forEach((inv) => {
        inventoryMap.set(inv.product_id, inv as InventoryRecord);
      });

      // Map database products to frontend format
      if (dbProducts && dbProducts.length > 0) {
        console.log("✅ Products fetched:", dbProducts.length);
        const mappedProducts: Product[] = dbProducts.map((p: any) => {
          const inv = inventoryMap.get(p.id);
          // Check for invalid images (external URLs that may not load)
          if (p.image && !p.image.includes("oalemobile.com")) {
            console.warn("⚠️ Product has external image:", p.name, p.image);
          }
          return {
            id: p.id,
            name: p.name,
            benefit: p.description || "",
            price: p.price,
            category: p.category as Product["category"],
            image: p.image || "",
            brand: p.brand || "Generic",
            types: [],
            stock: inv ? inv.quantity - (inv.reserved_quantity || 0) : 10,
            is_featured: p.is_featured || false,
            is_best_seller: p.is_best_seller || false,
            is_on_sale: p.is_on_sale || false,
            discount_percent: p.discount_percent || 0,
            gallery_images: p.gallery_images || [],
            specs: p.specs || {},
            reward_points: p.reward_points || Math.round(p.price / 100),
          };
        });
        setProducts(mappedProducts);
      } else {
        console.warn("⚠️ No products from DB, falling back to static. dbProducts:", dbProducts?.length);
        // Fallback to static products if database is empty
        setProducts(staticProducts);
      }
    } catch (err) {
      console.error("❌ Products fetch error:", err);
      setError("Failed to load products");
      // Fallback to static products on error
      setProducts(staticProducts);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Get single product by ID
  const getProduct = useCallback((id: string) => {
    return products.find((p) => p.id === id);
  }, [products]);

  // Get products by category
  const getProductsByCategory = useCallback((category: string) => {
    if (category === "all") return products;
    return products.filter((p) => p.category?.toLowerCase() === category.toLowerCase());
  }, [products]);

  // Check and reserve stock (for checkout)
  const checkAndReserveStock = useCallback(async (productId: string, quantity: number): Promise<boolean> => {
    try {
      // Get current inventory
      const { data: inventory, error } = await supabase
        .from("inventory")
        .select("quantity, reserved_quantity")
        .eq("product_id", productId)
        .single();

      if (error || !inventory) {
        return false; // No inventory record
      }

      const available = inventory.quantity - inventory.reserved_quantity;
      return available >= quantity;
    } catch {
      return false;
    }
  }, []);

  // Reserve stock (call after order confirmed)
  const reserveStock = useCallback(async (productId: string, quantity: number): Promise<boolean> => {
    try {
      const { data: inventory, error } = await supabase
        .from("inventory")
        .select("reserved_quantity")
        .eq("product_id", productId)
        .single();

      if (error || !inventory) {
        return false;
      }

      const { error: updateError } = await supabase
        .from("inventory")
        .update({
          reserved_quantity: (inventory.reserved_quantity || 0) + quantity,
        })
        .eq("product_id", productId);

      if (updateError) {
        console.error("Reserve stock error:", updateError);
        return false;
      }

      return true;
    } catch {
      return false;
    }
  }, []);

  // Release reserved stock (call if order cancelled)
  const releaseStock = useCallback(async (productId: string, quantity: number): Promise<boolean> => {
    try {
      const { data: inventory, error } = await supabase
        .from("inventory")
        .select("reserved_quantity")
        .eq("product_id", productId)
        .single();

      if (error || !inventory) {
        return false;
      }

      const newReserved = Math.max(0, (inventory.reserved_quantity || 0) - quantity);

      const { error: updateError } = await supabase
        .from("inventory")
        .update({
          reserved_quantity: newReserved,
        })
        .eq("product_id", productId);

      if (updateError) {
        return false;
      }

      return true;
    } catch {
      return false;
    }
  }, []);

  // Deduct from actual quantity (call when payment confirmed)
  const confirmStockDeduction = useCallback(async (productId: string, quantity: number): Promise<boolean> => {
    try {
      const { data: inventory, error } = await supabase
        .from("inventory")
        .select("quantity, reserved_quantity")
        .eq("product_id", productId)
        .single();

      if (error || !inventory) {
        return false;
      }

      const newQuantity = inventory.quantity - quantity;
      const newReserved = Math.max(0, (inventory.reserved_quantity || 0) - quantity);

      const { error: updateError } = await supabase
        .from("inventory")
        .update({
          quantity: newQuantity,
          reserved_quantity: newReserved,
        })
        .eq("product_id", productId);

      if (updateError) {
        console.error("Confirm stock error:", updateError);
        return false;
      }

      return true;
    } catch {
      return false;
    }
  }, []);

  return {
    products,
    loading,
    error,
    refresh: fetchProducts,
    getProduct,
    getProductsByCategory,
    checkAndReserveStock,
    reserveStock,
    releaseStock,
    confirmStockDeduction,
  };
}