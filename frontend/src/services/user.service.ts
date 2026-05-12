import { SearchParamType, UserSearchResult } from "@/types/search";
import axios from "axios";

export async function searchUser({
  page,
  search,
  searchFor,
  roles,
}: SearchParamType) {
  const response = await axios.get<UserSearchResult>("/api/user/search", {
    params: {
      page,
      limit: 50,
      search,
      searchFor,
      roles,
    },
  });
  return response.data;
}
