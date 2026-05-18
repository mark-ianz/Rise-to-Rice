import { queryKeys } from "@/lib/queryKeys";
import { Announcement, AnnouncementPagination, AnnouncementQueryResponse } from "@/types/announcements";
import { UserProfile } from "@/types/user.type";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export function usePostAnnouncement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["postAnnouncement"],
    mutationFn: async (data: FormData) => {
      const response = await axios.post<Announcement>(
        "/api/announcements",
        data
      );
      return response.data;
    },
    onSuccess: (newAnnouncement) => {
      queryClient.setQueriesData(
        { queryKey: ["announcements"] },
        (oldData: AnnouncementPagination | undefined) => {
          if (!oldData) return oldData;

          const firstPage = oldData.pages[0];

          const updatedFirstPage = {
            ...firstPage,
            result: [newAnnouncement, ...firstPage.result],
          };

          return {
            ...oldData,
            pages: [updatedFirstPage, ...oldData.pages.slice(1)],
          };
        }
      );
      queryClient.invalidateQueries({
        queryKey: queryKeys.recentAnnouncements(),
      });
    }
  });
}
  
export function useGetAnnouncements(sort: string) {
  return useInfiniteQuery({
    queryKey: queryKeys.announcements(sort),
    queryFn: async ({pageParam}) => {
      const response = await axios.get<AnnouncementQueryResponse>(
        `/api/announcements?limit=5&page=${pageParam}&sort=${sort}`
      );
      return response.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.result.length === 0) return undefined;
      return pages.length + 1;
    },
  });
}

/* export function useGetAnnouncements() {
  return useQuery({
    queryKey: ["announcements"],
    queryFn: async () => {
      const response = await axios.get<AnnouncementQueryResponse>(
        "/api/announcements?limit=10"
      );
      return response.data;
    },
  });
} */

export function useGetRecentAnnouncements() {
  return useQuery<AnnouncementQueryResponse>({
    queryKey: queryKeys.recentAnnouncements(),
    queryFn: async () => {
      const response = await axios.get("/api/announcements/", {
        params: {
          limit: 5,
          order: "desc",
        },
      });
      return response.data;
    },
  });
}

export function useGetAuthor(announcement_id: number) {
  return useQuery({
    queryKey: queryKeys.author(announcement_id),
    queryFn: async () => {
      const response = await axios.get<UserProfile[]>(
        `/api/announcements/get-author/${announcement_id}`
      );

      if (!response.data[0]) {
        return null;
      }

      return response.data[0];
    },
  });
}

export function useDeleteAnnouncement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["deleteAnnouncement"],
    mutationFn: async (announcement_id: number) => {
      const response = await axios.delete(
        `/api/announcements/${announcement_id}`
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["announcements"],
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.recentAnnouncements(),
      });
    },
  });
}

export function useGetSingleAnnouncement(id: number) {
  return useQuery<Announcement>({
    queryKey: queryKeys.announcement(id),
    queryFn: async () => {
      const response = await axios.get(`/api/announcements/${id}`);
      return response.data;
    },
  });
}

export function useUpdateAnnouncement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updateAnnouncement"],
    mutationFn: async (data: FormData) => {
      const id = data.get("announcement_id");
      const response = await axios.put<Announcement>(
        `/api/announcements/${id}`,
        data
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      const id = variables.get("announcement_id");
      const announcement_id = id ? Number(id) : 0;
      queryClient.invalidateQueries({
        queryKey: ["announcements"],
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.recentAnnouncements(),
      });
      if (announcement_id) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.announcement(announcement_id),
        });
      }
    },
  });
}
