import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Truck, Clock, MapPin, Check, Gift } from "lucide-react";
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
    name: "Same Day Delivery (Blantyre)",
    slug: "same-day",
    description: "FREE delivery within Blantyre today - Free for orders over MWK 50,000",
    is_same_day: true,
    service_area: ["blantyre"],
    estimated_days: 0,
    base_fee_mwk: 0,
  },
  {
    id: "free-nationwide",
    name: "Free Delivery (Nationwide)",
    slug: "free-nationwide",
    description: "FREE delivery anywhere in Malawi - Your order ships free!",
    is_same_day: false,
    service_area: ["all"],
    estimated_days: 5,
    base_fee_mwk: 0,
  },
  {
    id: "express",
    name: "Express Delivery",
    slug: "express",
    description: "Fast 2-3 day delivery in Malawi",
    is_same_day: false,
    service_area: ["all"],
    estimated_days: 3,
    base_fee_mwk: 0,
  },
  {
    id: "pickup",
    name: "Pickup Station",
    slug: "pickup",
    description: "Pick up from our Blantyre or Lilongwe store",
    is_same_day: true,
    service_area: ["blantyre", "lilongwe"],
    estimated_days: 0,
    base_fee_mwk: 0,
  },
];

export const getDeliveryCompanies = (location: string, orderTotal: number = 0): DeliveryCompany[] => {
  if (!location) return mockCompanies;
  
  const locLower = location.toLowerCase();
  const isBlantyre = locLower.includes("blantyre") || locLower.includes("limbe");
  const isLilongwe = locLower.includes("lilongwe");
  
  let companies = [...mockCompanies];
  
  if (isBlantyre && orderTotal >= 50000) {
    companies = companies.filter(c => c.id !== "free-nationwide");
  }
  
  if (!isBlantyre && !isLilongwe) {
    companies = companies.filter(c => c.id !== "same-day" && c.id !== "pickup");
  }
  
  return companies;
};

export const DeliveryOptions = ({ selectedCompany, onSelect, location }: DeliveryOptionsProps) => {
  const companies = getDeliveryCompanies(location);
  
  const formatDuration = (days: number) => {
    if (days === 0) return "Same day";
    if (days === 1) return "1 day";
    return `${days} days`;
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">Select Delivery Method</label>
      <div className="grid gap-3">
        {companies.map((company) => (
          <motion.button
            key={company.id}
            type="button"
            onClick={() => onSelect(company)}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className={cn(
              "relative p-4 rounded-xl border-2 text-left transition-all",
              selectedCompany?.id === company.id
                ? "border-primary bg-primary/10"
                : "border-border hover:border-primary/50 bg-card"
            )}
          >
            {selectedCompany?.id === company.id && (
              <div className="absolute top-3 right-3 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                <Check className="h-3 w-3 text-white" />
              </div>
            )}
            
            <div className="flex items-start gap-3">
              <div className={cn(
                "h-10 w-10 rounded-lg flex items-center justify-center",
                company.base_fee_mwk === 0 ? "bg-green-500/20" : "bg-secondary"
              )}>
                {company.base_fee_mwk === 0 ? (
                  <Gift className="h-5 w-5 text-green-500" />
                ) : company.is_same_day ? (
                  <Clock className="h-5 w-5 text-accent" />
                ) : (
                  <Truck className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
              
              <div className="flex-1">
                <p className="font-semibold">{company.name}</p>
                <p className="text-sm text-muted-foreground">{company.description}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatDuration(company.estimated_days)}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {company.service_area.includes("all") ? "Nationwide" : company.service_area.join(", ")}
                  </span>
                </div>
              </div>
              
              <div className="text-right">
                <p className="font-bold text-lg text-green-500">
                  {company.base_fee_mwk === 0 ? "FREE" : `MWK ${company.base_fee_mwk.toLocaleString()}`}
                </p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default DeliveryOptions;