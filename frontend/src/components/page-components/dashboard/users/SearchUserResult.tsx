import { capitalizeFirstLetter, displayFullName } from "@/lib/format";
import { formatDate } from "date-fns";
import { TableCell, TableRow } from "@/components/ui/table";
import SearchResult from "../SearchResult";
import { useSearchUser } from "@/hooks/query/useUser";
import { user_search_result_theads } from "@/lib/const/theads";
import { useEffect } from "react";
import { useGetSearchParams } from "@/hooks/useGetSearchParams";
import TooltipComponent from "@/components/general/TooltipComponent";
import UserActionButton from "./UserActionButton";
import HideViewText from "@/components/general/HideViewText";
import GetRoleIcon from "@/components/general/GetRoleIcon";
import { useSearchParams } from "react-router-dom";
import { Role } from "@/types/user.type";
import GenericError from "@/components/general/GenericError";
import SearchPagination from "../SearchPagination";
import ValueWrapper from "../ValueWrapper";

export default function SearchUserResult() {
  const { page, searchFor, search } = useGetSearchParams();

  const [searchParams, _] = useSearchParams();
  const roles = searchParams.getAll("roles") as Role[];

  const {
    data: search_result,
    refetch,
    isLoading,
  } = useSearchUser({
    page,
    search,
    searchFor,
    roles,
  });

  useEffect(() => {
    refetch();
  }, [refetch, search, searchFor, page, roles]);

  if (!search_result && !isLoading) return <GenericError />;

  return (
    <>
      <SearchResult
        hasNext={search_result?.hasNext}
        hasPrev={search_result?.hasPrev}
        result_length={search_result?.result.length}
        table_heads={user_search_result_theads}
        isLoading={isLoading}
      >
        {search_result?.result.map((user, index) => (
          <TableRow
            key={index}
            className="text-center align-middle max-lg:text-xs"
          >
            <TableCell className="flex items-center justify-center">
              <GetRoleIcon role={user.role} />
            </TableCell>

            <TableCell>{user.user_id}</TableCell>
            <TableCell>
              <HideViewText>{user.email}</HideViewText>
            </TableCell>
            <TableCell>{displayFullName(user)}</TableCell>
            <TableCell>{capitalizeFirstLetter(user.gender)}</TableCell>

            <TableCell className="max-w-72 text-ellipsis overflow-hidden">
              <HideViewText>{user.address}</HideViewText>
            </TableCell>

            <TooltipComponent content={formatDate(user.birthdate, "MMM dd, y")}>
              <TableCell>{formatDate(user.birthdate, "MM/dd/yyyy")}</TableCell>
            </TooltipComponent>
            <TableCell>
              <HideViewText>{user.contact_number}</HideViewText>
            </TableCell>
            <TooltipComponent
              content={formatDate(user.createdAt, "MMM dd, y, h:mm a")}
            >
              <TableCell className="max-w-14 text-ellipsis whitespace-nowrap overflow-hidden">
                {formatDate(user.createdAt, "MMM dd, y")}
              </TableCell>
            </TooltipComponent>
            <TableCell className="max-w-[150px] text-end align-middle">
              <UserActionButton user={user} />
            </TableCell>
          </TableRow>
        ))}
      </SearchResult>
      <div className="hidden max-lg:flex flex-col gap-4">
        <ol className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
          {search_result?.result.map((user, index) => (
            <li
              key={`${index}-${user.user_id}`}
              className="flex flex-col bg-white rounded-md shadow-md"
            >
              <div className="border-b flex justify-between items-center p-4">
                <p className="font-semibold text-muted-foreground">
                  User ID #{user.user_id}
                </p>
                <UserActionButton user={user} />
              </div>
              <div className="p-2">
                <ValueWrapper label="Name" value={displayFullName(user)} />
                <ValueWrapper
                  label="Email"
                  value={<HideViewText>{user.email}</HideViewText>}
                />
                <ValueWrapper
                  label="Role"
                  value={<GetRoleIcon role={user.role} />}
                />
                <ValueWrapper
                  label="Gender"
                  value={capitalizeFirstLetter(user.gender)}
                />
                <ValueWrapper
                  label="Address"
                  value={<HideViewText>{user.address}</HideViewText>}
                />
                <ValueWrapper
                  label="Birthdate"
                  value={formatDate(user.birthdate, "MM/dd/yyyy")}
                />
                <ValueWrapper
                  label="Contact Number"
                  value={<HideViewText>{user.contact_number}</HideViewText>}
                />
                <ValueWrapper
                  label="Created At"
                  value={formatDate(user.createdAt, "MMM dd, y")}
                />
              </div>
            </li>
          ))}
        </ol>
        <SearchPagination
          hasNext={search_result?.hasNext}
          hasPrev={search_result?.hasPrev}
        />
      </div>
    </>
  );
}
