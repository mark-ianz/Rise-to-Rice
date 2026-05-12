import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ContactUs } from "@/types/contact_us";
import KeyValuePair from "../../view_profile/analytics/KeyValuePair";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { capitalizeWordStart } from "@/lib/format";

type Props = {
  contact_message: ContactUs;
};

export default function ViewMessage({ contact_message }: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <span className="text-tertiary underline cursor-pointer w-fit">
          View
        </span>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>View Message</DialogTitle>
          <div className="justify-between flex items-center">
            <DialogDescription>
              <span>
                <span>You are viewing Contact ID </span>
                <span className="font-bold">#{contact_message.contact_id}</span>
              </span>
            </DialogDescription>
            <Badge
              className="font-normal w-fit text-xs p-[.25em]"
              variant={contact_message.status}
            >
              {capitalizeWordStart(contact_message.status)}
            </Badge>
          </div>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <KeyValuePair
              head="Date"
              value={format(contact_message.submittedAt, "MMM dd, y, h:mm a")}
              valueClassName="text-sm"
            />
            <KeyValuePair
              headClassName="text-end"
              head="Last Updated"
              value={format(contact_message.updatedAt, "MMM dd, y, h:mm a")}
              valueClassName="text-sm"
            />
          </div>
          <KeyValuePair head="From" valueClassName="text-sm">
            <span className="text-sm">
              {contact_message.first_name} {contact_message.last_name}{" "}
              <span className="text-muted-foreground">{`<${contact_message.email}>`}</span>
            </span>
          </KeyValuePair>
          <div className="mb-2">
            <span className="text-sm text-tertiary">Message</span>
            <p className="text-sm border p-2 rounded-md whitespace-pre-line max-h-40 overflow-y-auto">
              {contact_message.message}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
