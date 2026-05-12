import axios from "axios";
import useUserContext from "./useUserContext";
import { useNavigate } from "react-router-dom";

export default function useLogout() {
  const { dispatch } = useUserContext();
  const navigate = useNavigate();

  const logout = async () => {
    await axios.post("/api/auth/logout");
    dispatch({ type: "LOGOUT", payload: null });
    navigate("/");
  };

  return logout;
}
