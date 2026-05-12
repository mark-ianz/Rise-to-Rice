import { PaginationResult } from "./pagination";
import { Unit } from "./rewards";

export type MaterialResponse = PaginationResult & {
  result: Material[];
};

export type Material = {
  material: string;
  points_per_kg: number;
  material_id: number;
};

export type Category = {
  category: string;
  category_id: number;
  types: Material[];
};

export type UnitConversion = {
  unit: Unit;
  conversion: number;
};
