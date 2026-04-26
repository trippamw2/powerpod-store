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
    <div className={cn("relative rounded-xl overflow-hidden h-32 sm:h-40 md:h-48", className)}>
      <Link
        to={promotion.link}
        className={cn(
          "block relative h-full overflow-hidden",
          !promotion.image && "bg-gradient-to-r"
        )}
      >
        {promotion.image ? (
          <div className="absolute inset-0">
            <img
              src={promotion.image}
              alt={promotion.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>
        ) : (
          <div className={cn("absolute inset-0 bg-gradient-to-r", promotion.background_color)} />
        )}
        <div className="relative h-full flex items-center px-4 sm:px-8">
          <div className="max-w-lg">
            <p className={cn("text-xs sm:text-sm font-medium opacity-90", promotion.text_color)}>
              {promotion.subtitle}
            </p>
            <h2 className={cn("font-display font-bold text-lg sm:text-xl md:text-2xl", promotion.text_color)}>
              {promotion.title}
            </h2>
            <Link
              to={promotion.link}
              className={cn(
                "inline-flex items-center gap-1 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-medium text-xs sm:text-sm mt-1 sm:mt-2 cursor-pointer",
                promotion.text_color,
                "bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
              )}
            >
              {promotion.link_text}
            </Link>
          </div>
        </div>
      </Link>

      {promotions.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow transition-colors"
          >
            <ChevronLeft className="h-4 w-4 text-gray-700" />
          </button>
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow transition-colors"
          >
            <ChevronRight className="h-4 w-4 text-gray-700" />
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
            {promotions.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={cn(
                  "w-2 h-2 rounded-full transition-all",
                  i === current ? "bg-white w-4" : "bg-white/50"
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default PromotionSlider;