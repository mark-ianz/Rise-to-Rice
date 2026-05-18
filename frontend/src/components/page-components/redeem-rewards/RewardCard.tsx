import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { Reward, RewardVariation } from "@/types/rewards";
import { formatUnit } from "@/lib/format";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import RedeemButton from "./RedeemButton";
import { CheckCircle2, AlertCircle } from "lucide-react";

type Props = {
  reward: Reward;
  userPoints: number;
};

// Beautiful vector illustrations context-aware of the reward item name
const RewardIllustration = ({ name }: { name: string }) => {
  const lowercaseName = name.toLowerCase();

  // 1. Rice Bowl
  if (lowercaseName.includes("rice") || lowercaseName.includes("bigas")) {
    return (
      <svg viewBox="0 0 100 100" className="w-16 h-16 text-[#2D5A27]" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 50 C20 75, 80 75, 80 50 Z" fill="#E8F4E5" />
        <path d="M35 72 L35 80 C35 83, 65 83, 65 80 L65 72" />
        <path d="M20 50 C20 35, 35 25, 50 25 C65 25, 80 35, 80 50 Z" fill="#FFFFFF" />
        <line x1="75" y1="20" x2="35" y2="60" stroke="#8B5A2B" strokeWidth="3" />
        <line x1="82" y1="23" x2="42" y2="63" stroke="#8B5A2B" strokeWidth="3" />
        <path d="M50 35 C52 28, 58 28, 58 35 C58 42, 52 42, 50 35" fill="#2D5A27" />
      </svg>
    );
  }

  // 2. Liquid Soap / Cleaning / Detergent
  if (
    lowercaseName.includes("soap") ||
    lowercaseName.includes("detergent") ||
    lowercaseName.includes("clean") ||
    lowercaseName.includes("liquid") ||
    lowercaseName.includes("sabon")
  ) {
    return (
      <svg viewBox="0 0 100 100" className="w-16 h-16 text-[#2D5A27]" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="30" y="35" width="40" height="48" rx="8" fill="#E8F4E5" />
        <path d="M42 35 L42 22 C42 20, 58 20, 58 22 L58 35" />
        <rect x="38" y="16" width="24" height="6" rx="2" fill="#2D5A27" />
        <path d="M70 45 C77 45, 77 65, 70 65" strokeWidth="3" />
        <circle cx="25" cy="25" r="4" fill="#A8D59D" opacity="0.6" />
        <circle cx="78" cy="30" r="6" fill="#A8D59D" opacity="0.4" />
        <circle cx="20" cy="55" r="5" fill="#A8D59D" opacity="0.5" />
      </svg>
    );
  }

  // 3. Fresh Groceries / Food / Snacks
  if (
    lowercaseName.includes("food") ||
    lowercaseName.includes("grocery") ||
    lowercaseName.includes("groceries") ||
    lowercaseName.includes("snack") ||
    lowercaseName.includes("canned") ||
    lowercaseName.includes("pagkain")
  ) {
    return (
      <svg viewBox="0 0 100 100" className="w-16 h-16 text-[#2D5A27]" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M25 35 L75 35 L80 85 L20 85 Z" fill="#F4EAD4" stroke="#8B7355" />
        <path d="M25 35 L50 48 L75 35" stroke="#8B7355" />
        <circle cx="40" cy="28" r="10" fill="#2D5A27" />
        <path d="M40 18 Q43 14 41 12" stroke="#8B5A2B" />
        <path d="M60 20 C55 25, 62 32, 65 25 Z" fill="#A8D59D" />
      </svg>
    );
  }

  // 4. Money / Wallet / Cash Card / Voucher
  if (
    lowercaseName.includes("cash") ||
    lowercaseName.includes("voucher") ||
    lowercaseName.includes("coupon") ||
    lowercaseName.includes("money") ||
    lowercaseName.includes("pera")
  ) {
    return (
      <svg viewBox="0 0 100 100" className="w-16 h-16 text-[#2D5A27]" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="20" y="25" width="60" height="42" rx="6" fill="#E8F4E5" />
        <rect x="20" y="33" width="60" height="10" fill="#2D5A27" />
        <rect x="28" y="52" width="12" height="8" rx="2" fill="#E2C974" />
        <line x1="48" y1="56" x2="72" y2="56" strokeWidth="3" />
        <circle cx="75" cy="78" r="8" fill="#E2C974" />
        <path d="M75 74 L75 82 M71 78 L79 78" stroke="#FFFFFF" />
      </svg>
    );
  }

  // 5. Fallback Eco Gift
  return (
    <svg viewBox="0 0 100 100" className="w-16 h-16 text-[#2D5A27]" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="25" y="40" width="50" height="42" rx="4" fill="#E8F4E5" />
      <rect x="20" y="32" width="60" height="10" rx="2" fill="#2D5A27" />
      <line x1="50" y1="32" x2="50" y2="82" stroke="#2D5A27" strokeWidth="3" />
      <path d="M50 32 C40 20, 32 30, 50 32 Z" fill="#A8D59D" />
      <path d="M50 32 C60 20, 68 30, 50 32 Z" fill="#A8D59D" />
    </svg>
  );
};

export default function RewardCard({ reward, userPoints }: Props) {
  const { t } = useTranslation("redeem_rewards");
  const [points_cost, setPointsCost] = useState<number>(0);
  const [selectedQuantity, setSelectedQuantity] = useState<string>("");
  const [variationId, setRewardVariationId] = useState<number>(0);

  const { data: reward_variations, isLoading } = useQuery<RewardVariation[]>({
    queryKey: ["reward-variations", reward.reward_id],
    queryFn: async () => {
      const response = await axios.get(`/api/reward-variation/${reward.reward_id}`);
      return response.data;
    },
  });

  useEffect(() => {
    if (reward_variations && reward_variations.length > 0) {
      setSelectedQuantity(reward_variations[0].quantity.toString());
      setPointsCost(reward_variations[0].points_cost || 0);
      setRewardVariationId(reward_variations[0].variation_id);
    }
  }, [reward_variations]);

  const handleOnValueChange = (value: string) => {
    setSelectedQuantity(value);
    if (reward_variations) {
      const variation = reward_variations.find((v) => v.quantity.toString() === value);
      if (variation) {
        setPointsCost(variation.points_cost);
        setRewardVariationId(variation.variation_id);
      }
    }
  };

  const hasEnoughPoints = userPoints >= points_cost;
  const pointsDifference = points_cost - userPoints;
  const isEmpty = !reward_variations || reward_variations.length === 0;

  if (isLoading) {
    return (
      <div className="flex flex-col border border-border bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
        <div className="h-36 w-full bg-secondary-light flex items-center justify-center border-b border-border/50">
          <Skeleton className="w-16 h-16 rounded-full" />
        </div>
        <div className="p-5 flex-1 flex flex-col gap-4">
          <Skeleton className="h-6 w-3/4 rounded-md" />
          <Skeleton className="h-4 w-1/3 rounded" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="group flex flex-col border border-border/60 bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
      {/* Dynamic Graphic Top Section */}
      <div className="relative h-36 w-full bg-gradient-to-br from-[#fafaf9] to-[#f4f2ee] flex items-center justify-center border-b border-border/40 group-hover:from-[#f4f7f3] group-hover:to-[#eef3ed] transition-all duration-300">
        <div className="transform group-hover:scale-110 transition-transform duration-300">
          <RewardIllustration name={reward.reward_name} />
        </div>

        {/* Cost Badge in HSL-based Tailwind Colors */}
        {!isEmpty && (
          <div className="absolute top-3 right-3 bg-[#2D5A27] text-white px-3 py-1 text-xs font-semibold rounded-full shadow-sm flex items-center gap-1">
            {t(points_cost === 1 ? "terms.points_others" : "terms.points", { count: points_cost })}
          </div>
        )}
      </div>

      {/* Info & Action Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div className="flex flex-col gap-1.5 mb-4">
          <h3 className="font-bold text-foreground text-lg group-hover:text-[#2D5A27] transition-colors duration-300">
            {reward.reward_name}
          </h3>
        </div>

        <div className="flex flex-col gap-4">
          {/* Quantity dropdown selector */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-foreground/80">
              {t("terms.quantity")}
            </label>
            <Select value={selectedQuantity} onValueChange={handleOnValueChange} disabled={isEmpty}>
              <SelectTrigger className="w-full bg-secondary-light/60 border border-border/60 hover:border-[#2D5A27]/40 focus:ring-[#2D5A27]/30 transition-all rounded-xl h-10 text-sm font-medium">
                {!isEmpty && selectedQuantity
                  ? `${selectedQuantity} ${formatUnit(reward.unit, parseInt(selectedQuantity))}`
                  : "N/A"}
              </SelectTrigger>
              <SelectContent>
                {reward_variations?.map((variation, index) => (
                  <SelectItem key={index} value={variation.quantity.toString()}>
                    {variation.quantity} {formatUnit(reward.unit, variation.quantity)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Insufficient points warning */}
          {!isEmpty && !hasEnoughPoints && (
            <div className="flex items-center gap-2 text-xs font-semibold text-[#dc2626] bg-[#fef2f2] p-2.5 rounded-lg border border-[#fca5a5]/30 animate-pulse">
              <AlertCircle size={14} className="shrink-0" />
              <span>
                {t("custom_redesign.insufficient_points", { points: pointsDifference.toFixed(2) })}
              </span>
            </div>
          )}

          {/* Point comparison success check */}
          {!isEmpty && hasEnoughPoints && (
            <div className="flex items-center gap-1.5 text-xs text-[#2D5A27] bg-[#f0f7f0] px-2.5 py-1.5 rounded-lg border border-[#d2edd2]/30 w-fit">
              <CheckCircle2 size={13} className="shrink-0" />
              <span>{t("custom_redesign.eligible_badge")}</span>
            </div>
          )}

          {/* CTA: Redeem trigger */}
          <RedeemButton
            variationId={variationId}
            reward={reward}
            points_cost={points_cost}
            selectedQuantity={selectedQuantity}
            disabled={!hasEnoughPoints}
          />
        </div>
      </div>
    </div>
  );
}
