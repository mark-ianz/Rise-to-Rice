import { Category, Material, UnitConversion } from "@/types/materials";
import { createContext, Dispatch, ReactNode, useReducer } from "react";



type LogExchangeState = {
  selectedCategory: Category;
  selectedMaterial: Material;
  weight: string;
  unit: UnitConversion;
  points: number;
  error: string[];
};

type LogExchangeAction =
  | { type: "SET_SELECTED_CATEGORY"; payload: Category }
  | { type: "SET_SELECTED_MATERIAL"; payload: Material }
  | { type: "SET_WEIGHT"; payload: string }
  | { type: "SET_UNIT"; payload: UnitConversion }
  | { type: "SET_POINTS"; payload: number }
  | { type: "RESET" }
  | { type: "SET_ERROR"; payload: string[] }
  | { type: "CLEAR_ERROR" };

type ContextType = {
  state: LogExchangeState;
  dispatch: Dispatch<LogExchangeAction>;
};

const LogExchangeContext = createContext<ContextType | undefined>(undefined);

const initialState: LogExchangeState = {
  selectedCategory: {
    category_id: 0,
    category: "",
    types: [],
  },
  selectedMaterial: {
    material_id: 0,
    material: "",
    points_per_kg: 0,
  },
  weight: "",
  unit: { unit: "kg", conversion: 1 },
  points: 0,
  error: [],
};

const logExchangeReducer = (
  state: LogExchangeState,
  action: LogExchangeAction
) => {
  switch (action.type) {
    case "SET_SELECTED_CATEGORY":
      return {
        ...state,
        selectedCategory: action.payload,
      };
    case "SET_SELECTED_MATERIAL":
      return {
        ...state,
        selectedMaterial: action.payload,
      };
    case "SET_WEIGHT":
      return {
        ...state,
        weight: action.payload,
      };
    case "SET_UNIT":
      return {
        ...state,
        unit: action.payload,
      };
    case "SET_POINTS":
      return {
        ...state,
        points: action.payload,
      };
    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
      };
    case "CLEAR_ERROR":
      return {
        ...state,
        error: [],
      };
    case "RESET":
      return initialState;
    default:
      return state;
  }
};

function LogExchangeProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(logExchangeReducer, initialState);

  return (
    <LogExchangeContext.Provider value={{ state, dispatch }}>
      {children}
    </LogExchangeContext.Provider>
  );
}

export { LogExchangeProvider, LogExchangeContext };
