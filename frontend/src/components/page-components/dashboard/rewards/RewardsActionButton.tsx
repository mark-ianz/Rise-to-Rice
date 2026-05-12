import { RewardAndVariation } from "@/types/rewards";
import ActionButton from "../users/ActionButton";
import EditReward from "./EditReward";
import DeleteData from "../DeleteData";
import { useDeleteReward } from "@/hooks/query/useRewards";

type Props = {
  reward: RewardAndVariation;
};

export default function RewardsActionButton({ reward }: Props) {
  return (
    <ActionButton>
      <EditReward reward={reward} />
      <DeleteData
        useMutation_hook={useDeleteReward}
        description="This action cannot be undone. This will permanently delete the reward
          and all its variations."
        id={reward.reward_id}
        resource_name="reward"
      />
    </ActionButton>
  );
}
