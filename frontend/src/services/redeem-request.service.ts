import { RedeemRequestResponse } from "@/types/redeem-request";
import { SearchParamType } from "@/types/search";
import axios from "axios";

export async function getRedeemRequest({
  page,
  search,
  searchFor,
  status,
}: SearchParamType) {
  const result = await axios.get<RedeemRequestResponse>("/api/redeem-request", {
    params: {
      page,
      search,
      searchFor,
      limit: 50,
      status,
    },
  });
  return result.data;
}
