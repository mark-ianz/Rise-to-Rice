import { ActivityHistoryResponse } from "@/types/activity";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import axios from "axios";

interface UseUserActivityProps {
  userId: number | null | undefined;
  page?: number;
  limit?: number;
  type?: string;
  search?: string;
  status?: string[];
  startDate?: string;
  endDate?: string;
}

export function useGetUserActivity({ 
  userId, 
  page = 1, 
  limit = 10, 
  type,
  search,
  status,
  startDate,
  endDate
}: UseUserActivityProps) {
  return useQuery({
    queryKey: ["user-activity", userId, page, limit, type, search, status, startDate, endDate],
    queryFn: async () => {
      if (!userId) return null;
      const response = await axios.get<ActivityHistoryResponse>(`/api/activity/user/${userId}`, {
        params: {
          page,
          limit,
          type,
          search,
          status,
          startDate,
          endDate
        }
      });
      return response.data;
    },
    enabled: !!userId,
    placeholderData: keepPreviousData,
  });
}

export function useGetRedeemRequestByNanoId(nanoId: string | undefined) {
  return useQuery({
    queryKey: ["redeem-request-nano", nanoId],
    queryFn: async () => {
      if (!nanoId) return null;
      const response = await axios.get(`/api/redeem-request/activity/${nanoId}`);
      return response.data;
    },
    enabled: !!nanoId,
  });
}

export function useGetExchangeLogByNanoId(nanoId: string | undefined) {
  return useQuery({
    queryKey: ["exchange-log-nano", nanoId],
    queryFn: async () => {
      if (!nanoId) return null;
      const response = await axios.get(`/api/exchange/activity/${nanoId}`);
      return response.data;
    },
    enabled: !!nanoId,
  });
}
