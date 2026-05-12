import { LogExchange } from "@/schema/LogExchange";
import { queryKeys } from "@/lib/queryKeys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export function useLogExchange() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["log-exchange"],
    mutationFn: async ({
      data,
      user_id,
    }: {
      data: LogExchange;
      user_id: number;
    }) => {
      await axios.post("/api/exchange/log", {
        user_id: user_id,
        material_id: data.selectedMaterial.material_id,
        weight: Number(data.weight),
        points_added: data.points,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user_analytics"],
      });
      queryClient.invalidateQueries({
        queryKey: ["top_material"],
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.dashboardAnalytics("all_time"),
      });
    },
  });
}
