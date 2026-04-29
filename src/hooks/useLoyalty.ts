import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

interface LoyaltyProgram {
  id: string;
  name: string;
  description: string;
  points_per_mwk: number;
  points_to_redeem: number;
  reward_value_mwk: number;
}

interface LoyaltyTier {
  name: string;
  min_lifetime_points: number;
  points_multiplier: number;
  discount_percent: number;
  free_delivery: boolean;
}

interface CustomerLoyalty {
  id: string;
  customer_id: string;
  total_points: number;
  available_points: number;
  redeemed_points: number;
  lifetime_spent_mwk: number;
  tier: string;
}

interface LoyaltyTransaction {
  id: string;
  points: number;
  type: string;
  description: string;
  created_at: string;
}

export function useLoyalty(customerId?: string) {
  const [loyalty, setLoyalty] = useState<CustomerLoyalty | null>(null);
  const [program, setProgram] = useState<LoyaltyProgram | null>(null);
  const [tiers, setTiers] = useState<LoyaltyTier[]>([]);
  const [transactions, setTransactions] = useState<LoyaltyTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLoyaltyData = useCallback(async () => {
    if (!customerId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch customer loyalty
      const { data: loyaltyData, error: loyaltyError } = await supabase
        .from("customer_loyalty")
        .select("*")
        .eq("customer_id", customerId)
        .single();

      if (loyaltyError && loyaltyError.code !== "PGRST116") {
        throw loyaltyError;
      }

      if (loyaltyData) {
        setLoyalty(loyaltyData);
      } else {
        // Create loyalty record if not exists
        const { data: newLoyalty, error: createError } = await supabase
          .from("customer_loyalty")
          .insert({
            customer_id: customerId,
            total_points: 0,
            available_points: 0,
            redeemed_points: 0,
            lifetime_spent_mwk: 0,
            tier: "bronze",
          })
          .select()
          .single();

        if (createError) throw createError;
        setLoyalty(newLoyalty);
      }

      // Fetch active program
      const { data: programData } = await supabase
        .from("loyalty_programs")
        .select("*")
        .eq("is_active", true)
        .single();
      setProgram(programData);

      // Fetch tiers
      const { data: tiersData } = await supabase
        .from("loyalty_tiers")
        .select("*")
        .order("min_lifetime_points", { ascending: true });
      setTiers(tiersData || []);

      // Fetch recent transactions
      const { data: txData } = await supabase
        .from("loyalty_transactions")
        .select("*")
        .eq("customer_id", customerId)
        .order("created_at", { ascending: false })
        .limit(10);
      setTransactions(txData || []);
    } catch (err) {
      console.error("Loyalty fetch error:", err);
      setError("Failed to load loyalty");
    } finally {
      setLoading(false);
    }
  }, [customerId]);

  useEffect(() => {
    fetchLoyaltyData();
  }, [fetchLoyaltyData]);

  const calculatePoints = useCallback((orderTotal: number): number => {
    if (!program || orderTotal <= 0) return 0;
    return Math.floor(orderTotal / program.points_per_mwk);
  }, [program]);

  const calculateTier = useCallback((lifetimePoints: number): string => {
    for (const tier of tiers) {
      if (lifetimePoints >= tier.min_lifetime_points) {
        return tier.name;
      }
    }
    return "bronze";
  }, [tiers]);

  const getTierBenefits = useCallback((tierName: string): LoyaltyTier | undefined => {
    return tiers.find(t => t.name === tierName);
  }, [tiers]);

  const canRedeem = useCallback((points: number): boolean => {
    if (!program || !loyalty) return false;
    return loyalty.available_points >= program.points_to_redeem && points >= program.points_to_redeem;
  }, [program, loyalty]);

  const getRewardValue = useCallback((points: number): number => {
    if (!program || points <= 0) return 0;
    const redemptions = Math.floor(points / program.points_to_redeem);
    return redemptions * program.reward_value_mwk;
  }, [program]);

  return {
    loyalty,
    program,
    tiers,
    transactions,
    loading,
    error,
    refresh: fetchLoyaltyData,
    calculatePoints,
    calculateTier,
    getTierBenefits,
    canRedeem,
    getRewardValue,
  };
}