import { SearchUserResultContext } from "@/context/SearchUserResultContext";
import { useContext } from "react";

export default function useSearchUserResultContext() {
  const context = useContext(SearchUserResultContext);

  if (context === undefined) {
    throw new Error(
      "useSearchUserResultContext must be used within a SearchUserResultProvider"
    );
  }

  return context;
}