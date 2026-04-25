import { motion } from "framer-motion";

interface Brand {
  id: string;
  name: string;
  color: string;
  website: string;
  icon: React.ReactNode;
}

const BRANDS: Brand[] = [
  {
    id: "samsung",
    name: "Samsung",
    color: "#1428A0",
    website: "https://www.samsung.com",
    icon: (
      <svg viewBox="0 0 50 50" className="h-10 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="50" height="50" fill="#1428A0"/>
        <path d="M25 10L15 40H19L22 32H28L31 40H35L25 10ZM23 28H27L25 20L23 28Z" fill="white"/>
      </svg>
    ),
  },
  {
    id: "baseus",
    name: "Baseus",
    color: "#E60012",
    website: "https://www.baseus.com",
    icon: (
      <svg viewBox="0 0 120 40" className="h-8 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
        <text x="10" y="28" fontFamily="Arial, sans-serif" fontSize="22" fontWeight="bold" fill="#E60012">Baseus</text>
      </svg>
    ),
  },
  {
    id: "oraimo",
    name: "Oraimo",
    color: "#FF6B00",
    website: "https://oraimo.com",
    icon: (
      <svg viewBox="0 0 100 40" className="h-8 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
        <text x="10" y="28" fontFamily="Arial, sans-serif" fontSize="20" fontWeight="bold" fill="#FF6B00">oraimo</text>
      </svg>
    ),
  },
  {
    id: "xiaomi",
    name: "Xiaomi",
    color: "#FF6700",
    website: "https://www.xiaomi.com",
    icon: (
      <svg viewBox="0 0 80 40" className="h-8 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="15" fill="#FF6700"/>
        <text x="15" y="26" fontFamily="Arial, sans-serif" fontSize="16" fontWeight="bold" fill="white">X</text>
        <text x="40" y="26" fontFamily="Arial, sans-serif" fontSize="14" fontWeight="bold" fill="#333">Xiaomi</text>
      </svg>
    ),
  },
  {
    id: "anker",
    name: "Anker",
    color: "#00B0F0",
    website: "https://www.anker.com",
    icon: (
      <svg viewBox="0 0 80 40" className="h-8 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
        <text x="10" y="28" fontFamily="Arial, sans-serif" fontSize="20" fontWeight="bold" fill="#00B0F0">Anker</text>
      </svg>
    ),
  },
  {
    id: "ugreen",
    name: "UGREEN",
    color: "#10B981",
    website: "https://ugreen.com",
    icon: (
      <svg viewBox="0 0 100 40" className="h-8 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
        <text x="10" y="28" fontFamily="Arial, sans-serif" fontSize="18" fontWeight="bold" fill="#10B981">UGREEN</text>
      </svg>
    ),
  },
];

export const PartnerBrands = ({ className }: { className?: string }) => {
  return (
    <section className={`py-12 bg-gray-50 ${className}`}>
      <div className="container">
        <div className="text-center mb-10">
          <p className="text-sm font-semibold text-orange-500 uppercase tracking-widest">Trusted Brands</p>
          <h2 className="font-display font-bold text-2xl sm:text-3xl mt-1">PowerPod Partners</h2>
          <p className="text-muted-foreground mt-2">Genuine products from world-class brands</p>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8">
          {BRANDS.map((brand, i) => (
            <motion.a
              key={brand.id}
              href={brand.website}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-2 group"
            >
              {brand.icon}
            </motion.a>
          ))}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8">
          Authorized reseller for all listed brands
        </p>
      </div>
    </section>
  );
};

export default PartnerBrands;