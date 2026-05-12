import { UserContext } from "@/context/UserContext";
import { useContext } from "react";

function useUserContext () {
  const context = useContext (UserContext);

  if (context === undefined) {
    throw new Error (
      "useUserContext must be used within a CreateAccountProvider"
    );
  }

  return context;
}

export default useUserContext;