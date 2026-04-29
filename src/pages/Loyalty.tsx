import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useLoyalty } from "@/hooks/useLoyalty";
import { useProducts } from "@/hooks/useProducts";
import { Button } from "@/components/ui/button";
import { PromotionSlider } from "@/components/PromotionSlider";
import { Gift, Star, TrendingUp, Clock, ArrowRight, Loader2, ShoppingBag, Zap, Crown, Award, Gem } from "lucide-react";
import { formatMWK } from "@/data/products";

const tierConfig = {
  bronze: { icon: Gem, color: "bg-amber-700", text: "text-amber-700", bg: "bg-amber-50" },
  silver: { icon: Award, color: "bg-gray-400", text: "text-gray-400", bg: "bg-gray-50" },
  gold: { icon: Crown, color: "bg-yellow-500", text: "text-yellow-600", bg: "bg-yellow-50" },
  platinum: { icon: Star, color: "bg-purple-500", text: "text-purple-600", bg: "bg-purple-50" },
};

const Loyalty = () => {
  const { user } = useAuth();
  const { loyalty, program, tiers, transactions, loading, calculatePoints, getTierBenefits, canRedeem, getRewardValue, error } = useLoyalty(user?.id);
  const { products } = useProducts();

  if (!user) {
    return (
      <div className="container py-6 sm:py-12">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <Gift className="h-12 w-12 mx-auto text-orange-500" />
          <h1 className="font-display font-bold text-2xl sm:text-3xl">Join PowerPod Rewards</h1>
          <p className="text-muted-foreground">Sign in to earn points on every purchase and unlock exclusive rewards!</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild variant="hero" size="lg">
              <Link to="/auth">Sign In</Link>
            </Button>
            <Button asChild size="lg" className="bg-gray-900">
              <Link to="/shop">Shop Now</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container py-6 sm:py-12">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        </div>
      </div>
    );
  }

  const currentTier = loyalty?.tier || "bronze";
  const tierInfo = tierConfig[currentTier as keyof typeof tierConfig] || tierConfig.bronze;
  const benefits = getTierBenefits(currentTier);
  const redeemablePoints = loyalty?.available_points || 0;
  const rewardValue = getRewardValue(redeemablePoints);

  return (
    <div className="container py-4 sm:py-8 md:py-12">
      <div className="mb-4 sm:mb-6">
        <PromotionSlider page="shop" className="shadow-lg" />
      </div>

      {/* Header */}
      <div className="max-w-2xl space-y-2 sm:space-y-3 mb-6 sm:mb-8">
        <h1 className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl tracking-tight">PowerPod Rewards</h1>
        <p className="text-muted-foreground text-sm sm:text-base">Earn points on every purchase. Redeem for discounts!</p>
      </div>

      {/* Points Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-xl sm:rounded-2xl p-4 sm:p-6 ${tierInfo.bg} border mb-6 sm:mb-8`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className={`h-12 sm:h-16 w-12 sm:w-16 rounded-full ${tierInfo.color} flex items-center justify-center`}>
              <tierInfo.icon className="h-6 sm:h-8 w-6 sm:w-8 text-white" />
            </div>
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground uppercase">Current Tier</p>
              <p className={`font-display font-bold text-xl sm:text-2xl ${tierInfo.text} capitalize`}>{currentTier}</p>
            </div>
          </div>
          <div className="text-center sm:text-right">
            <p className="text-xs sm:text-sm text-muted-foreground">Available Points</p>
            <p className="font-display font-bold text-3xl sm:text-4xl text-gray-900">{redeemablePoints.toLocaleString()}</p>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Worth {formatMWK(rewardValue)} in rewards
            </p>
          </div>
        </div>

        {/* Progress to next tier */}
        {benefits && (
          <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200/50">
            <div className="flex justify-between text-xs sm:text-sm mb-2">
              <span className="text-muted-foreground">Progress to {tiers[tiers.findIndex(t => t.name === currentTier) + 1]?.name || "next tier"}</span>
              <span className="font-medium">{loyalty?.total_points || 0} / {(tiers[tiers.findIndex(t => t.name === currentTier) + 1]?.min_lifetime_points || 5000)} pts</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full ${tierInfo.color} rounded-full`} 
                style={{ width: `${Math.min(100, ((loyalty?.total_points || 0) / (tiers[tiers.findIndex(t => t.name === currentTier) + 1]?.min_lifetime_points || 5000)) * 100)}%` }}
              />
            </div>
          </div>
        )}
      </motion.div>

      {/* How it Works */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {[
          { icon: ShoppingBag, title: "Shop", desc: "Buy products" },
          { icon: Gift, title: "Earn", desc: "Get points" },
          { icon: Zap, title: "Save", desc: "Redeem rewards" },
          { icon: Crown, title: "Level Up", desc: "Unlock tiers" },
        ].map((step) => (
          <div key={step.title} className="text-center p-3 sm:p-4 bg-gray-50 rounded-xl">
            <step.icon className="h-5 sm:h-6 w-5 sm:w-6 mx-auto mb-1 sm:mb-2 text-orange-500" />
            <p className="font-semibold text-xs sm:text-sm">{step.title}</p>
            <p className="text-xs text-muted-foreground">{step.desc}</p>
          </div>
        ))}
      </div>

      {/* Tiers */}
      <h2 className="font-display font-bold text-lg sm:text-xl mb-3 sm:mb-4">Tier Benefits</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-6 sm:mb-8">
        {tiers.map((tier) => {
          const config = tierConfig[tier.name as keyof typeof tierConfig] || tierConfig.bronze;
          return (
            <div
              key={tier.name}
              className={`p-3 sm:p-4 rounded-xl border ${
                tier.name === currentTier 
                  ? `${config.bg} border-2` 
                  : "border-gray-100 bg-white"
              }`}
            >
              <div className={`h-8 sm:h-10 w-8 sm:w-10 rounded-full ${config.color} flex items-center justify-center mb-2`}>
                <config.icon className="h-4 sm:h-5 w-4 sm:w-5 text-white" />
              </div>
              <p className="font-semibold text-sm capitalize">{tier.name}</p>
              <div className="mt-2 space-y-1">
                <p className="text-xs text-muted-foreground">{tier.min_lifetime_points.toLocaleString()}+ points</p>
                {tier.discount_percent > 0 && (
                  <p className="text-xs font-medium text-green-600">{tier.discount_percent}% off</p>
                )}
                {tier.free_delivery && (
                  <p className="text-xs font-medium text-green-600">Free delivery</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Transactions */}
      <h2 className="font-display font-bold text-lg sm:text-xl mb-3 sm:mb-4">Recent Activity</h2>
      <div className="rounded-xl border border-gray-100 overflow-hidden mb-6 sm:mb-8">
        {transactions.length > 0 ? (
          transactions.map((tx, i) => (
            <div
              key={tx.id}
              className={`flex items-center justify-between p-3 sm:p-4 ${
                i % 2 === 0 ? "bg-gray-50" : "bg-white"
              }`}
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                  tx.type === "earned" ? "bg-green-100" : 
                  tx.type === "redeemed" ? "bg-blue-100" : "bg-gray-100"
                }`}>
                  {tx.type === "earned" ? (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  ) : tx.type === "redeemed" ? (
                    <Gift className="h-4 w-4 text-blue-600" />
                  ) : (
                    <Clock className="h-4 w-4 text-gray-600" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-sm capitalize">{tx.type}</p>
                  <p className="text-xs text-muted-foreground">{tx.description}</p>
                </div>
              </div>
              <p className={`font-semibold text-sm ${
                tx.points > 0 ? "text-green-600" : "text-red-600"
              }`}>
                {tx.points > 0 ? "+" : ""}{tx.points} pts
              </p>
            </div>
          ))
        ) : (
          <div className="p-6 sm:p-8 text-center">
            <Clock className="h-8 sm:h-10 w-8 sm:w-10 mx-auto text-gray-300 mb-3" />
            <p className="text-muted-foreground">No activity yet</p>
            <p className="text-sm text-gray-400">Start shopping to earn points!</p>
          </div>
        )}
      </div>

      {/* CTA */}
      <Button asChild variant="hero" size="lg" className="w-full">
        <Link to="/shop">
          Shop Now to Earn Points <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
};

export default Loyalty;