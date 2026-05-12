import { FullUserContext } from "@/context/FullUserContext";
import { useContext } from "react";

export default function useFullUserContext () {
  const context = useContext(FullUserContext);
  if (!context) {
    throw new Error('useFullUserContext must be used within a useFullUserContextProvider');
  }
  return context;
}