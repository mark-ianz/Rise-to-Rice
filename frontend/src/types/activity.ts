import { PaginationResult } from "./pagination";

export interface ActivityLog {
  activity_type: 'exchange' | 'redeem';
  id: number;
  points: number;
  timestamp: string;
  updated_at?: string;
  material_name: string | null;
  weight: number | null;
  status: 'pending' | 'for pick up' | 'completed' | 'rejected' | 'cancelled' | null;
  reward_name: string | null;
  nano_id: string;
}

export interface ActivityHistoryResponse extends PaginationResult {
  result: ActivityLog[];
}
