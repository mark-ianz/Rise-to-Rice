import { Pagination } from "./pagination";

export interface ActivityLog {
  activity_type: 'exchange' | 'redeem';
  id: number;
  points: number;
  timestamp: string;
  material_name: string | null;
  weight: number | null;
  status: 'pending' | 'for pick up' | 'completed' | 'rejected' | 'cancelled' | null;
  reward_name: string | null;
}

export interface ActivityHistoryResponse extends Pagination {
  result: ActivityLog[];
}
