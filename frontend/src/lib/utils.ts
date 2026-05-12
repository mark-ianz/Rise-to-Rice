import { ChartData, MaterialAnalytics } from "@/types/analytics";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { COLORS } from "./const";
import { Material, UnitConversion } from "@/types/materials";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getMaterialChartData(
  top_material: MaterialAnalytics[]
): ChartData {
  return top_material.map((item, index) => ({
    material: item.material,
    weight: item.total_weight,
    weight_percentage: item.weight_percentage,
    fill: COLORS[index % COLORS.length],
  }));
}

export function getMaterialChartConfig(top_material: MaterialAnalytics[]) {
  return {
    weight: {
      label: "Weight",
    },
    ...Object.fromEntries(
      top_material.map((item, index) => [
        `${item.material} (${item.total_weight}) kg`,
        {
          label: `${item.material} (${item.total_weight}) kg`,
          color: COLORS[index % COLORS.length],
        },
      ])
    ),
  };
}

export function calculatePoints(
  weight: number | string,
  unit: UnitConversion,
  selectedCategory: Material
) {
  const weightInKg = Number(weight) / unit.conversion;
  return ((selectedCategory?.points_per_kg || 0) * weightInKg).toFixed(
    2
  );
}

export function getUnit(unit: string): UnitConversion {
  switch (unit.toUpperCase()) {
    case "KG":
      return { unit: "kg", conversion: 1 };
    case "LB":
      return { unit: "lb", conversion: 2.20462 };
    case "G":
      return { unit: "g", conversion: 1000 };
    default:
      return { unit: "kg", conversion: 1 };
  }
}
