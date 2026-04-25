import { motion } from "framer-motion";
import oaleLogo from "@/assets/brand-oale.png";
import huaweiLogo from "@/assets/brand-huawei.png";
import oraimoLogo from "@/assets/brand-oraimo.png";
import xiaomiLogo from "@/assets/brand-xiaomi.png";

interface Brand {
  id: string;
  name: string;
  website: string;
  logo: string;
}

const BRANDS: Brand[] = [
  {
    id: "oale",
    name: "OALE",
    website: "https://oalemobile.com",
    logo: oaleLogo,
  },
  {
    id: "huawei",
    name: "HUAWEI",
    website: "https://www.huawei.com",
    logo: huaweiLogo,
  },
  {
    id: "oraimo",
    name: "ORAIMO",
    website: "https://oraimo.com",
    logo: oraimoLogo,
  },
  {
    id: "xiaomi",
    name: "XIAOMI",
    website: "https://www.xiaomi.com",
    logo: xiaomiLogo,
  },
];

export const PartnerBrands = ({ className }: { className?: string }) => {
  return (
    <section className={`py-12 bg-gray-50 ${className}`}>
      <div className="container">
        <div className="text-center mb-10">
          <p className="text-sm font-semibold text-teal-600 uppercase tracking-widest">Trusted Brands</p>
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
              <img 
                src={brand.logo} 
                alt={brand.name}
                className="h-12 md:h-16 w-auto object-contain grayscale group-hover:grayscale-0 transition-all"
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