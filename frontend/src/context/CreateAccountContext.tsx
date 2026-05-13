import { CreateAccountState, Gender } from "@/types/createAccount.type.tsx";
import { createContext, Dispatch, ReactNode, useReducer, useEffect } from "react";

type CreateAccountAction = {
  type: string;
  payload: string | boolean | Gender | Date | string[] | null;
};

const initialState = {
  first_name: "",
  middle_name: "",
  last_name: "",
  suffix: null,
  address: "",
  contact_number: "",
  birthdate: "",
  gender: "male" as Gender,
  email: "",
  password: "",
  confirm_password: "",
  error: null,
  success: "",
  loading: false,
};

type CreateContextType = {
  state: CreateAccountState;
  dispatch: Dispatch<CreateAccountAction>;
};

const CreateAccountContext = createContext<CreateContextType | undefined>(
  undefined
);

const createAccountReducer = (
  state: CreateAccountState,
  action: CreateAccountAction
): CreateAccountState => {
  switch (action.type) {
    case "SET_FIRST_NAME":
      return { ...state, first_name: action.payload as string };
    case "SET_MIDDLE_NAME":
      return { ...state, middle_name: action.payload as string };
    case "SET_LAST_NAME":
      return { ...state, last_name: action.payload as string };
    case "SET_SUFFIX":
      return { ...state, suffix: action.payload as string };
    case "SET_ADDRESS":
      return { ...state, address: action.payload as string };
    case "SET_CONTACT_NUMBER":
      return { ...state, contact_number: action.payload as string };
    case "SET_DATE_OF_BIRTH":
      return { ...state, birthdate: action.payload as Date };
    case "SET_EMAIL":
      return { ...state, email: action.payload as string };
    case "SET_GENDER":
      return { ...state, gender: action.payload as Gender };
    case "SET_PASSWORD":
      return { ...state, password: action.payload as string };
    case "SET_CONFIRM_PASSWORD":
      return { ...state, confirm_password: action.payload as string };
    case "SET_ERROR":
      return { ...state, error: action.payload as string[] };
    case "SET_SUCCESS":
      return { ...state, success: action.payload as string };
    case "SET_LOADING":
      return { ...state, loading: action.payload as boolean };
    default:
      return state;
  }
};

const getInitialState = (): CreateAccountState => {
  const savedState = localStorage.getItem("registerState");
  if (savedState) {
    try {
      const parsed = JSON.parse(savedState);
      return { ...initialState, ...parsed, error: null, success: "", loading: false };
    } catch (e) {
      console.error("Failed to parse saved registerState", e);
    }
  }
  return initialState;
};

const CreateAccountProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(createAccountReducer, getInitialState());

  useEffect(() => {
    localStorage.setItem("registerState", JSON.stringify(state));
  }, [state]);

  return (
    <CreateAccountContext.Provider value={{ state, dispatch }}>
      {children}
    </CreateAccountContext.Provider>
  );
};

export { CreateAccountProvider, CreateAccountContext };
