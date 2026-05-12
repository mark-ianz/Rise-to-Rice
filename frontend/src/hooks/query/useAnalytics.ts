import { get_total_weight, get_user_analytics } from "@/services/analytics.service";
import { queryKeys } from "@/lib/queryKeys";
import { DashboardAnalytics } from "@/types/analytics";
import { TimeDisplay } from "@/types/time";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

type AnalyticsProps = {
  user_id: number | undefined | null;
  time: TimeDisplay;
};

export function useGetTopMatetial({ user_id, time }: AnalyticsProps) {
  return useQuery({
    queryKey: queryKeys.topMaterial({
      userId: user_id,
      time: time.value,
    }),
    queryFn: () => get_total_weight(time.value, user_id),
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 5,
  });
}

export function useGetUserAnalytics({ user_id, time }: AnalyticsProps) {
  return useQuery({
    queryKey: queryKeys.userAnalytics({
      userId: user_id,
      time: time.value,
    }),
    queryFn: () => get_user_analytics(time.value, user_id),
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 5,
  });
}

export function useGetDashboard (time: TimeDisplay) {
  return useQuery<DashboardAnalytics>({
    queryKey: queryKeys.dashboardAnalytics(time.value),
    queryFn: async () => {
      const response = await axios.get("/api/analytics/dashboard", {
        params: {
          time: time.value,
        },
      });
      return response.data;
    },
  });
}
