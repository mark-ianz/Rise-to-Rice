export type Time =
  | "today"
  | "week"
  | "month"
  | "3_months"
  | "6_months"
  | "9_months"
  | "this_year"
  | "year"
  | "year_and_half"
  | "2_years"
  | "all_time";

export type TimeDisplay = {
  value: Time;
  label: string;
};
