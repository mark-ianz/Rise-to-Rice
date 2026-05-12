import { LogExchange } from "@/schema/LogExchange";
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
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["user_analytics", variables.user_id],
      });
      queryClient.invalidateQueries({
        queryKey: ["top_material", variables.user_id],
      });
    },
  });
}
