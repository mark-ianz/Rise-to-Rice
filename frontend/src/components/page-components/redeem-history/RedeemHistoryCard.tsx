import { Badge } from "@/components/ui/badge";
import { capitalizeWordStart, formatUnit } from "@/lib/format";
import { RedeemRequestHistory } from "@/types/redeem-request";
import { format } from "date-fns";
import CancelRequest from "./CancelRequest";
import { useTranslation } from "react-i18next";

type Props = {
  request: RedeemRequestHistory;
};

export default function RedeemHistoryCard({ request }: Props) {
  const { t } = useTranslation("redeem_rewards");

  return (
    <li
      key={request.redeem_request_id}
      className="flex flex-col gap-4 border p-4 rounded-md bg-white shadow-md"
    >
      <div className="text-sm text-muted-foreground flex flex-col">
        <p>Request #{request.redeem_request_id}</p>
        <p>{format(request.timestamp, "MMMM dd, yyyy - hh:mm a")}</p>
      </div>
      <div className="flex flex-col">
        <p>
          <span className="font-semibold">{t("terms.reward")}: </span>
          {request.reward_name}{" "}
          <span className="text-sm italic text-tertiary">
            ({request.quantity} {formatUnit(request.unit, request.quantity)})
          </span>
        </p>
        <p>
          <span className="font-semibold">{t("terms.points_cost")}: </span>
          {t("terms.points", {
            count: request.points_cost,
          })}
        </p>
        <span className="font-semibold">
          {t("terms.status")}:{"  "}
          <Badge
            className="font-normal px-2 py-[.2em] w-fit"
            variant={request.status}
          >
            {capitalizeWordStart(
              t(`redeem_history.status.${request.status.toLocaleLowerCase()}`)
            )}
          </Badge>
        </span>
      </div>
      {request.status === "pending" && (
        <span className="text-end">
          <CancelRequest points_cost={request.points_cost} request_id={request.redeem_request_id} />
        </span>
      )}
    </li>
  );
}
