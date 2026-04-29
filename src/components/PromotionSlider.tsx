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
  const [currentImage, setCurrentImage] = useState(0);
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

        if (!error && data) {
          setPromotions(data);
        }
      } catch {
        console.error("Failed to fetch promotions");
      }
      setLoading(false);
    };

    fetchPromotions();
  }, [page]);

  const next = () => setCurrent(c => (c + 1) % promotions.length);

  useEffect(() => {
    if (promotions.length <= 1) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [promotions.length]);

  useEffect(() => {
    const promo = promotions[current];
    if (promo?.images && promo.images.length > 1) {
      const imgTimer = setInterval(() => {
        setCurrentImage(i => (i + 1) % promo.images!.length);
      }, 2000);
      return () => clearInterval(imgTimer);
    }
  }, [current, promotions]);

  if (loading || promotions.length === 0) return null;

  const promotion = promotions[current];
  const sliderImages = promotion.images && promotion.images.length > 0 
    ? promotion.images 
    : promotion.image ? [promotion.image] : [];
  const activeImage = sliderImages[currentImage];

  return (
    <div className={cn("relative rounded-xl overflow-hidden h-40 sm:h-48 md:h-56 lg:h-64", className)}>
      <Link
        to={promotion.link}
        className="block relative h-full"
      >
        {activeImage ? (
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
        ) : (
          <div className={cn("absolute inset-0 bg-gradient-to-r", promotion.background_color)} />
        )}
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
      {promotions.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
          {promotions.map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-2 rounded-full transition-all",
                i === current ? "bg-white w-5" : "bg-white/50 w-2"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PromotionSlider;