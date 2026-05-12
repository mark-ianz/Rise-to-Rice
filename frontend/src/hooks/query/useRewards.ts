import { Info } from "@/components/page-components/dashboard/rewards/SaveVariationItem";
import { queryKeys } from "@/lib/queryKeys";
import { CreateRedeemRequest } from "@/schema/RedeemRequest";
import { getRewards } from "@/services/rewards.service";
import { Points } from "@/types/points";
import {
  RedeemRequestHistory,
} from "@/types/redeem-request";
import {
  Reward,
  RewardAndVariationResponse,
  RewardVariation,
  Unit,
} from "@/types/rewards";
import { SearchParamType } from "@/types/search";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export function useGetRewards({
  page,
  search,
  searchFor,
  isAdmin,
}: SearchParamType) {
  return useQuery({
    queryKey: queryKeys.rewards({
      page,
      search,
      searchFor,
      isAdmin,
    }),
    queryFn: () =>
      getRewards({
        page,
        search,
        searchFor,
        isAdmin,
      }),
    placeholderData: (prev) => prev,
  });
}

export function useAddReward() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { reward_name: string; unit: Unit }) => {
      const response = await axios.post<RewardVariation>("/api/reward", data);

      return response.data;
    },
    onSuccess: (data) => {
      queryClient.setQueriesData(
        { queryKey: ["rewards"] },
        (oldData: RewardAndVariationResponse | undefined) => {
          if (!oldData) return data;
          return {
            ...oldData,
            result: [...oldData.result, data],
          };
        }
      );
    },
  });
}

export function useEditReward() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["edit-reward"],
    mutationFn: async (reward: Reward) => {
      await axios.put("/api/reward/" + reward.reward_id, {
        reward_name: reward.reward_name,
        unit: reward.unit,
      });

      return reward;
    },
    onSuccess: (reward) => {
      queryClient.setQueriesData(
        { queryKey: ["rewards"] },
        (oldData: RewardAndVariationResponse | undefined) => {
          if (!oldData) return oldData;
          const newResult = oldData.result.map((r) => {
            if (r.reward_id === reward.reward_id) {
              return {
                ...r,
                reward_name: reward.reward_name,
                unit: reward.unit,
              };
            }
            return r;
          });
          return { ...oldData, result: newResult };
        }
      );
    },
  });
}

export function useDeleteReward() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["delete-reward"],
    mutationFn: async (reward_id: string | number) => {
      await axios.delete(`/api/reward/${reward_id}`);

      return reward_id;
    },
    onSuccess: (reward_id) => {
      queryClient.setQueriesData(
        { queryKey: ["rewards"] },
        (oldData: RewardAndVariationResponse | undefined) => {
          if (!oldData) return oldData;
          const newResult = oldData.result.filter(
            (reward) => reward.reward_id !== reward_id
          );
          return { ...oldData, result: newResult };
        }
      );
    },
  });
}

export function useAddRewardVariation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["addVariation"],
    mutationFn: async (data: {
      quantity: string;
      pointsCost: string;
      reward_id: number;
    }) => {
      await axios.post("/api/reward-variation/", {
        reward_id: data.reward_id,
        quantity: Number(data.quantity),
        points_cost: Number(data.pointsCost),
      });

      return data;
    },
    onSuccess: () => {
      // invalidated the data instead of using setQueryData to update the data
      // because it's too complicated to update the data
      // and it's better to just refetch the data
      queryClient.invalidateQueries({
        queryKey: ["rewards"],
      });
    },
  });
}

export function useEditRewardVariation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["saveVariation"],
    mutationFn: async (info: Info) => {
      await axios.put("/api/reward-variation/" + info.id, info);
    },
    onSuccess: () => {
      // invalidated the data instead of using setQueryData to update the data
      // because it's too complicated to update the data
      // and it's better to just refetch the data
      queryClient.invalidateQueries({
        queryKey: ["rewards"],
      });
    },
  });
}

export function useDeleteVariation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["deleteVariation"],
    mutationFn: async (id: string | number) => {
      await axios.delete("/api/reward-variation/" + id);
    },
    onSuccess: () => {
      // invalidated the data instead of using setQueryData to update the data
      // because it's too complicated to update the data
      // and it's better to just refetch the data
      queryClient.invalidateQueries({
        queryKey: ["rewards"],
      });
    },
  });
}

export function useRedeemRewards() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["redeem"],
    mutationFn: async (data: CreateRedeemRequest) => {
      const result = await axios.post<RedeemRequestHistory>(
        "/api/redeem-request/",
        data
      );

      return result.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["redeem-history"],
      });
      queryClient.setQueryData(queryKeys.userPoints(), (oldData: Points) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          points_accumulated:
            oldData.points_accumulated - variables.points_cost,
        };
      });
    },
  });
}
