import earbuds from "@/assets/product-earbuds.jpg";
import headphones from "@/assets/product-headphones.jpg";
import speaker from "@/assets/product-speaker.jpg";
import charger from "@/assets/product-charger.jpg";
import powerbank from "@/assets/product-powerbank.jpg";
import cable from "@/assets/product-cable.jpg";

export type Category = "audio" | "chargers" | "powerbanks" | "cables";

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
  types: ProductType[];
}

export const categories: { id: Category | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "audio", label: "Audio" },
  { id: "chargers", label: "Chargers" },
  { id: "powerbanks", label: "Power Banks" },
  { id: "cables", label: "Cables" },
];

export const products: Product[] = [
  { id: "p1", name: "PowerPods Wireless", benefit: "True wireless freedom. Crystal clear calls.", price: 35000, category: "audio", image: earbuds, types: [{ id: "t1", name: "Black" }, { id: "t2", name: "White" }] },
  { id: "p2", name: "Studio Headphones", benefit: "Deep bass. All-day comfort.", price: 75000, category: "audio", image: headphones, types: [{ id: "t1", name: "Black" }, { id: "t2", name: "Matte Black" }] },
  { id: "p3", name: "Vibe Speaker", benefit: "Big sound. Compact size. Take the vibe with you.", price: 45000, category: "audio", image: speaker, types: [{ id: "t1", name: "Black" }, { id: "t2", name: "Blue" }] },
  { id: "p4", name: "Fast Charger 25W", benefit: "Charge in minutes. Go for hours.", price: 12000, category: "chargers", image: charger, types: [{ id: "t1", name: "C to C" }, { id: "t2", name: "C to USB" }] },
  { id: "p4b", name: "Fast Charger 25W", benefit: "Charge in minutes. Go for hours.", price: 12000, category: "chargers", image: charger, types: [{ id: "t1", name: "B to USB" }, { id: "t2", name: "iPhone Type" }] },
  { id: "p5", name: "Power Bank 20K", benefit: "Power that lasts as long as you do.", price: 28000, category: "powerbanks", image: powerbank, types: [{ id: "t1", name: "Black" }, { id: "t2", name: "White" }] },
  { id: "p6", name: "Braided USB-C Cable", benefit: "Built to last. Made to move.", price: 6500, category: "cables", image: cable, types: [{ id: "t1", name: "1m" }, { id: "t2", name: "2m" }] },
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
  {
    id: "c1",
    name: "Starter Pack",
    tagline: "Keep going all day.",
    description: "The basics to stay charged and connected.",
    price: 18000,
    saving: 4000,
    items: ["Fast Charger 25W", "Braided USB-C Cable"],
    vibe: "Start right.",
  },
  {
    id: "c2",
    name: "Daily Vibe",
    tagline: "Your everyday setup.",
    description: "Power and sound for your daily grind.",
    price: 58000,
    saving: 9000,
    items: ["Power Bank 20K", "PowerPods Wireless", "USB-C Cable"],
    vibe: "Stay wired.",
  },
  {
    id: "c3",
    name: "Weekend Ready",
    tagline: "For the sessions.",
    description: "Sound sorted for party and study.",
    price: 105000,
    saving: 15000,
    items: ["Studio Headphones", "Vibe Speaker", "Fast Charger"],
    vibe: "Loud and ready.",
  },
  {
    id: "c4",
    name: "Full Setup",
    tagline: "Everything covered.",
    description: "The complete package for your vibe.",
    price: 175000,
    saving: 28000,
    items: ["Studio Headphones", "PowerPods Wireless", "Vibe Speaker", "Power Bank 20K", "Fast Charger", "USB-C Cable"],
    vibe: "All in.",
  },
];

// Map combo item labels to a representative product image.
const itemImageMap: Record<string, string> = {
  "PowerPods Wireless": earbuds,
  "Studio Headphones": headphones,
  "Vibe Speaker": speaker,
  "Fast Charger 25W": charger,
  "Fast Charger": charger,
  "Power Bank 20K": powerbank,
  "Braided USB-C Cable": cable,
  "USB-C Cable": cable,
};

export const getItemImage = (name: string): string => itemImageMap[name] ?? cable;

export const formatMWK = (n: number) => `MK ${n.toLocaleString("en-US")}`;
