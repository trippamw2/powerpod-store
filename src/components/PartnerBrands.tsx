import { motion } from "framer-motion";

interface Brand {
  id: string;
  name: string;
  color: string;
  website: string;
  logoUrl?: string;
}

const BRANDS: Brand[] = [
  {
    id: "oale",
    name: "OALE",
    color: "#1A1A1A",
    website: "https://oalemobile.com",
  },
  {
    id: "huawei",
    name: "HUAWEI",
    color: "#CF0A2C",
    website: "https://www.huawei.com",
  },
  {
    id: "oraimo",
    name: "ORAIMO",
    color: "#FF6B00",
    website: "https://oraimo.com",
  },
  {
    id: "xiaomi",
    name: "XIAOMI",
    color: "#FF6700",
    website: "https://www.xiaomi.com",
  },
];

export const PartnerBrands = ({ className }: { className?: string }) => {
  return (
    <section className={`py-12 bg-gray-50 ${className}`}>
      <div className="container">
        <div className="text-center mb-10">
          <p className="text-sm font-semibold text-orange-500 uppercase tracking-widest">Trusted Brands</p>
          <h2 className="font-display font-bold text-2xl sm:text-3xl mt-1">PowerPod Partners</h2>
          <p className="text-muted-foreground mt-2">Genuine products from trusted brands</p>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
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
                className="text-2xl md:text-3xl font-bold tracking-wider"
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