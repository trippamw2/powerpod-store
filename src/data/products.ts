import earbuds from "@/assets/product-earbuds.jpg";
import headphones from "@/assets/product-headphones.jpg";
import speaker from "@/assets/product-speaker.jpg";
import charger from "@/assets/product-charger.jpg";
import powerbank from "@/assets/product-powerbank.jpg";
import cable from "@/assets/product-cable.jpg";

export type Category = "all" | "power-wired" | "power-wireless" | "power-adapters" | "power-banks" | "cables" | "car-chargers" | "speakers" | "headphones" | "headsets" | "earbuds";

export interface ProductType {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  benefit: string;
  price: number;
  category: Category;
  image: string;
  brand?: string;
  types: ProductType[];
  stock?: number;
  is_featured?: boolean;
  is_best_seller?: boolean;
  is_on_sale?: boolean;
  discount_percent?: number;
  gallery_images?: string[];
  specs?: Record<string, string>;
  reward_points?: number;
  rating?: number;
}

export const BRANDS = [
  { id: "samsung", name: "Samsung", color: "#1428A0" },
  { id: "baseus", name: "Baseus", color: "#E60012" },
  { id: "oraimo", name: "Oraimo", color: "#FF6B00" },
  { id: "oale", name: "Oale", color: "#FF0000" },
  { id: "xiaomi", name: "Xiaomi", color: "#FF6700" },
  { id: "anker", name: "Anker", color: "#00B0F0" },
  { id: "ugreen", name: "UGREEN", color: "#10B981" },
  { id: "apple", name: "Apple", color: "#555555" },
  { id: "huawei", name: "Huawei", color: "#CF0A2C" },
  { id: "oppo", name: "OPPO", color: "#00B5AD" },
  { id: "vivo", name: "Vivo", color: "#415FFF" },
  { id: "realme", name: "realme", color: "#FFB700" },
  { id: "infinix", name: "Infinix", color: "#E83E35" },
  { id: "tecno", name: "Tecno", color: "#0D8AE5" },
  { id: "itel", name: "Itel", color: "#00A0E9" },
  { id: "generic", name: "Generic", color: "#888888" },
] as const;

export const categoryGroups = {
  power: {
    label: "Power",
    description: "Chargers, adapters, power banks, car chargers & cables",
    categories: ["power-wired", "power-wireless", "power-adapters", "power-banks", "car-chargers", "cables"] as Category[],
  },
  audio: {
    label: "Audio",
    description: "Speakers, headphones, headsets & earbuds",
    categories: ["speakers", "headphones", "headsets", "earbuds"] as Category[],
  },
};

export const categories: { id: Category; label: string; parent?: string }[] = [
  { id: "all", label: "All Products" },
  { id: "power-wired", label: "Wired Chargers", parent: "Power" },
  { id: "power-wireless", label: "Wireless Chargers", parent: "Power" },
  { id: "power-adapters", label: "Adapters", parent: "Power" },
  { id: "power-banks", label: "Power Banks", parent: "Power" },
  { id: "car-chargers", label: "Car Chargers", parent: "Power" },
  { id: "cables", label: "Cables", parent: "Power" },
  { id: "speakers", label: "Speakers", parent: "Audio" },
  { id: "headphones", label: "Headphones", parent: "Audio" },
  { id: "headsets", label: "Headsets", parent: "Audio" },
  { id: "earbuds", label: "Earbuds", parent: "Audio" },
];

export const products: Product[] = [
  // POWER - Wired Chargers
  { id: "p1-wired", name: "USB-C Fast Charger 25W", benefit: "Quick charge any device. Built-in safety.", price: 12000, category: "power-wired", image: charger, brand: "Anker", types: [{ id: "t1", name: "USB-C to USB-C" }, { id: "t2", name: "USB-C to USB-A" }] },
  { id: "p2-wired", name: "Dual USB Charger 30W", benefit: "Charge two devices at once.", price: 15000, category: "power-wired", image: charger, brand: "Anker", types: [{ id: "t1", name: "2x USB-C" }, { id: "t2", name: "USB-C + USB-A" }] },
  
  // POWER - Wireless Chargers
  { id: "p1-wireless", name: "Wireless Charging Pad 15W", benefit: "Simply place and charge. No cables needed.", price: 18000, category: "power-wireless", image: charger, brand: "Samsung", types: [{ id: "t1", name: "Black" }, { id: "t2", name: "White" }] },
  { id: "p2-wireless", name: "Wireless Power Stand", benefit: "Charge & watch. Perfect for desk.", price: 22000, category: "power-wireless", image: charger, brand: "Samsung", types: [{ id: "t1", name: "Black" }] },
  
  // POWER - Adapters
  { id: "p1-adapter", name: "USB-C Hub 7-in-1", benefit: "Connect everything. HDMI, USB, SD card.", price: 35000, category: "power-adapters", image: charger, brand: "UGREEN", types: [{ id: "t1", name: "Silver" }, { id: "t2", name: "Space Gray" }] },
  { id: "p2-adapter", name: "Car Charger 45W", benefit: "Fast charge on the go.", price: 8500, category: "power-adapters", image: charger, brand: "Baseus", types: [{ id: "t1", name: "Single Port" }, { id: "t2", name: "Dual Port" }] },
  
  // POWER - Power Banks
  { id: "p1-powerbank", name: "Power Bank 10000mAh", benefit: "Your backup power. Slim design.", price: 22000, category: "power-banks", image: powerbank, brand: "Oraimo", types: [{ id: "t1", name: "Black" }, { id: "t2", name: "White" }] },
  { id: "p2-powerbank", name: "Power Bank 20000mAh", benefit: "Power that lasts as long as you do.", price: 28000, category: "power-banks", image: powerbank, brand: "Oraimo", types: [{ id: "t1", name: "Black" }, { id: "t2", name: "White" }] },
  { id: "p3-powerbank", name: "Power Bank 26800mAh", benefit: "Ultra high capacity. Charge 3 devices.", price: 45000, category: "power-banks", image: powerbank, brand: "Oraimo", types: [{ id: "t1", name: "Black" }] },
  
  // POWER - Car Chargers
  { id: "p1-carcharger", name: "Dual Port Car Charger 45W", benefit: "Fast charge while driving. USB-C + USB-A.", price: 8500, category: "car-chargers", image: charger, brand: "Baseus", types: [{ id: "t1", name: "Single Port" }, { id: "t2", name: "Dual Port" }], stock: 25 },
  { id: "p2-carcharger", name: "Quick Charge Car Charger", benefit: "Quick charge 3 devices at once.", price: 12000, category: "car-chargers", image: charger, brand: "Anker", types: [{ id: "t1", name: "Black" }], stock: 15 },
  { id: "p3-carcharger", name: "Magnetic Car Charger", benefit: "Snap and charge. Wireless.", price: 15000, category: "car-chargers", image: charger, brand: "Samsung", types: [{ id: "t1", name: "Black" }], stock: 10 },
   
  // POWER - Cables
  { id: "p1-cable", name: "Braided USB-C Cable 1m", benefit: "Built to last. Fast charging.", price: 6500, category: "cables", image: cable, brand: "Baseus", types: [{ id: "t1", name: "Black" }, { id: "t2", name: "White" }], stock: 50 },
  { id: "p2-cable", name: "Braided USB-C Cable 2m", benefit: "Extra length. Same durability.", price: 8500, category: "cables", image: cable, brand: "Baseus", types: [{ id: "t1", name: "Black" }, { id: "t2", name: "White" }], stock: 40 },
  { id: "p3-cable", name: "USB-C to Lightning Cable", benefit: "Fast charge iPhone. MFi certified.", price: 12000, category: "cables", image: cable, brand: "Baseus", types: [{ id: "t1", name: "1m" }, { id: "t2", name: "2m" }], stock: 30 },
   
  // AUDIO - Speakers
  { id: "p1-speaker", name: "Vibe Mini Speaker", benefit: "Big sound. Pocket size.", price: 15000, category: "speakers", image: speaker, brand: "Xiaomi", types: [{ id: "t1", name: "Black" }, { id: "t2", name: "Blue" }] },
  { id: "p2-speaker", name: "Vibe Speaker", benefit: "Big sound. Take the vibe with you.", price: 35000, category: "speakers", image: speaker, brand: "Xiaomi", types: [{ id: "t1", name: "Black" }, { id: "t2", name: "Blue" }] },
  { id: "p3-speaker", name: "Vibe Pro Speaker", benefit: "360° sound. Party ready.", price: 55000, category: "speakers", image: speaker, brand: "Xiaomi", types: [{ id: "t1", name: "Black" }] },
   
// AUDIO - Headphones
  { id: "p1-headphones", name: "Studio Headphones", benefit: "Deep bass. All-day comfort.", price: 55000, category: "headphones", image: headphones, brand: "Xiaomi", types: [{ id: "t1", name: "Black" }, { id: "t2", name: "Matte Black" }] },
  { id: "p2-headphones", name: "Studio Pro Headphones", benefit: "Active noise cancelling. Premium sound.", price: 85000, category: "headphones", image: headphones, brand: "Xiaomi", types: [{ id: "t1", name: "Black" }] },
    
  // AUDIO - Headsets
  { id: "p1-headsets", name: "Gaming Headset Pro", benefit: "Immersive sound. Clear mic. RGB lights.", price: 65000, category: "headsets", image: headphones, brand: "Oraimo", types: [{ id: "t1", name: "Black" }, { id: "t2", name: "White" }] },
  { id: "p2-headsets", name: "Office Headset", benefit: "Conference ready. Noise cancelling mic.", price: 45000, category: "headsets", image: headphones, brand: "Oraimo", types: [{ id: "t1", name: "Black" }] },
    
  // AUDIO - Earbuds
  { id: "p1-earbuds", name: "PowerPods Basic", benefit: "True wireless. Crystal clear calls.", price: 25000, category: "earbuds", image: earbuds, brand: "Huawei", types: [{ id: "t1", name: "Black" }, { id: "t2", name: "White" }] },
  { id: "p2-earbuds", name: "PowerPods Wireless", benefit: "True wireless freedom. Better battery.", price: 35000, category: "earbuds", image: earbuds, brand: "Huawei", types: [{ id: "t1", name: "Black" }, { id: "t2", name: "White" }] },
  { id: "p3-earbuds", name: "PowerPods Pro", benefit: "ANC. Premium sound. Touch controls.", price: 55000, category: "earbuds", image: earbuds, brand: "Huawei", types: [{ id: "t1", name: "Black" }] },
];

export interface Combo {
  id: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  saving: number;
  items: string[];
  vibe: string;
}

export const combos: Combo[] = [
  { id: "c1", name: "Starter Pack", tagline: "Keep going all day.", description: "The basics to stay charged and connected.", price: 18000, saving: 4000, items: ["USB-C Fast Charger 25W", "Braided USB-C Cable 1m"], vibe: "Start right." },
  { id: "c2", name: "Daily Vibe", tagline: "Your everyday setup.", description: "Power and sound for your daily grind.", price: 58000, saving: 9000, items: ["Power Bank 10000mAh", "PowerPods Wireless", "Braided USB-C Cable 1m"], vibe: "Stay wired." },
  { id: "c3", name: "Weekend Ready", tagline: "For the sessions.", description: "Sound sorted for party and study.", price: 95000, saving: 15000, items: ["Studio Headphones", "Vibe Speaker", "USB-C Fast Charger 25W"], vibe: "Loud and ready." },
  { id: "c4", name: "Full Setup", tagline: "Everything covered.", description: "The complete package for your vibe.", price: 165000, saving: 28000, items: ["Studio Headphones", "PowerPods Wireless", "Vibe Speaker", "Power Bank 20000mAh", "USB-C Fast Charger 25W", "Braided USB-C Cable 2m"], vibe: "All in." },
];

const itemImageMap: Record<string, string> = {
  "PowerPods Wireless": earbuds, "PowerPods Basic": earbuds, "PowerPods Pro": earbuds,
  "Studio Headphones": headphones, "Studio Pro Headphones": headphones,
  "Vibe Speaker": speaker, "Vibe Mini Speaker": speaker, "Vibe Pro Speaker": speaker,
  "USB-C Fast Charger 25W": charger, "Dual USB Charger 30W": charger,
  "Wireless Charging Pad 15W": charger, "Wireless Power Stand": charger,
  "USB-C Hub 7-in-1": charger, "Car Charger 45W": charger,
  "Power Bank 10000mAh": powerbank, "Power Bank 20000mAh": powerbank, "Power Bank 26800mAh": powerbank,
  "Braided USB-C Cable 1m": cable, "Braided USB-C Cable 2m": cable, "USB-C to Lightning Cable": cable,
};

export const getItemImage = (name: string): string => itemImageMap[name] ?? cable;

export const formatMWK = (n: number) => `MK ${n.toLocaleString("en-US")}`;

export const getRecommendations = (product: Product, allProducts: Product[], limit = 4): Product[] => {
  const price = product.price;
  const priceMin = price * 0.7;
  const priceMax = price * 1.3;
  
  const scored = allProducts
    .filter(p => p.id !== product.id)
    .map(p => {
      let score = 0;
      
      if (p.brand === product.brand) score += 100;
      
      if (p.price >= priceMin && p.price <= priceMax) score += 50;
      
      if (p.category === product.category) score += 30;
      
      const comboMatch = combos.some(c => 
        c.items.some(i => i === product.name || i.includes(product.name) || product.name.includes(i)) &&
        c.items.some(i => i === p.name || i.includes(p.name) || p.name.includes(i))
      );
      if (comboMatch) score += 20;
      
      return { product: p, score };
    })
    .sort((a, b) => b.score - a.score);
  
  return scored.slice(0, limit).map(s => s.product);
};