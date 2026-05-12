import { LogExchangeContext } from "@/context/LogExchangeContext";
import { useContext } from "react";

export default function useLogExchangeContext () {
  const context = useContext(LogExchangeContext);
  if (!context) {
    throw new Error('useLogExchangeContext must be used within a useLogExchangeContextProvider');
  }
  return context;
}