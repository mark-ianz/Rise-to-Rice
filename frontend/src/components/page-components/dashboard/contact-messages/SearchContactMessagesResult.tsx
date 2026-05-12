import { TableCell, TableRow } from "@/components/ui/table";
import SearchResult from "../SearchResult";
import { search_contact_message_result_theads } from "@/lib/const/theads";
import { useEffect } from "react";
import { useGetSearchParams } from "@/hooks/useGetSearchParams";
import { useSearchParams } from "react-router-dom";
import { useGetContactMessages } from "@/hooks/query/useContactUs";
import { format } from "date-fns";
import { capitalizeWordStart } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import TooltipComponent from "@/components/general/TooltipComponent";
import ViewMessage from "./ViewMessage";
import ContactMessageActionButton from "./ContactMessageActionButton";
import HideViewText from "@/components/general/HideViewText";
import GenericError from "@/components/general/GenericError";
import SearchPagination from "../SearchPagination";
import ValueWrapper from "../ValueWrapper";

export default function SearchContactMessagesResult() {
  const [searchParams, _] = useSearchParams();
  const status = searchParams.get("search");

  const { search, searchFor, page } = useGetSearchParams();

  const {
    data: contact_messages,
    isLoading,
    refetch,
  } = useGetContactMessages({
    page,
    search,
    searchFor,
  });

  useEffect(() => {
    refetch();
  }, [refetch, search, searchFor, page, status]);

  if (!isLoading && !contact_messages) return <GenericError />;

  return (
    <>
      <SearchResult
        hasNext={contact_messages?.hasNext}
        hasPrev={contact_messages?.hasPrev}
        result_length={contact_messages?.result.length}
        isLoading={isLoading}
        table_heads={search_contact_message_result_theads}
      >
        {contact_messages?.result.map((contact_message, index) => (
          <TableRow key={index} className="text-center max-lg:text-xs">
            <TableCell className="max-w-14 text-ellipsis whitespace-nowrap overflow-hidden">
              {contact_message.contact_id}
            </TableCell>

            <TableCell className="max-w-32 text-ellipsis whitespace-nowrap overflow-hidden">
              {contact_message.first_name + " " + contact_message.last_name}
            </TableCell>

            <TableCell className="max-w-32">
              <HideViewText>{contact_message.email}</HideViewText>
            </TableCell>

            <TableCell>
              <ViewMessage contact_message={contact_message} />
            </TableCell>

            <TableCell className="text-ellipsis whitespace-nowrap overflow-hidden">
              <Badge className="font-normal" variant={contact_message.status}>
                {capitalizeWordStart(contact_message.status)}
              </Badge>
            </TableCell>

            <TooltipComponent
              content={format(contact_message.submittedAt, "MMM dd, y, h:mm a")}
            >
              <TableCell className="max-w-32 text-ellipsis whitespace-nowrap overflow-hidden">
                {format(contact_message.submittedAt, "MMM dd, y, h:mm a")}
              </TableCell>
            </TooltipComponent>

            <TooltipComponent
              content={format(contact_message.updatedAt, "MMM dd, y, h:mm a")}
            >
              <TableCell className="max-w-32 text-ellipsis whitespace-nowrap overflow-hidden">
                {format(contact_message.updatedAt, "MMM dd, y, h:mm a")}
              </TableCell>
            </TooltipComponent>

            <TableCell>
              <ContactMessageActionButton contact_message={contact_message} />
            </TableCell>
          </TableRow>
        ))}
      </SearchResult>
      <div className="hidden max-lg:flex flex-col gap-4">
        <ol className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
          {contact_messages?.result.map((contact_message, index) => (
            <li
              key={`${index}-${contact_message.contact_id}`}
              className="flex flex-col bg-white rounded-md shadow-md"
            >
              <div className="border-b flex justify-between items-center p-4">
                <p className="font-semibold text-muted-foreground">
                  Contact Message ID #{contact_message.contact_id}
                </p>
                <ContactMessageActionButton contact_message={contact_message} />
              </div>
              <div className="p-2">
                <ValueWrapper
                  label="Name"
                  value={`${contact_message.first_name} ${contact_message.last_name}`}
                />
                <ValueWrapper
                  label="Email"
                  value={<HideViewText>{contact_message.email}</HideViewText>}
                />
                <ValueWrapper
                  label="Message"
                  value={<ViewMessage contact_message={contact_message} />}
                />
                <ValueWrapper
                  label="Status"
                  value={
                    <Badge
                      className="font-normal"
                      variant={contact_message.status}
                    >
                      {capitalizeWordStart(contact_message.status)}
                    </Badge>
                  }
                />
                <ValueWrapper
                  label="Timestamp"
                  value={format(
                    contact_message.submittedAt,
                    "MMM dd, y, h:mm a"
                  )}
                />
                <ValueWrapper
                  label="Updated At"
                  value={format(contact_message.updatedAt, "MMM dd, y, h:mm a")}
                />
              </div>
            </li>
          ))}
        </ol>
        <SearchPagination
          hasNext={contact_messages?.hasNext}
          hasPrev={contact_messages?.hasPrev}
        />
      </div>
    </>
  );
}
