import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useCancelRedeemRequest } from "@/hooks/query/useRedeemRequest";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export default function CancelRequest({
  request_id,
  points_cost,
}: {
  request_id: number;
  points_cost: number;
}) {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation("redeem_rewards");
  const { t: tGlobal } = useTranslation("global");

  const { mutate, isPending } = useCancelRedeemRequest();

  const handleCancel = async () => {
    if (!request_id) return;
    mutate(
      { request_id, points_cost },
      {
        onError: () => {
          toast.error(tGlobal("error.generic"));
        },
        onSuccess: () => {
          toast.success(t("redeem_history.toast.cancel_success"));
          setOpen(false);
        },
      }
    );
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <Button
        className="h-7 text-xs p-2"
        variant={"ghost"}
        onClick={() => setOpen(true)}
      >
        {t("redeem_history.cancel")}
      </Button>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t("redeem_history.cancel_dialog.title")}
          </AlertDialogTitle>
          <AlertDialogDescription className="flex flex-col">
            <span>
              {t("redeem_history.cancel_dialog.description", {
                request_id,
              })}
            </span>
            <span>{t("redeem_history.cancel_dialog.description_2")}</span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button onClick={handleCancel} disabled={isPending}>
            {t("redeem_history.cancel_dialog.confirm")}
          </Button>
          <AlertDialogCancel asChild>
            <Button variant={"outline"} disabled={isPending}>
              {t("redeem_history.cancel_dialog.cancel")}
            </Button>
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
