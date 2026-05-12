import { ContactUs } from "@/types/contact_us";
import ActionButton from "../users/ActionButton";
import UpdateStatus from "../redeem-request/UpdateStatus";
import {
  useDeleteContactMessage,
  useUpdateContactMessageStatus,
} from "@/hooks/query/useContactUs";
import { contactMessageStatusDropdown } from "@/lib/const/status_dropdown";
import DeleteData from "../DeleteData";

type Props = {
  contact_message: ContactUs;
};

export default function ContactMessageActionButton({ contact_message }: Props) {
  return (
    <ActionButton>
      <UpdateStatus
        resource_name="message"
        status={contact_message.status}
        mutation_value={{
          id: contact_message.contact_id,
          new_status: contact_message.status,
        }}
        id={contact_message.contact_id}
        dropdown_items={contactMessageStatusDropdown}
        useMutation_hook={useUpdateContactMessageStatus}
      />
      <DeleteData
        description="This will permanently delete the message."
        id={contact_message.contact_id}
        resource_name="message"
        useMutation_hook={useDeleteContactMessage}
      />
    </ActionButton>
  );
}
