import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { ReactNode } from "react";
import SearchPagination from "./SearchPagination";
import { SearchResultExtraProps } from "@/types/search";
import TableRowSkeleton from "@/components/skeletons/analytics/TableRowSkeleton";

export default function SearchResult({
  hasPrev,
  hasNext,
  result_length,
  table_heads,
  children,
  isLoading,
}: SearchResultExtraProps & { children: ReactNode }) {
  const hasResult = () => {
    if (result_length === 0) return false;
    if (hasNext || hasPrev) return true;
    return false;
  };

  return (
    <div className="p-4 shadow-md grow rounded-md border bg-white flex max-h-[50vh] flex-col overflow-hidden gap-6 max-lg:hidden">
      <Table className="max-lg:text-xs">
        <TableHeader>
          <TableRow>
            {table_heads.map((head, index) => (
              <TableHead className="text-center" key={index + head}>
                {head}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRowSkeleton cell_count={table_heads.length} row_count={10} />
          ) : (
            children
          )}
        </TableBody>
      </Table>
      {result_length === 0 && (
        <span className="grow flex items-center justify-center">
          <p className="text-center text-sm text-tertiary">No data Available</p>
        </span>
      )}
      <div className="flex flex-col items-start text-sm justify-end h-full grow text-tertiary">
        {hasResult() && <p>Found: {result_length}</p>}
        {(hasNext || hasPrev) && (
          <SearchPagination hasNext={hasNext} hasPrev={hasPrev} />
        )}
      </div>
    </div>
  );
}
