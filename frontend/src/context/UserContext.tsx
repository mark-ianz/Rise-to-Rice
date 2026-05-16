import { UserInitialState } from "@/types/user.type";
import axios from "axios";
import {
  createContext,
  Dispatch,
  ReactNode,
  useEffect,
  useReducer,
  useState,
} from "react";

type UserAction = {
  type: string;
  payload: UserInitialState | null;
};

type UserContextType = {
  state: UserInitialState;
  dispatch: Dispatch<UserAction>;
  isLoading: boolean;
  refetchAuth: () => Promise<void>;
};

const initialState = {
  account_id: null,
  email: null,
  isAdmin: null,
  role: null,
  user_id: null,
};

const UserContext = createContext<UserContextType | undefined>(undefined);

const userReducer = (
  state: UserInitialState,
  action: UserAction
): UserInitialState => {
  switch (action.type) {
    case "LOGIN":
      return action.payload as UserInitialState;
    case "LOGOUT":
      return initialState;
    default:
      return state;
  }
};

const UserProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const response = await axios.get("/api/auth/check");

      dispatch({ type: "LOGIN", payload: response.data });
    } catch {
      dispatch({ type: "LOGOUT", payload: initialState });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const refetchAuth = checkAuth;

  return (
    <UserContext.Provider value={{ state, dispatch, isLoading, refetchAuth }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserProvider, UserContext };
