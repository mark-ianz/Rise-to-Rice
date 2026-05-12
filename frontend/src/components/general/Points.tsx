import { Points as PointsType } from "@/types/points";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Loading from "./Loading";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { formatNumberWithCommasAndDecimals } from "@/lib/format";

export default function Points({ className }: { className?: string }) {
  const { t } = useTranslation("redeem_rewards");

  const { data, isLoading } = useQuery({
    queryKey: ["user-points"],
    queryFn: async () => {
      const response = await axios.get<PointsType>("/api/points/");
      return response.data;
    },
  });

  return (
    <span className={cn("flex gap-1 items-center", className)}>
      <span>{t("points")}:</span>
      <span className="font-bold">
        {isLoading ? (
          <Loading size={16} />
        ) : (
          formatNumberWithCommasAndDecimals(data?.points_accumulated)
        )}
      </span>
    </span>
  );
}
