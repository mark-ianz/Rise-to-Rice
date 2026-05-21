import { SearchParamType } from "@/types/search";
import { Time } from "@/types/time";

function normalizeArray(values?: string[]) {
  if (!values || values.length === 0) {
    return [];
  }

  return [...values].sort();
}

export function createSearchParamsKey(params: {
  page?: number;
  search?: string | null;
  searchFor?: string | null;
  roles?: string[];
  status?: string[];
  isAdmin?: string;
}) {
  return {
    page: params.page ?? 1,
    search: params.search ?? "",
    searchFor: params.searchFor ?? "",
    roles: normalizeArray(params.roles),
    status: normalizeArray(params.status),
    isAdmin: params.isAdmin ?? "",
  };
}

export const queryKeys = {
  users: (params: SearchParamType) =>
    ["users", createSearchParamsKey(params)] as const,
  user: (userId: number) => ["user", userId] as const,
  announcements: (sort: string, flare?: string) => ["announcements", { sort, flare: flare ?? "" }] as const,
  recentAnnouncements: () => ["recent_announcements"] as const,
  announcement: (id: string | number) => ["announcement", id] as const,
  author: (announcementId: string | number) => ["author", announcementId] as const,
  redeemRequests: (params: SearchParamType) =>
    ["redeem-request", createSearchParamsKey(params)] as const,
  redeemHistory: ({
    endpoint,
    page,
    status,
  }: {
    endpoint: string;
    page?: number;
    status?: string[];
  }) =>
    [
      "redeem-history",
      {
        endpoint,
        page: page ?? 1,
        status: normalizeArray(status),
      },
    ] as const,
  rewards: (params: SearchParamType) =>
    ["rewards", createSearchParamsKey(params)] as const,
  topMaterial: ({
    userId,
    time,
  }: {
    userId?: number | null;
    time: Time;
  }) => ["top_material", { userId: userId ?? null, time }] as const,
  userAnalytics: ({
    userId,
    time,
  }: {
    userId?: number | null;
    time: Time;
  }) => ["user_analytics", { userId: userId ?? null, time }] as const,
  dashboardAnalytics: (time: Time) =>
    ["dashboard_analytics", { time }] as const,
  userPoints: () => ["user-points"] as const,
};
