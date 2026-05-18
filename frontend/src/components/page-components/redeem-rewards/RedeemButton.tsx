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
import { cn } from "@/lib/utils";

type Props = {
  reward: Reward;
  points_cost: number;
  selectedQuantity: string;
  variationId: number;
  disabled?: boolean;
  className?: string;
};

export default function RedeemButton({
  reward,
  points_cost,
  selectedQuantity,
  variationId,
  disabled = false,
  className,
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
              <p className="font-semibold text-sm">{t("redeem_button.toast.success")}</p>
              <Link
                to="/activity-history"
                className="mt-1 block text-xs font-semibold text-[#2D5A27] hover:underline"
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
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          size="sm"
          variant="default"
          disabled={disabled || !variationId || isPending}
          className={cn(
            "w-full h-10 rounded-xl font-semibold bg-[#2D5A27] hover:bg-[#22441D] text-white disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-200 transition-all duration-300 shadow-sm flex items-center justify-center gap-2",
            className
          )}
        >
          {t("redeem_button.text")}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="rounded-2xl max-w-[90vw] sm:max-w-md p-6 bg-white border border-border/40 shadow-xl">
        <AlertDialogHeader className="gap-2">
          <AlertDialogTitle className="text-xl font-bold text-foreground">
            {t("redeem_button.dialog.title")}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-muted-foreground leading-relaxed">
            {t("redeem_button.dialog.description", {
              points_cost: points_cost,
              quantity: selectedQuantity + " " + formattedUnit,
              reward: reward.reward_name,
            })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-6 flex flex-row-reverse gap-3 justify-end sm:justify-start">
          <Button
            onClick={handleRedeem}
            className="h-10 rounded-xl px-5 font-semibold bg-[#2D5A27] hover:bg-[#22441D] text-white shadow-sm shrink-0 min-w-[90px]"
            disabled={isPending}
          >
            {isPending ? <LoadingComponent /> : t("redeem_button.dialog.confirm")}
          </Button>
          <AlertDialogCancel asChild>
            <Button
              variant="outline"
              className="h-10 rounded-xl px-5 font-semibold border-border hover:bg-gray-50 text-foreground"
            >
              {t("redeem_button.dialog.cancel")}
            </Button>
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
