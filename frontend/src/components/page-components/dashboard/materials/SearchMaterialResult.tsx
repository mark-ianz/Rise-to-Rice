import { TableCell, TableRow } from "@/components/ui/table";
import SearchResult from "../SearchResult";
import { material_result_theads } from "@/lib/const/theads";
import { useEffect } from "react";
import { useGetSearchParams } from "@/hooks/useGetSearchParams";
import { useGetCategories } from "@/hooks/query/useMaterial";
import GenericError from "@/components/general/GenericError";
import ViewMaterial from "./ViewMaterial";
import DeleteCategory from "./DeleteCategory";
import ValueWrapper from "../ValueWrapper";

export default function SearchMaterialResult() {
  const { search, searchFor, page } = useGetSearchParams();

  const { data: categories, isLoading, refetch } = useGetCategories();

  useEffect(() => {
    refetch();
  }, [refetch, search, searchFor, page]);

  if (!categories && !isLoading) return <GenericError />;

  if (!categories) return <p className="text-tertiary">No categories found</p>;

  return (
    <>
      <SearchResult isLoading={isLoading} table_heads={material_result_theads}>
        {categories!.map((category, index) => (
          <TableRow key={index} className="text-center max-lg:text-xs">
            <TableCell className="break-words">
              {category.category_id}
            </TableCell>
            <TableCell className="break-words">{category.category}</TableCell>
            <TableCell className="break-words">
              <ViewMaterial category={category} />
            </TableCell>
            <TableCell className="flex items-end justify-center">
              <DeleteCategory category={category} />
            </TableCell>
          </TableRow>
        ))}
      </SearchResult>
      <div className="hidden max-lg:flex flex-col gap-4">
        <ol className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
          {categories.map((category, index) => (
            <li
              key={`${index}-${category.category_id}`}
              className="flex flex-col bg-white rounded-md shadow-md"
            >
              <div className="border-b flex justify-between items-center p-4">
                <p className="font-semibold text-muted-foreground">
                  Category ID #{category.category_id}
                </p>
                <DeleteCategory category={category} />
              </div>
              <div className="p-2">
                <ValueWrapper label="Category" value={category.category} />
                <ValueWrapper
                  label="Type of Materials"
                  value={<ViewMaterial category={category} />}
                />
              </div>
            </li>
          ))}
        </ol>
      </div>
    </>
  );
}
