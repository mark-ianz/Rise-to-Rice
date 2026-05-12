import { UserSearchResult } from "@/types/search";
import { UserProfile } from "@/types/user.type";
import { createContext, Dispatch, ReactNode, useReducer } from "react";

type Action = {
  type: "SET_RESULT" | "CLEAR_RESULT" | "SET_LOADING" | "SET_ERROR";
  payload: UserSearchResult | null | string ;
};

type StateType = {
  result: UserProfile[];
  hasNext: boolean;
  hasPrev: boolean;
  page: number;
  error: string | null;
  total_items: number;
};

type Context = {
  state: StateType;
  dispatch: Dispatch<Action>;
};

const SearchUserResultContext = createContext<Context | undefined>(undefined);

const initialState = {
  result: [],
  error: null,
  hasNext: false,
  hasPrev: false,
  page: 1,
  total_items: 0,
};

const searchUserResultReducer = (state: StateType, action: Action) => {
  switch (action.type) {
    case "SET_RESULT":
      return { ...state, ...(action.payload as UserSearchResult) };
    case "CLEAR_RESULT":
      return { ...initialState };
    case "SET_ERROR":
      return { ...state, error: action.payload as string };
    default:
      return state;
  }
};

function SearchUserResultProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(searchUserResultReducer, initialState);

  return (
    <SearchUserResultContext.Provider value={{ state, dispatch }}>
      {children}
    </SearchUserResultContext.Provider>
  );
}

export { SearchUserResultContext, SearchUserResultProvider };
