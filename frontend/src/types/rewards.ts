import { PaginationResult } from "./pagination";

export type Reward = {
  reward_id: number;
  reward_name: string;
  unit: Unit;
};

export type RewardResult = PaginationResult & {
  result: (Reward & RewardVariation)[];
};

export type RewardVariation = {
  variation_id: number;
  reward_id: number;
  quantity: number;
  points_cost: number;
};

export type Unit =
  | "pc"
  | "g"
  | "kg"
  | "ml"
  | "l"
  | "lb"
  | "oz"
  | "cm"
  | "in"
  | "m"
  | "ft";

export type RewardAndVariation = Reward & {
  reward_id: number;
  variations: RewardVariation[];
};

export type RewardResponse = PaginationResult & {
  result: Reward[];
};
export type RewardAndVariationResponse = PaginationResult & {
  result: RewardAndVariation[];
};
