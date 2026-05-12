import { useSearchParams } from "react-router-dom";

export function useGetSearchParams() {
  const [searchParams] = useSearchParams();

  const search = searchParams.get("search");
  const searchFor = searchParams.get("searchFor");
  const page = parseInt(searchParams.get("page") || "1");

  return { page, search, searchFor };
}
