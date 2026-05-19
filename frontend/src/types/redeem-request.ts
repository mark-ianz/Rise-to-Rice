import { PaginationResult } from "./pagination";
import { Unit } from "./rewards";

export type RedeemRequest = {
  redeem_request_id: number;
  user_id: number;
  status: Status;
  timestamp: Date;
  variation_id: number;
  quantity: number;
  points_cost: number;
  reward_id: number;
  reward_name: string;
  unit: Unit;
  email: string;
  contact_number: string;
  admin_notes?: string;
  cancel_reason?: string;
  nano_id?: string;
};

export type Status =
  | "pending"
  | "for pick up"
  | "completed"
  | "rejected"
  | "cancelled"
  | "working";

export type RedeemRequestResponse = PaginationResult & {
  result: RedeemRequest[];
};

export type RedeemRequestHistory = PaginationResult & {
  redeem_request_id: number
  user_id: number
  status: Status;
  timestamp: Date;
  variation_id: number
  quantity: number
  points_cost: number
  reward_id: number
  reward_name: string
  unit: Unit
  admin_notes?: string;
  cancel_reason?: string;
  nano_id?: string;
};

export type RedeemRequestHistoryResponse = PaginationResult & {
  result: RedeemRequestHistory[];
};
