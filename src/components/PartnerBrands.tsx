import { motion } from "framer-motion";
import { Link } from "react-router-dom";

interface Brand {
  id: string;
  name: string;
  logo: string;
  website: string;
}

const BRANDS: Brand[] = [
  {
    id: "samsung",
    name: "Samsung",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/2c/Samsung_wordmark.svg",
    website: "https://www.samsung.com",
  },
  {
    id: "baseus",
    name: "Baseus",
    logo: "https://upload.wikimedia.org/wikipedia/commons/8/85/Baseus-logo.svg",
    website: "https://www.baseus.com",
  },
  {
    id: "oraimo",
    name: "Oraimo",
    logo: "https://oraimo.com/_next/static/media/logo-black.ed0a3073.svg",
    website: "https://oraimo.com",
  },
  {
    id: "xiaomi",
    name: "Xiaomi",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/23/Xiaomi_logo_%282021%29.svg",
    website: "https://www.xiaomi.com",
  },
  {
    id: "anker",
    name: "Anker",
    logo: "https://upload.wikimedia.org/wikipedia/commons/8/86/Anker_Innovations_logo.svg",
    website: "https://www.anker.com",
  },
  {
    id: "ugreen",
    name: "UGREEN",
    logo: "https://ugreen.com/cdn/shop/files/2024_02_UGREEN_new_logo.png",
    website: "https://ugreen.com",
  },
];

export const PartnerBrands = ({ className }: { className?: string }) => {
  return (
    <section className={`py-12 bg-gray-50 ${className}`}>
      <div className="container">
        <div className="text-center mb-10">
          <p className="text-sm font-semibold text-gradient uppercase tracking-widest">Trusted Brands</p>
          <h2 className="font-display font-bold text-2xl sm:text-3xl mt-1">PowerPod Partners</h2>
          <p className="text-muted-foreground mt-2">Genuine products from world-class brands</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
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
              className="flex items-center justify-center p-4 bg-white rounded-xl border border-gray-100 hover:border-orange-200 hover:shadow-md transition-all group"
            >
              <img
                src={brand.logo}
                alt={brand.name}
                className="h-10 w-auto object-contain grayscale group-hover:grayscale-0 transition-all opacity-70 group-hover:opacity-100"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
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