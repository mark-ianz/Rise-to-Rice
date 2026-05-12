import { Gender } from "@/types/createAccount.type";
import { EditProfile, UserProfile } from "@/types/user.type";
import { createContext, Dispatch, ReactNode, useReducer } from "react";

const initialState = {
  first_name: "",
  middle_name: "",
  last_name: "",
  suffix: null,
  gender: "" as Gender,
  address: "",
  contact_number: "",
  birthdate: "",
  isEditing: false,
  createdAt: "",
  error: [],
};

type EditProfileAction = {
  type: string;
  payload:
    | string
    | null
    | Gender
    | Date
    | boolean
    | undefined
    | EditProfile
    | string[];
};

type EditProfileState = {
  state: EditProfile;
  dispatch: Dispatch<EditProfileAction>;
};

const reducer = (
  state: EditProfile,
  action: EditProfileAction
): EditProfile => {
  switch (action.type) {
    case "SET_FIRST_NAME":
      return { ...state, first_name: action.payload as string };
    case "SET_MIDDLE_NAME":
      return { ...state, middle_name: action.payload as string };
    case "SET_LAST_NAME":
      return { ...state, last_name: action.payload as string };
    case "SET_SUFFIX":
      return { ...state, suffix: action.payload as string };
    case "SET_GENDER":
      return { ...state, gender: action.payload as Gender };
    case "SET_ADDRESS":
      return { ...state, address: action.payload as string };
    case "SET_CONTACT_NUMBER":
      return { ...state, contact_number: action.payload as string };
    case "SET_BIRTHDATE":
      return { ...state, birthdate: action.payload as Date };
    case "SET_IS_EDITING":
      return { ...state, isEditing: action.payload as boolean };
    case "SET_ERROR": 
      return {...state, error: action.payload as string[]}
    case "SET_ALL":
      return action.payload as UserProfile & { isEditing: boolean, error: string[] };
    default:
      return state;
  }
};

const EditProfileContext = createContext<EditProfileState | undefined>(
  undefined
);

const EditProfileProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <EditProfileContext.Provider value={{ state, dispatch }}>
      {children}
    </EditProfileContext.Provider>
  );
};

export { EditProfileProvider, EditProfileContext };
