import { Login, LoginSchema } from "@/schema/LoginSchema";
import { UpdatePersonalInfoType } from "@/schema/UpdatePersonalInfoSchema";
import { searchUser } from "@/services/user.service";
import { SearchParamType, UserSearchResult } from "@/types/search";
import { UserProfile } from "@/types/user.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export function useSearchUser({
  page,
  search,
  searchFor,
  roles,
}: SearchParamType) {
  return useQuery({
    queryKey: ["users"],
    queryFn: () =>
      searchUser({
        page,
        search,
        searchFor,
        roles,
      }),
    placeholderData: (prev) => prev,
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["deleteUser"],
    mutationFn: async (user_id: number) => {
      await axios.delete("/api/user/" + user_id);

      return user_id;
    },
    onSuccess: (user_id: number) => {
      queryClient.setQueryData(["users"], (oldData: UserSearchResult) => {
        if (oldData) {
          return {
            ...oldData,
            result: oldData.result.filter(
              (user: UserProfile) => user.user_id !== user_id
            ),
          };
        }
        return oldData;
      });
    },
  });
}

export function useGetUser(user_id: number) {
  return useQuery({
    queryKey: ["user", user_id],
    queryFn: async () => {
      const result = await axios.get<UserProfile[]>(`/api/user/${user_id}`);
      if (!result.data[0]) {
        throw new Error("User not found");
      }
      return result.data[0];
    },
    refetchOnWindowFocus: false,
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      updatedUser,
      user_id,
    }: {
      updatedUser: UpdatePersonalInfoType;
      user_id: number;
    }) => {
      const result = await axios.put<UserProfile>(
        `/api/user/${user_id}`,
        updatedUser
      );
      return result.data;
    },
    // this will trigger once the mutate function was called
    onSuccess: async (updatedUser) => {
      // this will set the cache data to the updated user data
      // used for optimistic update
      queryClient.setQueryData(
        ["user", updatedUser.user_id],
        (oldUser: UpdatePersonalInfoType) => ({
          ...oldUser,
          ...updatedUser,
        })
      );
    },
    // this will trigger once the mutation was successful
    // it will refetch the user data to get the updated data
  });
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      role_id,
      user_id,
    }: {
      role_id: number;
      user_id: number;
    }) => {
      const result = await axios.put<UserProfile>(
        `/api/user/update_role/${user_id}/${role_id}`
      );
      return result.data;
    },
    onSuccess: async (updatedUser) => {
      queryClient.setQueryData(["users"], (oldUser: UserSearchResult) => {
        if (!oldUser) return oldUser;

        const updatedUsers = oldUser.result.map((user: UserProfile) => {
          if (user.user_id === updatedUser.user_id) {
            return { ...user, role: updatedUser.role };
          }
          return user;
        });

        return {
          ...oldUser,
          result: updatedUsers,
        };
      });
    },
  });
}

export function useLogin() {
  return useMutation({
    mutationFn: async (data: Login) => {
      const validated = LoginSchema.parse(data);

      const response = await axios.post("/api/auth/login", validated);

      return response.data;
    },
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: async ({
      password,
      email,
      reset_token,
    }: {
      password: string;
      email: string;
      reset_token: string;
    }) => {
      const result = await axios.put<UserProfile>(`/api/user/reset-password`, {
        email,
        password,
        reset_token,
      });
      return result.data;
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: async ({
      old_password,
      new_password,
      user_id
    }: {
      old_password: string;
      new_password: string;
      user_id: number;
    }) => {
      const result = await axios.put<UserProfile>(`/api/user/change-password/${user_id}`, {
        password: old_password,
        new_password,
      });
      return result.data;
    },
  });
}
