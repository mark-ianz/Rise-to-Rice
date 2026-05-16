import { MaterialAnalytics } from "@/types/analytics";
import { Leaf, Droplets, Zap, Wind } from "lucide-react";
import { useMemo } from "react";

type Props = {
  data: MaterialAnalytics[];
};

export default function EnvironmentalImpact({ data }: Props) {
  const impact = useMemo(() => {
    let totalCo2 = 0;
    let totalTrees = 0;
    let totalEnergy = 0;
    let totalWater = 0;

    data.forEach((item) => {
      const weight = item.total_weight;
      const material = item.material.toLowerCase();

      if (material.includes("paper") || material.includes("cardboard")) {
        totalTrees += weight * 0.017;
        totalCo2 += weight * 1.2;
        totalEnergy += weight * 4;
        totalWater += weight * 26; // Liters
      } else if (material.includes("plastic") || material.includes("pet")) {
        totalCo2 += weight * 1.5;
        totalEnergy += weight * 5.7;
      } else if (material.includes("metal") || material.includes("aluminum") || material.includes("can") || material.includes("copper")) {
        totalCo2 += weight * 9;
        totalEnergy += weight * 14;
      } else if (material.includes("glass")) {
        totalCo2 += weight * 0.3;
        totalEnergy += weight * 0.4;
      } else {
        // General defaults
        totalCo2 += weight * 0.8;
        totalEnergy += weight * 2;
      }
    });

    return {
      co2: totalCo2.toFixed(1),
      trees: totalTrees.toFixed(1),
      energy: totalEnergy.toFixed(1),
      water: totalWater.toFixed(0),
    };
  }, [data]);

  const impactMetrics = [
    {
      label: "CO2 Diverted",
      value: `${impact.co2} kg`,
      icon: <Wind size={20} className="text-sky-500" />,
      description: "Greenhouse gases prevented from entering the atmosphere.",
      color: "bg-sky-50"
    },
    {
      label: "Trees Saved",
      value: impact.trees,
      icon: <Leaf size={20} className="text-emerald-500" />,
      description: "Estimated number of trees preserved through paper recycling.",
      color: "bg-emerald-50"
    },
    {
      label: "Energy Saved",
      value: `${impact.energy} kWh`,
      icon: <Zap size={20} className="text-amber-500" />,
      description: "Power saved compared to producing new materials from scratch.",
      color: "bg-amber-50"
    },
    {
      label: "Water Preserved",
      value: `${impact.water} L`,
      icon: <Droplets size={20} className="text-blue-500" />,
      description: "Fresh water saved by recycling paper and cardboard products.",
      color: "bg-blue-50"
    }
  ];

  return (
    <div className="bg-white rounded-2xl p-6 border border-warm-tan/15 shadow-sm h-full">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-secondary-dark tracking-tight">
          Environmental Impact
        </h2>
        <p className="text-sm text-secondary-dark/50 mt-1">
          Your recycling efforts translated into real-world environmental benefits.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
        {impactMetrics.map((metric, index) => (
          <div key={index} className="flex flex-col gap-3 p-4 rounded-xl border border-warm-tan/10 hover:border-primary-main/20 transition-all group">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg ${metric.color} flex items-center justify-center`}>
                {metric.icon}
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-secondary-dark">{metric.value}</span>
                <span className="text-[10px] font-bold text-secondary-dark/40 uppercase tracking-wider">{metric.label}</span>
              </div>
            </div>
            <p className="text-[11px] text-secondary-dark/50 leading-relaxed group-hover:text-secondary-dark/70 transition-colors">
              {metric.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
