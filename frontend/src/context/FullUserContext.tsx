import useUserContext from "@/hooks/useUserContext";
import { Gender } from "@/types/createAccount.type";
import { Role, UserProfile } from "@/types/user.type";
import axios from "axios";
import i18next from "i18next";
import {
  createContext,
  Dispatch,
  ReactNode,
  useEffect,
  useReducer,
} from "react";

type FullUserProfileAction = {
  type: "SET_FULL_USER_PROFILE" | "CLEAR_FULL_USER_PROFILE";
  payload: UserProfile;
};

const initialState = {
  account_id: 0,
  email: "",
  user_id: 0,
  first_name: "",
  middle_name: "",
  last_name: "",
  suffix: "",
  gender: "" as Gender,
  address: "",
  birthdate: "",
  contact_number: "",
  createdAt: "",
  role: "" as Role,
  preferred_language: undefined as "en" | "tl" | undefined,
};

type FullUserContextType = {
  state: UserProfile;
  dispatch: Dispatch<FullUserProfileAction>;
};

const FullUserContext = createContext<FullUserContextType | undefined>(
  undefined
);

const fullUserProfileReducer = (
  state: UserProfile,
  action: FullUserProfileAction
): UserProfile => {
  switch (action.type) {
    case "SET_FULL_USER_PROFILE":
      return { ...state, ...action.payload };
    case "CLEAR_FULL_USER_PROFILE":
      return { ...initialState };
    default:
      return state;
  }
};

const FullUserProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(fullUserProfileReducer, initialState);
  const { state: userState } = useUserContext();

  useEffect(() => {
    const fetchFullUserProfile = async () => {
      try {
        const response = await axios.get(`/api/user/${userState?.user_id}`, {
          withCredentials: true,
        });
        dispatch({ type: "SET_FULL_USER_PROFILE", payload: response.data });

        // Sync dynamic language preference from database on mount/refresh
        if (response.data?.preferred_language) {
          const savedLang = response.data.preferred_language;
          const currentLang = localStorage.getItem("i18nextLng") || i18next.language;
          if (savedLang !== currentLang) {
            i18next.changeLanguage(savedLang);
            localStorage.setItem("i18nextLng", savedLang);
          }
        }
      } catch {
        dispatch({ type: "CLEAR_FULL_USER_PROFILE", payload: initialState });
      }
    };

    fetchFullUserProfile();
  }, [userState?.user_id]);

  return (
    <FullUserContext.Provider value={{ state, dispatch }}>
      {children}
    </FullUserContext.Provider>
  );
};

export { FullUserProvider, FullUserContext };
