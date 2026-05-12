import useUserContext from "@/hooks/useUserContext";
import { Gender } from "@/types/createAccount.type";
import { Role, UserProfile } from "@/types/user.type";
import axios from "axios";
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
  role: "" as Role
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
