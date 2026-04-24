import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
    // Try to fetch from DB first, fallback to mock data
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
        } else {
          // Fallback to mock data filtered by page
          const { mockPromotions } = await import("@/data/promotions");
          setPromotions(mockPromotions.filter(p => p.pages.includes(page)));
        }
      } catch {
        const { mockPromotions } = await import("@/data/promotions");
        setPromotions(mockPromotions.filter(p => p.pages.includes(page)));
      }
      setLoading(false);
    };

    fetchPromotions();
  }, [page]);

  const next = () => setCurrent(c => (c + 1) % promotions.length);
  const prev = () => setCurrent(c => (c - 1 + promotions.length) % promotions.length);

  useEffect(() => {
    if (promotions.length <= 1) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [promotions.length]);

  if (loading || promotions.length === 0) return null;

  const promotion = promotions[current];

  return (
    <div className={cn("relative rounded-2xl overflow-hidden", className)}>
      {/* Slide */}
      <Link
        to={promotion.link}
        className={cn(
          "block relative aspect-[18/7] bg-gradient-to-r overflow-hidden",
          promotion.background_color
        )}
      >
        <div className="absolute inset-0">
          <img
            src={promotion.image}
            alt={promotion.title}
            className="w-full h-full object-cover opacity-40"
          />
          <div className={cn("absolute inset-0 bg-gradient-to-r", promotion.background_color)} />
        </div>
        <div className="relative h-full flex items-center">
          <div className="container">
            <div className="max-w-lg">
              <p className={cn("text-sm font-medium opacity-90 mb-2", promotion.text_color)}>
                {promotion.subtitle}
              </p>
              <h2 className={cn("font-display font-bold text-2xl sm:text-3xl md:text-4xl mb-2", promotion.text_color)}>
                {promotion.title}
              </h2>
              {promotion.description && (
                <p className={cn("text-lg opacity-80 mb-4", promotion.text_color)}>
                  {promotion.description}
                </p>
              )}
              <span className={cn(
                "inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm",
                promotion.text_color,
                "bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
              )}>
                {promotion.link_text}
              </span>
            </div>
          </div>
        </div>
      </Link>

      {/* Navigation Arrows */}
      {promotions.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-lg transition-colors"
          >
            <ChevronLeft className="h-5 w-5 text-gray-700" />
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-lg transition-colors"
          >
            <ChevronRight className="h-5 w-5 text-gray-700" />
          </button>
        </>
      )}

      {/* Dots */}
      {promotions.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {promotions.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={cn(
                "w-2 h-2 rounded-full transition-all",
                i === current ? "bg-white w-6" : "bg-white/50 hover:bg-white/70"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PromotionSlider;