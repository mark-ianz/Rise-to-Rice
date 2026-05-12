import { TableRow, TableCell } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

export default function TableRowSkeleton({
  row_count,
  cell_count,
}: {
  row_count: number;
  cell_count: number;
}) {
  return Array.from({ length: row_count }).map((_, rowIndex) => (
    <TableRow className="text-center" key={rowIndex}>
      {Array.from({ length: cell_count }).map((_, cellIndex) => (
        <TableCell key={cellIndex}>
          <div className="flex justify-center items-center w-full">
            <Skeleton className="h-4 w-full max-w-52" />
          </div>
        </TableCell>
      ))}
    </TableRow>
  ));
}
