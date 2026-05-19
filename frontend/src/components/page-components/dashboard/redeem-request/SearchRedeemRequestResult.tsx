import { TableCell, TableRow } from "@/components/ui/table";
import { formatDate } from "date-fns";
import { capitalizeWordStart } from "@/lib/format";
import SearchResult from "../SearchResult";
import { search_redeem_request_result_theads } from "@/lib/const/theads";
import { useGetRedeemRequest } from "@/hooks/query/useRedeemRequest";
import { useEffect } from "react";
import { useGetSearchParams } from "@/hooks/useGetSearchParams";
import { useSearchParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import RedeemRequestActionButton from "./RedeemRequestActionButton";
import TooltipComponent from "@/components/general/TooltipComponent";
import HideViewText from "@/components/general/HideViewText";
import GenericError from "@/components/general/GenericError";
import SearchPagination from "../SearchPagination";
import ValueWrapper from "../ValueWrapper";

export default function SearchRedeemRequestResult() {
  const [searchParams, _] = useSearchParams();
  const status = searchParams.getAll("status");
  const { search, searchFor, page } = useGetSearchParams();

  const {
    data: redeem_request,
    isLoading,
    refetch,
  } = useGetRedeemRequest({
    page,
    search,
    searchFor,
    status,
  });

  useEffect(() => {
    refetch();
  }, [refetch, search, searchFor, page, status]);

  if (!redeem_request) return <GenericError />;

  return (
    <>
      <SearchResult
        hasNext={redeem_request?.hasNext}
        hasPrev={redeem_request?.hasPrev}
        result_length={redeem_request?.result.length}
        table_heads={search_redeem_request_result_theads}
        isLoading={isLoading}
      >
        {redeem_request?.result.map((rr, index) => (
          <TableRow key={index} className="text-center max-lg:text-xs">
            <TableCell>{rr.redeem_request_id}</TableCell>
            <TableCell>{rr.reward_name}</TableCell>
            <TableCell className="max-w-20 overflow-hidden text-ellipsis whitespace-nowrap">
              {rr.quantity} {rr.unit.toLocaleUpperCase()}
            </TableCell>
            <TableCell className="max-w-14 overflow-hidden text-ellipsis whitespace-nowrap">
              {rr.points_cost}
            </TableCell>
            <TableCell className="max-w-28 overflow-hidden text-ellipsis">
              <Badge className="font-normal" variant={rr.status as any}>
                {capitalizeWordStart(rr.status)}
              </Badge>
              {rr.status === "cancelled" && rr.cancel_reason && (
                <div className="text-[10px] text-red-500 mt-1 max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap" title={rr.cancel_reason}>
                  Reason: {rr.cancel_reason}
                </div>
              )}
              {rr.admin_notes && (
                <div className="text-[10px] text-blue-500 mt-1 max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap" title={rr.admin_notes}>
                  Notes: {rr.admin_notes}
                </div>
              )}
            </TableCell>
            <TableCell className="max-w-32">
              <HideViewText>{rr.email}</HideViewText>
            </TableCell>
            <TableCell>
              <HideViewText>{rr.contact_number}</HideViewText>
            </TableCell>
            <TooltipComponent
              content={formatDate(rr.timestamp, "MMM dd, y, h:mm a")}
            >
              <TableCell>
                {formatDate(rr.timestamp, "MMM dd, y, h:mm a")}
              </TableCell>
            </TooltipComponent>
            <TableCell>
              <RedeemRequestActionButton redeem_request={rr} />
            </TableCell>
          </TableRow>
        ))}
      </SearchResult>
      <div className="hidden max-lg:flex flex-col gap-4">
        <ol className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
          {redeem_request?.result.map((redeem_request, index) => (
            <li
              key={`${index}-${redeem_request.redeem_request_id}`}
              className="flex flex-col bg-white rounded-md shadow-md"
            >
              <div className="border-b flex justify-between items-center p-4">
                <p className="font-semibold text-muted-foreground">
                  Request ID #{redeem_request.redeem_request_id}
                </p>
                <RedeemRequestActionButton redeem_request={redeem_request} />
              </div>
              <div className="p-2">
                <ValueWrapper
                  label="Reward Name"
                  value={redeem_request.reward_name}
                />
                <ValueWrapper
                  label="Quantity"
                  value={`${
                    redeem_request.quantity
                  } ${redeem_request.unit.toLocaleUpperCase()}`}
                />
                <ValueWrapper
                  label="Points"
                  value={redeem_request.points_cost}
                />
                <ValueWrapper
                  label="Status"
                  value={
                    <div className="flex flex-col items-start gap-1">
                      <Badge className="font-normal" variant={redeem_request.status as any}>
                        {capitalizeWordStart(redeem_request.status)}
                      </Badge>
                      {redeem_request.status === "cancelled" && redeem_request.cancel_reason && (
                        <span className="text-xs text-red-500 font-medium">Reason: {redeem_request.cancel_reason}</span>
                      )}
                      {redeem_request.admin_notes && (
                        <span className="text-xs text-blue-500 font-medium">Notes: {redeem_request.admin_notes}</span>
                      )}
                    </div>
                  }
                />
                <ValueWrapper label="Email" value={<HideViewText>{redeem_request.email}</HideViewText>} />
                <ValueWrapper
                  label="Phone Number"
                  value={<HideViewText>{redeem_request.contact_number}</HideViewText>}
                />
                <ValueWrapper
                  label="Timestamp"
                  value={formatDate(
                    redeem_request.timestamp,
                    "MMM dd, y, h:mm a"
                  )}
                />
              </div>
            </li>
          ))}
        </ol>
        <SearchPagination
          hasNext={redeem_request?.hasNext}
          hasPrev={redeem_request?.hasPrev}
        />
      </div>
    </>
  );
}
