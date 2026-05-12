import { Reward } from "../schema/Reward";
import { RewardVariation } from "./reward-variation";

export type RewardAndVariation = Reward & {
  reward_id: number;
  variations: RewardVariation[];
};
