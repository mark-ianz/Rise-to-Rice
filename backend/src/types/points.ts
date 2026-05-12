import { RowDataPacket } from "mysql2/promise";

export type Points = {
  points_id: number;
  points_accumulated: number;
  user_id: number;
};

export type PointsQuery = (Points & RowDataPacket)[];
