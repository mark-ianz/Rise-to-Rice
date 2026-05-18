import { useState } from "react";
import { useGetRewards } from "@/hooks/query/useRewards";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Points as PointsType } from "@/types/points";
import RewardCard from "./RewardCard";
import RewardCardSkeleton from "@/components/skeletons/RewardCardSkeleton";
import GenericError from "@/components/general/GenericError";
import { Search, ArrowUpDown, SlidersHorizontal, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function RewardsTable() {
  const { t } = useTranslation("redeem_rewards");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "points-asc" | "points-desc">("name");

  // Fetch the rewards list (isAdmin: false for normal catalog access)
  const { data: rewards, isLoading: isRewardsLoading } = useGetRewards({});

  // Fetch user points for comparison in cards
  const { data: pointsData, isLoading: isPointsLoading } = useQuery<PointsType>({
    queryKey: ["user-points"],
    queryFn: async () => {
      const response = await axios.get("/api/points/");
      return response.data;
    },
  });

  const isLoading = isRewardsLoading || isPointsLoading;
  const userPoints = pointsData?.points_accumulated || 0;

  if (!rewards && !isLoading) return <GenericError />;

  // Filter rewards based on search
  const filteredRewards = rewards?.result.filter((reward) => {
    const term = searchQuery.toLowerCase().trim();
    if (!term) return true;
    return (
      reward.reward_name.toLowerCase().includes(term) ||
      reward.reward_id.toString().includes(term)
    );
  }) || [];

  // Sort rewards based on selected sort option
  const sortedRewards = [...filteredRewards].sort((a, b) => {
    if (sortBy === "name") {
      return a.reward_name.localeCompare(b.reward_name);
    }

    const aMinCost = a.variations && a.variations.length > 0
      ? a.variations[0].points_cost
      : 0;
    const bMinCost = b.variations && b.variations.length > 0
      ? b.variations[0].points_cost
      : 0;

    if (sortBy === "points-asc") {
      return aMinCost - bMinCost;
    } else {
      return bMinCost - aMinCost;
    }
  });

  const handleResetSearch = () => {
    setSearchQuery("");
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between w-full bg-white p-4 rounded-2xl border border-border/40 shadow-sm">
        {/* Search Input */}
        <div className="relative w-full sm:max-w-md group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4 group-focus-within:text-[#2D5A27] transition-colors" />
          <input
            type="text"
            placeholder={t("search_placeholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-secondary-light/40 border border-border/60 rounded-xl focus:outline-none focus:border-[#2D5A27]/60 focus:ring-2 focus:ring-[#2D5A27]/20 transition-all placeholder:text-muted-foreground"
          />
        </div>

        {/* Sort Trigger Select */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5 whitespace-nowrap shrink-0">
            <SlidersHorizontal size={13} />
            {t("custom_redesign.sort_by")}
          </span>
          <Select
            value={sortBy}
            onValueChange={(val: any) => setSortBy(val)}
          >
            <SelectTrigger className="w-full sm:w-[190px] bg-secondary-light/40 border border-border/60 hover:border-[#2D5A27]/40 focus:ring-[#2D5A27]/20 transition-all rounded-xl h-10 text-xs font-medium gap-2">
              <span className="flex items-center gap-1.5">
                <ArrowUpDown size={12} className="text-muted-foreground" />
                {sortBy === "name" && t("custom_redesign.sort_alphabetical")}
                {sortBy === "points-asc" && t("custom_redesign.sort_low_to_high")}
                {sortBy === "points-desc" && t("custom_redesign.sort_high_to_low")}
              </span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name" className="text-xs">{t("custom_redesign.sort_alphabetical")}</SelectItem>
              <SelectItem value="points-asc" className="text-xs">{t("custom_redesign.sort_low_to_high")}</SelectItem>
              <SelectItem value="points-desc" className="text-xs font-semibold text-[#2D5A27]">{t("custom_redesign.sort_high_to_low")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Grid Content Area */}
      {isLoading ? (
        <RewardCardSkeleton length={6} />
      ) : sortedRewards.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {sortedRewards.map((reward) => (
            <RewardCard
              key={reward.reward_id}
              reward={reward}
              userPoints={userPoints}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="w-full flex flex-col items-center justify-center py-16 px-6 text-center bg-white rounded-3xl border border-border/40 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-[#fef2f2] text-[#ef4444] flex items-center justify-center mb-4">
            <Trash2 size={24} />
          </div>
          <h3 className="text-lg font-bold text-foreground mb-1">
            {t("no_rewards.title")}
          </h3>
          <p className="text-sm text-muted-foreground max-w-sm mb-6 leading-relaxed">
            {searchQuery
              ? t("custom_redesign.search_no_results", { query: searchQuery })
              : t("no_rewards.description")}
          </p>
          {searchQuery && (
            <Button
              onClick={handleResetSearch}
              className="h-10 rounded-xl px-5 font-semibold bg-[#2D5A27] hover:bg-[#22441D] text-white shadow-sm"
            >
              {t("custom_redesign.reset_search")}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
