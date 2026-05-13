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
  { id: "oale", name: "OALE", color: "#FF0000" },
] as const;

export const categoryGroups = {
  power: {
    label: "Power",
    description: "Power banks & car chargers",
    categories: ["power-banks", "car-chargers"] as Category[],
  },
  audio: {
    label: "Audio",
    description: "Speakers, headphones, headsets & earbuds",
    categories: ["speakers", "headphones", "headsets", "earbuds"] as Category[],
  },
};

export const categories: { id: Category; label: string; parent?: string }[] = [
  { id: "all", label: "All Products" },
  { id: "power-banks", label: "Power Banks", parent: "Power" },
  { id: "car-chargers", label: "Car Chargers", parent: "Power" },
  { id: "speakers", label: "Speakers", parent: "Audio" },
  { id: "headphones", label: "Headphones", parent: "Audio" },
  { id: "headsets", label: "Headsets", parent: "Audio" },
  { id: "earbuds", label: "Earbuds", parent: "Audio" },
];

export const products: Product[] = [
  // POWER BANKS
  { id: "7a1a35d4-d07b-43e3-b20d-130bb8567f1d", name: "iPower Nano2 5000mAh Power Bank", benefit: "Compact power bank with 22.5W fast charge. Built-in cables. Digital display.", price: 43500, category: "power-banks", image: "https://oalemobile.com/wp-content/uploads/2026/02/Nano2%E9%BB%91%E8%89%B2.png", brand: "oale", types: [{id:"black",name:"Black"}], stock: 7, is_featured: true },
  { id: "708ba860-25c2-4040-8792-0b8d867c6a22", name: "iPower iMagSafe2 10000mAh Magnetic Power Bank", benefit: "Magnetic wireless charging. 22.5W fast charge. Built-in cable.", price: 95700, category: "power-banks", image: "https://oalemobile.com/wp-content/uploads/2026/02/iMagsafe2%E9%93%B6%E8%89%B2.png", brand: "oale", types: [{id:"silver",name:"Silver"}], stock: 0, is_best_seller: true },
  { id: "dcdeb960-53b0-4df5-9ba0-44d0da255fca", name: "iPower U2000 20000mAh Power Bank", benefit: "22.5W fast charge. Built-in 4 cables. Hand strap. Travel ready.", price: 69500, category: "power-banks", image: "https://oalemobile.com/wp-content/uploads/2026/02/U20000%E9%BB%91%E8%89%B2.png", brand: "oale", types: [{id:"black",name:"Black"}], stock: 5, is_best_seller: true },
  { id: "adfdf2f1-7b98-44f8-9404-789e561f2e07", name: "iPower 300 20000mAh Power Bank", benefit: "22.5W super fast charge. Strong LED light. Multi-port.", price: 65700, category: "power-banks", image: "https://oalemobile.com/wp-content/uploads/2026/02/iPower-300-%E9%BB%91%E8%89%B2.png", brand: "oale", types: [{id:"black",name:"Black"}], stock: 6 },
  { id: "236765c3-bd24-4aab-a0a4-165fafc5e9cd", name: "iPower 500 20000mAh Solar Power Bank", benefit: "Solar charging. Built-in 4 cables. LED light. Outdoor ready.", price: 63500, category: "power-banks", image: "https://oalemobile.com/wp-content/uploads/2026/02/iPower-500%E9%BB%91%E8%89%B2.png", brand: "oale", types: [{id:"black",name:"Black"}], stock: 4 },
  { id: "0e4ac031-1243-4577-a114-21fe0c58f7be", name: "iPower Y40000 40000mAh Power Bank", benefit: "Ultra high capacity. 22.5W fast charge. LED light. Digital display.", price: 113100, category: "power-banks", image: "https://oalemobile.com/wp-content/uploads/2026/02/Y40000%E9%BB%91%E8%89%B2.png", brand: "oale", types: [{id:"black",name:"Black"}], stock: 5 },
  
  // CAR CHARGERS
  { id: "1119152f-1231-478d-9e20-ddd61c8321e3", name: "3A Fast USB Car Charger", benefit: "Compact metallic charger. 3A fast charge. Single USB-A port.", price: 13700, category: "car-chargers", image: "https://oalemobile.com/wp-content/uploads/2026/02/iCar-3%E9%94%96%E8%89%B2-2.png", brand: "oale", types: [{id:"silvermetallic",name:"Silver metallic"}], stock: 10 },
  { id: "3af8c577-1ad8-4804-8577-06b5f86a8ca6", name: "iCar 4 30W Car Charger", benefit: "30W output. 360° rotation. USB-C fast charging.", price: 50700, category: "car-chargers", image: "https://oalemobile.com/wp-content/uploads/2026/02/iCar-4%E9%BB%91%E8%89%B2.png", brand: "oale", types: [{id:"black",name:"Black"}], stock: 7 },
  
  // EARBUDS
  { id: "c664496e-7782-4843-a7b5-692e72c448a7", name: "OALE iFree 9 Earbuds", benefit: "Bluetooth 5.3. ENC. 40H battery. Touch control. Great value.", price: 43500, category: "earbuds", image: "https://oalemobile.com/wp-content/uploads/2026/03/iFree-9.png", brand: "oale", types: [{id:"black",name:"Black"}], stock: 15, is_featured: true },
  { id: "f02a9d0c-d708-4981-81e7-eebfec3243dd", name: "OALE iFree 14 Earbuds", benefit: "35H playtime. ENC. Bluetooth 5.4. Neck-hanging chain included.", price: 52000, category: "earbuds", image: "https://oalemobile.com/wp-content/uploads/2026/03/iFree-14-green.png", brand: "oale", types: [{id:"white",name:"White"}], stock: 15, is_featured: true },
  { id: "7dfa789a-9b32-4d77-91f7-c62a29630f33", name: "OALE iFree 18 Earbuds", benefit: "Bluetooth 6.0. Deep bass. LED light. Siri support.", price: 52200, category: "earbuds", image: "https://oalemobile.com/wp-content/uploads/2026/03/iFree-18-black.png", brand: "oale", types: [{id:"blackonlyavailable",name:"Black only Available"}], stock: 7 },
  { id: "2de9b104-554f-41b5-b033-fd16468a1717", name: "OALE iFree 19 Open-Ear Earbuds", benefit: "Open-ear clip design. 45H playtime. ENC. Comfortable fit.", price: 54375, category: "earbuds", image: "https://oalemobile.com/wp-content/uploads/2026/03/iFree-19black.png", brand: "oale", types: [{id:"black",name:"Black"}], stock: 15, is_featured: true },
  { id: "ffb8375d-58af-47c3-b620-53faaca648c8", name: "iFree 13 TWS Earbuds", benefit: "Dual-track stereo. 35H playtime. Bluetooth 6.0. Water-resistant.", price: 69600, category: "earbuds", image: "https://oalemobile.com/wp-content/uploads/2026/03/iFree-13.png", brand: "oale", types: [{id:"black",name:"Black"}], stock: 15, is_featured: true },
  { id: "e6172c74-ed24-4283-8535-8409984a78b4", name: "iFree 12 Gaming Earbuds", benefit: "Low latency. 4-mic ENC. 30H playtime. LED lights.", price: 65250, category: "earbuds", image: "https://oalemobile.com/wp-content/uploads/2026/03/iFree-12-grey.png", brand: "oale", types: [{id:"black",name:"Black"}], stock: 15, is_featured: true },
  
  // HEADPHONES
  { id: "b87e6dcc-9763-490f-89bf-63634c8f8287", name: "Hug 3 ANC Headphones", benefit: "Active noise cancelling. Bluetooth 5.4. 50H playtime. TF/AUX.", price: 64000, category: "headphones", image: "https://oalemobile.com/wp-content/uploads/2026/02/Hug-3-ANC%E9%BB%91%E8%89%B2-%E5%8E%8B%E7%BC%A9.png", brand: "oale", types: [{id:"black",name:"Black"}], stock: 3 },
  { id: "fbaf67c9-f4bf-445a-ab24-a12f3a4cad3f", name: "iAir Max Headphones", benefit: "Bluetooth 5.3. 12H playtime. Smart carrying case. TF card.", price: 75000, category: "headphones", image: "https://oalemobile.com/wp-content/uploads/2026/02/iAir-Max%E9%BB%84%E8%89%B2.png", brand: "oale", types: [{id:"white",name:"White"}], stock: 4, is_featured: true },
  { id: "158788a0-9355-4906-af60-663f872362cc", name: "iPop 4 Foldable Headphones", benefit: "Foldable design. ENC. TF/AUX. 8H talk time. Portable.", price: 66000, category: "headphones", image: "https://oalemobile.com/wp-content/uploads/2026/02/iPOP-4-1.png", brand: "oale", types: [{id:"black",name:"Black"}], stock: 3 },
  
  // HEADSETS
  { id: "de9a862c-1579-4704-b56a-0550ac709319", name: "iRock 05 Magnetic Neckband", benefit: "Magnetic earbuds. Bluetooth 5.4. 30H battery. TF card. ENC.", price: 23900, category: "headsets", image: "https://oalemobile.com/wp-content/uploads/2026/02/iRock-05%E9%BB%91%E8%89%B2.png", brand: "oale", types: [{id:"black",name:"Black"}], stock: 5 },
  { id: "878de673-0a2a-4fc2-aeb8-1394deead5a5", name: "OALE iRock 06 Sport Headset", benefit: "Sport neckband. Bluetooth 5.4. 30H playback. Magnetic earbuds.", price: 23925, category: "headsets", image: "https://oalemobile.com/wp-content/uploads/2026/03/iRock-06-yellow.png", brand: "oale", types: [{id:"black",name:"Black"}], stock: 5 },
  { id: "5bd858a8-314d-48e3-9f63-7a029fd4793d", name: "OALE iRock 4 Neckband", benefit: "ENC. SD card support. 21H battery. Flashlight. Magnetic.", price: 27550, category: "headsets", image: "https://oalemobile.com/wp-content/uploads/2026/02/iRock-04-%E7%81%B0%E8%89%B2.png", brand: "oale", types: [{id:"black",name:"Black"}], stock: 8, is_best_seller: true },
  
  // SPEAKERS
  { id: "1401136d-77d6-4a48-8383-08e8936d0940", name: "iBuzz 80 Waterproof Speaker", benefit: "IPX7 waterproof. RGB lights. BT 5.3. 5W sound. 1200mAh.", price: 47000, category: "speakers", image: "https://oalemobile.com/wp-content/uploads/2026/02/iBazz80%E8%93%9D%E8%89%B2.png", brand: "oale", types: [{id:"black",name:"Black"}], stock: 5 },
  { id: "981f1343-7258-4388-b4eb-e891d956eb60", name: "OALE iStudio 500 Speaker", benefit: "15W powerful sound. IPX6 waterproof. RGB. BT 5.3. 2400mAh.", price: 108500, category: "speakers", image: "https://oalemobile.com/wp-content/uploads/2026/02/iStudio-500.png", brand: "oale", types: [{id:"blackcolor",name:"Black Color"}], stock: 10, is_featured: true, is_best_seller: true },
];

export interface Kit {
  id: string;
  name: string;
  hook: string;
  lifestyle: "student" | "work" | "travel" | "audio" | "premium";
  tagline: string;
  description: string;
  discountPercent: number;
  productIds: string[];
  image: string;
  vibe: string;
  badge?: string;
  stock?: number;
}

export const kits: Kit[] = [
  {
    id: "k1",
    name: "Daily Essential Kit",
    hook: "Power and sound. Day one.",
    lifestyle: "student",
    tagline: "Power bank and earbuds. Everyday carry.",
    description: "Compact power bank with built-in cables plus wireless earbuds. Your phone stays charged. Your music plays.",
    discountPercent: 15,
    productIds: ["7a1a35d4-d07b-43e3-b20d-130bb8567f1d", "c664496e-7782-4843-a7b5-692e72c448a7"],
    image: "https://oalemobile.com/wp-content/uploads/2026/02/Nano2%E9%BB%91%E8%89%B2.png",
    vibe: "Never run out of power.",
    badge: "Best for Students",
    stock: 12,
  },
  {
    id: "k2",
    name: "Power Pro Kit",
    hook: "Power bank, earbuds, car charger. Go.",
    lifestyle: "work",
    tagline: "Power and sound for your day.",
    description: "High capacity power bank, ENC earbuds for calls, and a car charger. For work, travel and meetings.",
    discountPercent: 15,
    productIds: ["dcdeb960-53b0-4df5-9ba0-44d0da255fca", "f02a9d0c-d708-4981-81e7-eebfec3243dd", "1119152f-1231-478d-9e20-ddd61c8321e3"],
    image: "https://oalemobile.com/wp-content/uploads/2026/02/U20000%E9%BB%91%E8%89%B2.png",
    vibe: "Professional. Powered. Ready.",
    badge: "Most Popular",
    stock: 8,
  },
  {
    id: "k3",
    name: "Sound Vibe Kit",
    hook: "Sound that moves with you.",
    lifestyle: "audio",
    tagline: "Headphones and speaker. Your audio.",
    description: "ANC headphones and a waterproof speaker. Deep bass anywhere you go.",
    discountPercent: 15,
    productIds: ["b87e6dcc-9763-490f-89bf-63634c8f8287", "1401136d-77d6-4a48-8383-08e8936d0940"],
    image: "https://oalemobile.com/wp-content/uploads/2026/02/Hug-3-ANC%E9%BB%91%E8%89%B2-%E5%8E%8B%E7%BC%A9.png",
    vibe: "Listen louder. Live better.",
    badge: "Best Value",
    stock: 6,
  },
  {
    id: "k4",
    name: "Complete Studio Kit",
    hook: "Power and sound. Everything.",
    lifestyle: "premium",
    tagline: "Full setup. No compromises.",
    description: "Power bank, earbuds, ANC headphones and a speaker. All you need for power and sound.",
    discountPercent: 15,
    productIds: ["adfdf2f1-7b98-44f8-9404-789e561f2e07", "f02a9d0c-d708-4981-81e7-eebfec3243dd", "b87e6dcc-9763-490f-89bf-63634c8f8287", "1401136d-77d6-4a48-8383-08e8936d0940"],
    image: "https://oalemobile.com/wp-content/uploads/2026/02/Hug-3-ANC%E9%BB%91%E8%89%B2-%E5%8E%8B%E7%BC%A9.png",
    vibe: "The full lifestyle upgrade.",
    badge: "Premium",
    stock: 3,
  },
];

export const combos: Kit[] = kits;

const itemImageMap: Record<string, string> = {
  "iPower Nano2 5000mAh Power Bank": "https://oalemobile.com/wp-content/uploads/2026/02/Nano2%E9%BB%91%E8%89%B2.png",
  "OALE iFree 9 Earbuds": "https://oalemobile.com/wp-content/uploads/2026/03/iFree-9.png",
  "iPower U2000 20000mAh Power Bank": "https://oalemobile.com/wp-content/uploads/2026/02/U20000%E9%BB%91%E8%89%B2.png",
  "OALE iFree 14 Earbuds": "https://oalemobile.com/wp-content/uploads/2026/03/iFree-14-green.png",
  "3A Fast USB Car Charger": "https://oalemobile.com/wp-content/uploads/2026/02/iCar-3%E9%94%96%E8%89%B2-2.png",
  "Hug 3 ANC Headphones": "https://oalemobile.com/wp-content/uploads/2026/02/Hug-3-ANC%E9%BB%91%E8%89%B2-%E5%8E%8B%E7%BC%A9.png",
  "iBuzz 80 Waterproof Speaker": "https://oalemobile.com/wp-content/uploads/2026/02/iBazz80%E8%93%9D%E8%89%B2.png",
  "iPower 300 20000mAh Power Bank": "https://oalemobile.com/wp-content/uploads/2026/02/iPower-300-%E9%BB%91%E8%89%B2.png",
};

export const getItemImage = (nameOrId: string): string => {
  const byProduct = products.find(p => p.id === nameOrId || p.name === nameOrId);
  if (byProduct) return byProduct.image;
  return itemImageMap[nameOrId] ?? "https://oalemobile.com/wp-content/uploads/2026/02/Nano2%E9%BB%91%E8%89%B2.png";
};

export const formatMWK = (n: number) => `MK ${n.toLocaleString("en-US")}`;

export function getKitProducts(kit: Kit): Product[] {
  return kit.productIds.map(id => products.find(p => p.id === id)).filter((p): p is Product => p !== undefined);
}

export function getKitSeparateTotal(kit: Kit): number {
  return getKitProducts(kit).reduce((sum, p) => sum + p.price, 0);
}

export function getKitPrice(kit: Kit): number {
  const total = getKitSeparateTotal(kit);
  return Math.round(total * (1 - kit.discountPercent / 100));
}

export function getKitRealSaving(kit: Kit): number {
  return getKitSeparateTotal(kit) - getKitPrice(kit);
}

export function getKitDiscountPercent(kit: Kit): number {
  return kit.discountPercent;
}

export function getKitItemNames(kit: Kit): string[] {
  return getKitProducts(kit).map(p => p.name);
}

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
        c.productIds.some(pid => pid === product.id) &&
        c.productIds.some(pid => pid === p.id)
      );
      if (comboMatch) score += 20;
      
      return { product: p, score };
    })
    .sort((a, b) => b.score - a.score);
  
  return scored.slice(0, limit).map(s => s.product);
};
