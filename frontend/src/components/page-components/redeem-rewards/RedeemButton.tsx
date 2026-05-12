import LoadingComponent from "@/components/general/LoadingComponent";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { TableCell } from "@/components/ui/table";
import ZodErrorDisplay from "@/components/general/ZodErrorDisplay";
import { useRedeemRewards } from "@/hooks/query/useRewards";
import useUserContext from "@/hooks/useUserContext";
import { formatUnit } from "@/lib/format";
import { Reward } from "@/types/rewards";
import axios from "axios";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { toast } from "sonner";

type Props = {
  reward: Reward;
  points_cost: number;
  selectedQuantity: string;
  variationId: number;
};

export default function RedeemButton({
  reward,
  points_cost,
  selectedQuantity,
  variationId,
}: Props) {
  const { t } = useTranslation("redeem_rewards");

  const [open, setOpen] = useState(false);

  const { state } = useUserContext();

  const { mutate, isPending } = useRedeemRewards();

  const handleRedeem = () => {
    mutate(
      {
        user_id: state!.user_id!,
        variation_id: variationId,
        points_cost,
      },
      {
        onError: (err) => {
          if (axios.isAxiosError(err)) {
            toast.error(
              <ZodErrorDisplay error={[t("redeem_button.toast.error")]} />
            );
            return;
          }

          toast.error(t("redeem_button.toast.unknown_error"));
        },
        onSuccess: () => {
          toast.success(
            <span>
              <p>{t("redeem_button.toast.success")}</p>
              <Link
                to="/redeem-history"
                className="ml-auto w-full text-tertiary underline"
              >
                {t("view_redeem_history")}
              </Link>
            </span>
          );
          setOpen(false);
        },
      }
    );
  };

  const formattedUnit = formatUnit(
    reward.unit,
    parseInt(selectedQuantity)
  );

  return (
    <TableCell className="text-end">
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
          <Button size={"sm"} variant={"default"} disabled={!variationId}>
            {t("redeem_button.text")}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("redeem_button.dialog.title")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("redeem_button.dialog.description", {
                points_cost: points_cost,
                quantity: selectedQuantity + " " + formattedUnit,
                reward: reward.reward_name,
              })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button
              onClick={handleRedeem}
              className="min-w-[75px]"
              disabled={isPending}
            >
              {isPending ? <LoadingComponent /> : t("redeem_button.dialog.confirm")}
            </Button>
            <AlertDialogCancel asChild>
              <Button variant={"outline"}>{t("redeem_button.dialog.cancel")}</Button>
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </TableCell>
  );
}
