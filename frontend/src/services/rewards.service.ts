import { RewardAndVariationResponse } from "@/types/rewards";
import { SearchParamType } from "@/types/search";
import axios from "axios";

export async function getRewards({
  page,
  search,
  searchFor,
  isAdmin,
}: SearchParamType) {
  const result = await axios.get<RewardAndVariationResponse>("/api/reward", {
    params: {
      page,
      search,
      searchFor,
      limit: 50,
      isAdmin
    },
  });
  return result.data;
}
