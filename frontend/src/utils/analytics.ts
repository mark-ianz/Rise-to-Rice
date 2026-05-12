import { ChartType, MaterialAnalytics } from "@/types/analytics";
import { Time } from "@/types/time";

export function getMaterialTotalWeight(material: MaterialAnalytics[]) {
  return material.reduce((acc, curr) => acc + curr.total_weight, 0).toFixed(2);
}

export function getDisplayTime(time: Time) {
  switch (time) {
    case "today":
      return "Today";
    case "week":
      return "Week";
    case "month":
      return "Month";
    case "3_months":
      return "3 Months";
    case "6_months":
      return "6 Months";
    case "9_months":
      return "9 Months";
    case "this_year":
      return "This Year";
    case "year":
      return "Year";
    case "year_and_half":
      return "Year and Half";
    case "2_years":
      return "2 Years";
    case "all_time":
      return "All Time";
    default:
      return "Today";
  }
}

export function getDisplayChart(chartType: ChartType) {
  switch (chartType) {
    case "pie_chart":
      return "Pie Chart";
    case "bar_chart":
      return "Bar Chart";
    default:
      return "Pie Chart";
  }
}
