import { PaginationResult } from "./pagination";
import { Role, UserProfile } from "./user.type";

export type UserSearchResult = PaginationResult & {
  result: UserProfile[];
};

export type SearchParamType = {
  endpoint?: string;
  page?: number;
  search?: string | null;
  searchFor?: string | null;
  status?: string[];
  isAdmin?: "true" | "false";
  roles?: Role[];
};

export type SearchResultExtraProps = {
  hasPrev?: boolean | undefined;
  hasNext?: boolean | undefined;
  result_length?: number | undefined;
  table_heads: string[];
  isLoading?: boolean;
};
