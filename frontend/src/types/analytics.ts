export type MaterialAnalytics = {
  material_id: number;
  material: string;
  total_points: number;
  total_weight: number;
  weight_percentage: number;
};

export type UserAnalytics = {
  user_id: number;
  total_points: number;
  total_exchange_count: number;
};

export type ChartData = {
  material: string;
  weight: number;
  weight_percentage: number;
  fill: string;
}[];

export type ChartType = "pie_chart" | "bar_chart";

export type ChartValueLabel = {
  value: ChartType;
  label: string;
};

export type DashboardAnalytics = {
  total_users: number;
  total_weight: number;
  top_material: {
    material: string;
    weight: number;
  };
  total_exchanges: number;
  total_points: number;
  total_announcements: number;
};
