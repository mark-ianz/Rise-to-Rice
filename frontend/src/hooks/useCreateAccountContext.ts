import { CreateAccountContext } from "@/context/CreateAccountContext";
import { useContext } from "react";

function useCreateAccountContext () {
  const context = useContext (CreateAccountContext);

  if (context === undefined) {
    throw new Error (
      "useCreateAccountContext must be used within a CreateAccountProvider"
    );
  }

  return context;
}

export default useCreateAccountContext;