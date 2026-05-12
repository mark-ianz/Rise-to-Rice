import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TableData from "./TableData";
import { useGetRewards } from "@/hooks/query/useRewards";
import { useTranslation } from "react-i18next";
import TableRowSkeleton from "@/components/skeletons/analytics/TableRowSkeleton";
import GenericError from "@/components/general/GenericError";

export default function RewardsTable() {
  const { t } = useTranslation("redeem_rewards");
  const { data: rewards, isLoading } = useGetRewards({});

  if (!rewards && !isLoading) return <GenericError />;

  return (
    <div className="bg-white p-4 rounded-md max-sm:p-2">
      <Table className="max-md:text-xs">
        <TableCaption className="max-md:text-xs">{t("caption")}</TableCaption>
        <TableHeader>
          <TableRow className="w-full">
            <TableHead className="text-center">
              <p>{t("terms.reward")}</p>
            </TableHead>
            <TableHead className="text-center">{t("terms.quantity")}</TableHead>
            <TableHead className="text-center">
              {t("terms.points_cost")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRowSkeleton cell_count={3} row_count={6} />
          ) : (
            rewards?.result.map((reward, index) => (
              <TableRow key={index}>
                <TableData reward={reward} />
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
