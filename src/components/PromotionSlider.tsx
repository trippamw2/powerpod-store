import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Promotion } from "@/data/promotions";
import { cn } from "@/lib/utils";

interface PromotionSliderProps {
  page: "home" | "shop" | "combos";
  className?: string;
}

export const PromotionSlider = ({ page, className }: PromotionSliderProps) => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const { data, error } = await supabase
          .from("promotions")
          .select("*")
          .eq("is_active", true)
          .contains("pages", [page])
          .order("sort_order", { ascending: true });

        if (!error && data && data.length > 0) {
          setPromotions(data);
        }
      } catch (err) {
        console.error("Failed to fetch promotions:", err);
      }
      setLoading(false);
    };

    fetchPromotions();
  }, [page]);

  useEffect(() => {
    if (promotions.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent(c => (c + 1) % promotions.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [promotions.length]);

  if (loading || promotions.length === 0) {
    return (
      <div className={cn("relative rounded-xl overflow-hidden h-40 sm:h-48 md:h-56 lg:h-64 bg-gradient-to-r from-orange-500 to-orange-600", className)}>
        <div className="flex items-center justify-center h-full">
          <span className="text-white font-bold text-lg">PowerPod</span>
        </div>
      </div>
    );
  }

  const promotion = promotions[current];
  const sliderImages = promotion.images && promotion.images.length > 0 
    ? promotion.images 
    : promotion.image ? [promotion.image] : [];
  const activeImage = sliderImages[0];

  if (!activeImage) {
    return (
      <div className={cn("relative rounded-xl overflow-hidden h-40 sm:h-48 md:h-56 lg:h-64 bg-gradient-to-r", promotion.background_color, className)}>
        <Link to={promotion.link} className="flex items-center justify-center h-full">
          <div className="text-center">
            <p className={cn("text-xs sm:text-sm font-medium opacity-90", promotion.text_color)}>
              {promotion.subtitle}
            </p>
            <h2 className={cn("font-display font-bold text-lg sm:text-2xl md:text-3xl mt-1", promotion.text_color)}>
              {promotion.title}
            </h2>
            <span className={cn("inline-block px-3 py-1.5 rounded-full text-xs font-medium mt-2", promotion.text_color, "bg-white/20")}>
              {promotion.link_text}
            </span>
          </div>
        </Link>
      </div>
    );
  }

  return (
    <div className={cn("relative rounded-xl overflow-hidden h-40 sm:h-48 md:h-56 lg:h-64", className)}>
      <Link
        to={promotion.link}
        className="block relative h-full"
      >
        <div className="absolute inset-0">
          <img
            src={activeImage}
            alt={promotion.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>
        <div className="relative h-full flex items-center px-6 sm:px-10">
          <div className="max-w-xl">
            <p className={cn("text-xs sm:text-sm font-medium opacity-90", promotion.text_color)}>
              {promotion.subtitle}
            </p>
            <h2 className={cn("font-display font-bold text-lg sm:text-2xl md:text-3xl mt-1", promotion.text_color)}>
              {promotion.title}
            </h2>
            <span className={cn(
              "inline-block px-3 py-1.5 rounded-full text-xs font-medium mt-2",
              promotion.text_color,
              "bg-white/20 backdrop-blur-sm"
            )}>
              {promotion.link_text}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default PromotionSlider;