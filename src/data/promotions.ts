export interface Promotion {
  id: string;
  title: string;
  subtitle: string;
  description?: string;
  image: string;
  link: string;
  link_text: string;
  background_color: string;
  text_color: string;
  is_active: boolean;
  is_featured: boolean;
  sort_order: number;
  pages: string[]; // ["home", "shop", "combos"]
  created_at: string;
}

export const mockPromotions: Promotion[] = [
  {
    id: "promo-1",
    title: "Free Delivery",
    subtitle: "On all orders over MK 20,000",
    description: "No matter where you are in Malawi",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200",
    link: "/shop",
    link_text: "Shop Now",
    background_color: "from-orange-500 to-pink-500",
    text_color: "text-white",
    is_active: true,
    is_featured: true,
    sort_order: 1,
    pages: ["home", "shop"],
    created_at: new Date().toISOString(),
  },
  {
    id: "promo-2",
    title: "PowerPods Pro",
    subtitle: "Now Available",
    description: "Premium earbuds with ANC",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=1200",
    link: "/product/p3-earbuds",
    link_text: "View Product",
    background_color: "from-purple-500 to-indigo-500",
    text_color: "text-white",
    is_active: true,
    is_featured: true,
    sort_order: 2,
    pages: ["home"],
    created_at: new Date().toISOString(),
  },
  {
    id: "promo-3",
    title: "Starter Pack",
    subtitle: "Save MK 4,000",
    description: "Charger + Cable bundle",
    image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=1200",
    link: "/combos",
    link_text: "View Bundle",
    background_color: "from-green-500 to-teal-500",
    text_color: "text-white",
    is_active: true,
    is_featured: true,
    sort_order: 3,
    pages: ["combos", "home"],
    created_at: new Date().toISOString(),
  },
];