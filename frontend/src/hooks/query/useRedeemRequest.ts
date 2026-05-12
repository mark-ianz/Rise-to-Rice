import { getRedeemRequest } from "@/services/redeem-request.service";
import { Points } from "@/types/points";
import {
  RedeemRequest,
  RedeemRequestHistoryResponse,
  RedeemRequestResponse,
} from "@/types/redeem-request";
import { SearchParamType } from "@/types/search";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export function useGetRedeemRequest({
  page,
  search,
  searchFor,
  status,
}: SearchParamType) {
  return useQuery({
    queryKey: ["redeem-request"],
    queryFn: () =>
      getRedeemRequest({
        page,
        search,
        searchFor,
        status,
      }),
    placeholderData: (prev) => prev,
  });
}

export function useUpdateRedeemRequestStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updateStatus"],
    mutationFn: async ({
      new_status,
      id,
      email,
      points_cost,
      user_id,
      current_status,
    }: {
      new_status: string;
      id: number;
      email?: string;
      points_cost?: number;
      user_id?: number;
      current_status?: string;
    }) => {
      await axios.put("/api/redeem-request/status/" + id, {
        new_status,
        email,
        points_cost,
        user_id,
        current_status,
      });

      return id;
    },
    onSuccess: (_, variables) => {
      queryClient.setQueryData(
        ["redeem-request"],
        (oldData: RedeemRequestResponse) => {
          if (!oldData) return;
          const updatedData = oldData.result.map((rr: RedeemRequest) => {
            if (rr.redeem_request_id === variables.id) {
              return { ...rr, status: variables.new_status };
            }
            return rr;
          });
          return { ...oldData, result: updatedData };
        }
      );
    },
  });
}

export function useDeleteRedeemRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["deleteRequest"],
    mutationFn: async (id: string | number) => {
      await axios.delete("/api/redeem-request/" + id);
    },
    onSuccess: (_, variables) => {
      queryClient.setQueryData(
        ["redeem-request"],
        (oldData: RedeemRequestResponse) => {
          if (!oldData) return;
          const updatedData = oldData.result.filter(
            (rr: RedeemRequest) => rr.redeem_request_id !== variables
          );
          return { ...oldData, result: updatedData };
        }
      );
    },
  });
}

export function useGetRedeemHistory({
  status,
  page,
  endpoint,
}: SearchParamType & { endpoint: string }) {
  return useQuery({
    queryKey: ["redeem-history"],
    queryFn: async () => {
      const response = await axios.get<RedeemRequestHistoryResponse>(endpoint, {
        params: {
          status,
          limit: 12,
          page,
        },
      });

      return response.data;
    },
  });
}

export function useCancelRedeemRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      request_id,
      points_cost,
    }: {
      request_id: number;
      points_cost: number;
    }) => {
      await axios.put("/api/redeem-request/cancel/" + request_id, {
        points_cost,
      });
      return { request_id, points_cost };
    },
    onSuccess: ({ request_id, points_cost }) => {
      queryClient.setQueryData(
        ["redeem-history"],
        (oldData: RedeemRequestHistoryResponse) => {
          if (!oldData) return;
          const updatedData = oldData.result.map((rr) => {
            if (rr.redeem_request_id === request_id) {
              return { ...rr, status: "cancelled" };
            }
            return rr;
          });
          return { ...oldData, result: updatedData };
        }
      );
      queryClient.setQueryData(["user-points"], (oldData: Points) => {
        if (!oldData) return;
        return {
          ...oldData,
          points_accumulated: oldData.points_accumulated + points_cost,
        };
      });
    },
  });
}
