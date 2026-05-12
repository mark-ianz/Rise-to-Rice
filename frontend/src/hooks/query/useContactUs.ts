import { ContactUsResponse } from "@/types/contact_us";
import { SearchParamType } from "@/types/search";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export function useGetContactMessages({
  page,
  search,
  searchFor,
}: SearchParamType) {
  return useQuery({
    queryKey: ["contact-messages"],
    queryFn: async () => {
      const response = await axios.get<ContactUsResponse>("/api/contact-us", {
        params: {
          page,
          search,
          searchFor,
          limit: 50,
        },
      });

      if (!response.data) {
        throw new Error("No data found");
      }

      return response.data;
    },
  });
}

export function useUpdateContactMessageStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["update-contact-message"],
    mutationFn: async ({ id, new_status }: { id: number; new_status: string }) => {
      const response = await axios.put(`/api/contact-us/${id}`, {
        new_status,
      });

      if (!response.data) {
        throw new Error("No data found");
      }

      return response.data;
    },
    onSuccess: (_, variables) => {
      // Update the cache or perform any other side effects here
      queryClient.setQueryData(
        ["contact-messages"],
        (oldData: ContactUsResponse) => {
          if (!oldData) return;
          const updatedData = oldData.result.map((contactMessage) => {
            if (contactMessage.contact_id === variables.id) {
              return {
                ...contactMessage,
                status: variables.new_status,
                updatedAt: new Date(),
              };
            }
            return contactMessage;
          });
          return { ...oldData, result: updatedData };
        }
      );
    },
  });
}

export function useDeleteContactMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["delete-contact-message"],
    mutationFn: async (id: number) => {
      const response = await axios.delete(`/api/contact-us/${id}`);

      if (!response.data) {
        throw new Error("No data found");
      }

      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.setQueryData(
        ["contact-messages"],
        (oldData: ContactUsResponse) => {
          if (!oldData) return;
          const updatedData = oldData.result.filter(
            (contactMessage) => contactMessage.contact_id !== variables
          );
          return { ...oldData, result: updatedData };
        }
      );
    },
  });
}
