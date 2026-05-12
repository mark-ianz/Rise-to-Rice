import { Category } from "@/types/materials";
import DeleteData from "../DeleteData";
import { useDeleteCategory } from "@/hooks/query/useMaterial";

type Props = {
  category: Category;
};

export default function DeleteCategory({ category }: Props) {
  return (
    <DeleteData
      useMutation_hook={useDeleteCategory}
      description={`delete`}
      id={category.category_id}
      resource_name="category"
    >
      <p className="text-destructive underline cursor-pointer w-fit max-md:text-sm">Delete</p>
    </DeleteData>
  );
}


