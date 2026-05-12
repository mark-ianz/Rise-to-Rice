import { RedeemRequest } from "@/types/redeem-request";
import ActionButton from "../users/ActionButton";
import DeleteData from "../DeleteData";
import UpdateStatus from "./UpdateStatus";
import {
  useDeleteRedeemRequest,
  useUpdateRedeemRequestStatus,
} from "@/hooks/query/useRedeemRequest";
import { requestStatusDropdown } from "@/lib/const/status_dropdown";

type Props = {
  redeem_request: RedeemRequest;
};

export default function RedeemRequestActionButton({ redeem_request }: Props) {
  const mutation_value = {
    id: redeem_request.redeem_request_id,
    email: redeem_request.email,
    points_cost: redeem_request.points_cost,
    user_id: redeem_request.user_id,
    current_status: redeem_request.status,
    new_status: redeem_request.status as string,
  };

  return (
    <ActionButton>
      <UpdateStatus
        resource_name="request"
        status={redeem_request.status}
        dropdown_items={requestStatusDropdown}
        id={redeem_request.redeem_request_id}
        mutation_value={mutation_value}
        useMutation_hook={useUpdateRedeemRequestStatus}
      />
      <DeleteData
        description="This action cannot be undone. This will permanently delete this request and all of its data."
        resource_name="request"
        useMutation_hook={useDeleteRedeemRequest}
        id={redeem_request.redeem_request_id}
      />
    </ActionButton>
  );
}
