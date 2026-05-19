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
      image,
    }: {
      data: LogExchange;
      user_id: number;
      image?: File | null;
    }) => {
      const formData = new FormData();
      formData.append("user_id", String(user_id));
      formData.append("material_id", String(data.selectedMaterial.material_id));
      formData.append("weight", String(data.weight));
      formData.append("points_added", String(data.points));
      
      if (image) {
        formData.append("image", image);
      }

      await axios.post("/api/exchange/log", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
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
