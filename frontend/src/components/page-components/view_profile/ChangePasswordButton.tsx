import ZodErrorDisplay from "@/components/general/ZodErrorDisplay";
import PasswordInput from "@/components/general/PasswordInput";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useChangePassword } from "@/hooks/query/useUser";
import { formatZodErrors } from "@/lib/format";
import { PasswordResetSchema } from "@/schema/CreateAccountSchema";
import { isAxiosError } from "axios";
import { FormEvent, useRef, useState } from "react";
import { toast } from "sonner";
import { ZodError } from "zod";
import { useTranslation } from "react-i18next";

type Props = {
  user_id: number;
};

export default function ChangePasswordButton({ user_id }: Props) {
  const { t } = useTranslation("change_password");
  const { mutate } = useChangePassword();

  const [error, setError] = useState<string[] | null>(null);

  const [open, setOpen] = useState(false);

  const oldPasswordRef = useRef<HTMLInputElement>(null);
  const newPasswordRef = useRef<HTMLInputElement>(null);
  const confirmNewPasswordRef = useRef<HTMLInputElement>(null);

  const handleChangePassword = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!user_id) return;

    if (
      !oldPasswordRef.current ||
      !newPasswordRef.current ||
      !confirmNewPasswordRef.current
    ) {
      return;
    }

    try {
      const parsed = PasswordResetSchema.parse({
        password: newPasswordRef.current.value,
        confirm_password: confirmNewPasswordRef.current.value,
      });

      mutate(
        {
          user_id,
          old_password: oldPasswordRef.current.value,
          new_password: parsed.password,
        },
        {
          onSuccess: () => {
            if (oldPasswordRef.current) oldPasswordRef.current.value = "";
            if (newPasswordRef.current) newPasswordRef.current.value = "";
            if (confirmNewPasswordRef.current)
              confirmNewPasswordRef.current.value = "";

            toast.success("Password changed successfully.");
            setError(null);
            setOpen(false);
          },
          onError: (error) => {
            if (isAxiosError(error)) {
              if (Array.isArray(error.response?.data?.errors)) {
                setError(
                  error.response.data.errors.map(
                    (item: { message: string }) => item.message
                  )
                );
              } else if (Array.isArray(error.response?.data?.error)) {
                setError(error.response.data.error);
              } else if (error.response?.data?.error) {
                setError([error.response.data.error]);
              } else {
                setError([
                  "An unknown error occurred. Please try again later.",
                ]);
              }
            } else {
              setError(["An unknown error occurred. Please try again later."]);
            }
          },
        }
      );
    } catch (error) {
      if (error instanceof ZodError) {
        setError(formatZodErrors(error));
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"destructive"} className="max-lg:text-xs">
          {t("title")}
        </Button>
      </DialogTrigger>
      <DialogContent aria-describedby={undefined}>
        <form onSubmit={handleChangePassword} className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>{t("title")}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <PasswordInput
              label={t("current_password")}
              name="current-password"
              ref={oldPasswordRef}
            />
            <PasswordInput
              ref={newPasswordRef}
              name="new-password"
              label={t("new_password")}
            />
            <PasswordInput
              ref={confirmNewPasswordRef}
              name="confirm-new-password"
              label={t("confirm_password")}
            />
            <ZodErrorDisplay error={error} />
          </div>
          <DialogFooter>
            <Button type="submit" variant="destructive">
              {t("title")}
            </Button>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                {t("cancel")}
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
