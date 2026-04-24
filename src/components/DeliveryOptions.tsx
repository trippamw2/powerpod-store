import { Truck, Clock, MapPin, Check, Zap, Package } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DeliveryCompany {
  id: string;
  name: string;
  slug: string;
  description: string;
  is_same_day: boolean;
  service_area: string[];
  estimated_days: number;
  base_fee_mwk: number;
}

interface DeliveryOptionsProps {
  selectedCompany: DeliveryCompany | null;
  onSelect: (company: DeliveryCompany) => void;
  location: string;
}

const mockCompanies: DeliveryCompany[] = [
  {
    id: "same-day",
    name: "Same Day Delivery",
    slug: "same-day",
    description: "Blantyre & Limbe area - delivered today!",
    is_same_day: true,
    service_area: ["blantyre"],
    estimated_days: 0,
    base_fee_mwk: 0,
  },
  {
    id: "free-nationwide",
    name: "Free Delivery (Nationwide)",
    slug: "free-nationwide",
    description: "Anywhere in Malawi - ships within 24hrs",
    is_same_day: false,
    service_area: ["all"],
    estimated_days: 5,
    base_fee_mwk: 0,
  },
  {
    id: "express",
    name: "Express Delivery",
    slug: "express",
    description: "Fast 2-3 days - Lilongwe, Mzuzu & more",
    is_same_day: false,
    service_area: ["all"],
    estimated_days: 3,
    base_fee_mwk: 0,
  },
];

export const getDeliveryCompanies = (location: string): DeliveryCompany[] => {
  if (!location) return mockCompanies;

  const locLower = location.toLowerCase();
  const isBlantyre = locLower.includes("blantyre") || locLower.includes("limbe");

  return mockCompanies;
};

export const DeliveryOptions = ({ selectedCompany, onSelect, location }: DeliveryOptionsProps) => {
  const companies = getDeliveryCompanies(location);

  const formatDuration = (days: number) => {
    if (days === 0) return "Today";
    if (days === 1) return "1 day";
    if (days <= 5) return `${days} days`;
    return `${days} days`;
  };

  const getIcon = (company: DeliveryCompany) => {
    if (company.is_same_day) return <Zap className="h-5 w-5 text-yellow-500" />;
    if (company.id === "free-nationwide") return <Package className="h-5 w-5 text-green-500" />;
    return <Truck className="h-5 w-5 text-muted-foreground" />;
  };

  return (
    <div className="space-y-4">
      <p className="text-sm font-medium text-muted-foreground">Select your preferred delivery method</p>
      <div className="grid gap-4">
        {companies.map((company) => (
          <button
            key={company.id}
            type="button"
            onClick={() => onSelect(company)}
            className={cn(
              "relative p-5 rounded-2xl border-2 text-left transition-all duration-200",
              "hover:border-primary/50 hover:shadow-glow",
              selectedCompany?.id === company.id
                ? "border-primary bg-primary/5 shadow-glow"
                : "border-border bg-card hover:bg-secondary/30"
            )}
          >
            {selectedCompany?.id === company.id && (
              <div className="absolute top-4 right-4 h-6 w-6 rounded-full bg-gradient-brand flex items-center justify-center">
                <Check className="h-4 w-4 text-white" />
              </div>
            )}

            <div className="flex items-start gap-4">
              <div className={cn(
                "h-12 w-12 rounded-xl flex items-center justify-center shrink-0",
                selectedCompany?.id === company.id
                  ? "bg-gradient-brand"
                  : "bg-secondary"
              )}>
                {getIcon(company)}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold text-lg">{company.name}</p>
                  <span className="text-green-500 font-bold text-lg">FREE</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{company.description}</p>
                <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    {formatDuration(company.estimated_days)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" />
                    {company.service_area.includes("all") ? "Nationwide" : company.service_area.join(", ")}
                  </span>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="p-4 bg-green-500/10 rounded-xl border border-green-500/20">
        <p className="text-sm text-green-500 font-medium">✓ All deliveries are FREE!</p>
        <p className="text-xs text-muted-foreground mt-1">No hidden fees - price you see is what you pay</p>
      </div>
    </div>
  );
};

export default DeliveryOptions;