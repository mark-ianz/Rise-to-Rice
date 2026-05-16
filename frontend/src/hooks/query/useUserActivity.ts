import { ActivityHistoryResponse } from "@/types/activity";
import { useQuery } from "@tanstack/react-query";
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
  });
}
