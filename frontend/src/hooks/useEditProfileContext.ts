import { EditProfileContext } from "@/context/EditProfileContext";
import { useContext } from "react";

export default function useEditProfileContext () {
  const context = useContext(EditProfileContext);
  if (!context) {
    throw new Error('useEditProfileContext must be used within a EditProfileProvider')
  }
  return context;
}