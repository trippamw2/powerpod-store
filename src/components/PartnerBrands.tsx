import { motion } from "framer-motion";
import { Link } from "react-router-dom";

interface Brand {
  id: string;
  name: string;
  color: string;
  website: string;
}

const BRANDS: Brand[] = [
  {
    id: "samsung",
    name: "Samsung",
    color: "#1428A0",
    website: "https://www.samsung.com",
  },
  {
    id: "baseus",
    name: "Baseus",
    color: "#374151",
    website: "https://www.baseus.com",
  },
  {
    id: "oraimo",
    name: "Oraimo",
    color: "#F97316",
    website: "https://oraimo.com",
  },
  {
    id: "xiaomi",
    name: "Xiaomi",
    color: "#FF6700",
    website: "https://www.xiaomi.com",
  },
  {
    id: "anker",
    name: "Anker",
    color: "#00B0F0",
    website: "https://www.anker.com",
  },
  {
    id: "ugreen",
    name: "UGREEN",
    color: "#10B981",
    website: "https://ugreen.com",
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
              <span 
                className="text-2xl md:text-3xl font-bold"
                style={{ color: brand.color }}
              >
                {brand.name}
              </span>
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