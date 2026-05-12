import {
  AlignEndHorizontal,
  HandCoins,
  Megaphone,
  RefreshCw,
  User2,
  UserRoundPen,
} from "lucide-react";
import Card from "./Card";
import { TimeDisplay } from "@/types/time";
import { useGetDashboard } from "@/hooks/query/useAnalytics";
import GenericError from "@/components/general/GenericError";
import { Skeleton } from "@/components/ui/skeleton";
import { ReactNode } from "react";
import { formatNumberWithCommasAndDecimals } from "@/lib/format";

type Props = {
  time: TimeDisplay;
};

export default function DashboardCards({ time }: Props) {
  const { data: dashboard_analytics, isLoading } = useGetDashboard(time);

  if (isLoading)
    return (
      <ListContainer>
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="w-full h-60" />
        ))}
      </ListContainer>
    );

  if (!dashboard_analytics) return <GenericError />;

  return (
    <ListContainer>
      <Card
        bg={`bg-chart-1`}
        icon={<User2 size={50} />}
        title="Users"
        value={dashboard_analytics["total_users"] || 0}
      />
      <Card
        bg={`bg-chart-2`}
        icon={<RefreshCw size={50} />}
        title="Exchanged Materials"
        value={
          formatNumberWithCommasAndDecimals(
            dashboard_analytics["total_weight"]
          ) + " KG"
        }
      />
      <Card
        bg={`bg-chart-3`}
        icon={<AlignEndHorizontal size={50} />}
        title="Top Material"
        value={dashboard_analytics["top_material"]?.material || "N/A"}
      />
      <Card
        bg={`bg-chart-4`}
        icon={<UserRoundPen size={50} />}
        title="Times Users Exchanged"
        value={dashboard_analytics["total_exchanges"] || 0}
      />
      <Card
        bg={`bg-chart-5`}
        icon={<HandCoins size={50} />}
        title="Points Accumulated"
        value={formatNumberWithCommasAndDecimals(
          dashboard_analytics["total_points"]
        )}
      />
      <Card
        bg={`bg-chart-6`}
        icon={<Megaphone size={50} />}
        title="Announcement Posted"
        value={dashboard_analytics["total_announcements"] || 0}
      />
    </ListContainer>
  );
}

function ListContainer({ children }: { children: ReactNode }) {
  return (
    <ol className="grid grid-cols-6 gap-4 w-full max-2xl:grid-cols-5 max-xl:grid-cols-4 max-lg:grid-cols-3 max-sm:grid-cols-2 max-xsm:grid-cols-1">
      {children}
    </ol>
  );
}
