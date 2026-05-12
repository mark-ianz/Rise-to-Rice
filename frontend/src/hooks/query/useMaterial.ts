import { AddMaterial, EditMaterial } from "@/schema/Material";
import { Category, Material } from "@/types/materials";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export function useGetCategories() {
  return useQuery({
    queryKey: ["material-categories"],
    queryFn: async () => {
      const result = await axios.get<Category[]>("/api/material/categories");

      return result.data;
    },
  });
}

export function useAddMaterial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["add-material"],
    mutationFn: async (data: AddMaterial) => {
      const response = await axios.post<Material>("/api/material/", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["material-categories"],
      });
    },
  });
}

export function useEditMaterial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["edit-material"],
    mutationFn: async (data: EditMaterial) => {
      await axios.put("/api/material/" + data.material_id, {
        material: data.material,
        points_per_kg: data.points_per_kg,
      });

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["material-categories"],
      });
    },
  });
}

export function useDeleteMaterial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["delete-material"],
    mutationFn: async (material_id: string | number) => {
      await axios.delete(`/api/material/${material_id}`);

      return material_id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["material-categories"],
      });
    },
  });
}

export function useAddCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["add-category"],
    mutationFn: async (data: { category: string }) => {
      const response = await axios.post<Category>(
        "/api/material/categories",
        data
      );
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(
        ["material-categories"],
        (oldData: Category[] | undefined) => {
          if (!oldData) return;
          return [...oldData, {...data, types: []}];
        }
      );
    },
  });
}

export function useDeleteCategory () {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["delete-category"],
    mutationFn: async (category_id: string | number) => {
      await axios.delete(`/api/material/categories/${category_id}`);

      return category_id;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(
        ["material-categories"],
        (oldData: Category[] | undefined) => {
          if (!oldData) return;
          return oldData.filter((category) => category.category_id !== data);
        }
      );
    },
  });
}