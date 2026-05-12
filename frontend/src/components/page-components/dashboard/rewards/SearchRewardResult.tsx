import { TableCell, TableRow } from "@/components/ui/table";
import SearchResult from "../SearchResult";
import { search_reward_result_theads } from "@/lib/const/theads";
import { useEffect } from "react";
import { useGetSearchParams } from "@/hooks/useGetSearchParams";
import { useSearchParams } from "react-router-dom";
import { useGetRewards } from "@/hooks/query/useRewards";
import ViewVariations from "./ViewVariations";
import RewardsActionButton from "./RewardsActionButton";
import GenericError from "@/components/general/GenericError";
import SearchPagination from "../SearchPagination";
import ValueWrapper from "../ValueWrapper";

export default function SearchRewardResult() {
  const [searchParams, _] = useSearchParams();

  const status = searchParams.get("search");

  const { search, searchFor, page } = useGetSearchParams();

  const {
    data: rewards,
    isLoading,
    refetch,
  } = useGetRewards({
    page,
    search,
    searchFor,
    isAdmin: "true",
  });

  useEffect(() => {
    refetch();
  }, [refetch, search, searchFor, page, status]);

  if (!rewards && !isLoading) return <GenericError />;

  return (
    <>
      <SearchResult
        hasNext={rewards?.hasNext}
        hasPrev={rewards?.hasPrev}
        result_length={rewards?.result.length}
        isLoading={isLoading}
        table_heads={search_reward_result_theads}
      >
        {rewards?.result.map((reward, index) => (
          <TableRow key={index} className="text-center max-lg:text-xs">
            <TableCell className="break-words">{reward.reward_id}</TableCell>
            <TableCell className="break-words">{reward.reward_name}</TableCell>
            <TableCell className="break-words">
              {reward.unit.toUpperCase()}
            </TableCell>
            <TableCell className="break-words">
              <ViewVariations reward={reward} />
            </TableCell>
            <TableCell>
              <RewardsActionButton reward={reward} />
            </TableCell>
          </TableRow>
        ))}
      </SearchResult>
      <div className="hidden max-lg:flex flex-col gap-4">
        <ol className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
          {rewards?.result.map((reward, index) => (
            <li
              key={`${index}-${reward.reward_id}`}
              className="flex flex-col bg-white rounded-md shadow-md"
            >
              <div className="border-b flex justify-between items-center p-4">
                <p className="font-semibold text-muted-foreground">
                  Reward ID #{reward.reward_id}
                </p>
                <RewardsActionButton reward={reward} />
              </div>
              <div className="p-2">
                <ValueWrapper label="Reward ID" value={reward.reward_id} />
                <ValueWrapper label="Reward Name" value={reward.reward_name} />
                <ValueWrapper label="Unit" value={reward.unit.toUpperCase()} />
                <ValueWrapper
                  label="Variations"
                  value={<ViewVariations reward={reward} />}
                />
              </div>
            </li>
          ))}
        </ol>
        <SearchPagination
          hasNext={rewards?.hasNext}
          hasPrev={rewards?.hasPrev}
        />
      </div>
    </>
  );
}
