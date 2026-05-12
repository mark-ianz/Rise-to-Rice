import { Time } from "../types/material";

export function getQueryDateFilter(date_filter: Time) {
  switch (date_filter) {
    case "today":
      return ">= CURDATE()";
    case "week":
      return ">= DATE_SUB(CURDATE(), INTERVAL 1 WEEK)";
    case "month":
      return ">= DATE_SUB(CURDATE(), INTERVAL 1 MONTH)";
    case "3_months":
      return ">= DATE_SUB(CURDATE(), INTERVAL 3 MONTH)";
    case "6_months":
      return ">= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)";
    case "9_months":
      return ">= DATE_SUB(CURDATE(), INTERVAL 9 MONTH)";
    case "this_year":
      return "BETWEEN DATE_FORMAT(CURDATE(), '%Y-01-01') AND CURDATE()";
    case "year":
      return ">= DATE_SUB(CURDATE(), INTERVAL 1 YEAR)";
    case "year_and_half":
      return ">= DATE_SUB(CURDATE(), INTERVAL 1.5 YEAR)";
    case "2_years":
      return ">= DATE_SUB(CURDATE(), INTERVAL 2 YEAR)";
    case "all_time":
      return ">= 1";
    default:
      return ">= 1";
  }
}
