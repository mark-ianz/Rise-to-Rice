import { Button } from "@/components/ui/button";
import { handleError } from "@/helper/errorHandler";
import useCreateAccountContext from "@/hooks/useCreateAccountContext";
import { UserCreate_Second_Part_Schema } from "@/schema/CreateAccountSchema";
import { UserCreate_Second_Part_Schema as UserCreate_Second_Part_SchemaTL } from "@/schema/tl/CreateAccountSchema";
import { RegisterSections } from "@/types/register";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Loader2Icon } from "lucide-react";
import { useTranslation } from "react-i18next";

export type SectionAndSetSection = {
  section: RegisterSections;
  setSection: (value: RegisterSections) => void;
};

export default function CredentialsSubmitButton({
  setSection,
}: SectionAndSetSection) {
  const { t, i18n } = useTranslation("form");
  const { t: register } = useTranslation("register");

  const parser =
    i18n.language === "en"
      ? UserCreate_Second_Part_Schema
      : UserCreate_Second_Part_SchemaTL;

  const { state, dispatch } = useCreateAccountContext();

  const { mutate, isPending } = useMutation({
    mutationFn: async (email: string) => {
      const response = await axios.post<{ exists: boolean }>(
        "/api/user/email-exists",
        {
          email,
        }
      );

      if (response.data.exists) {
        throw new Error(register("email_exists"));
      }
    },
    onError: (error) => {
      handleError(error, dispatch);
    },
    onSuccess: () => {
      setSection("email-verification");
    },
  });

  async function handleSubmit() {
    try {
      dispatch({ type: "SET_ERROR", payload: null });

      if (!state.agreedToTerms) {
        throw new Error(register("agreement_error"));
      }

      const parsedCredentials = parser.parse(state);
      mutate(parsedCredentials.email);
    } catch (error: any) {
      handleError(error, dispatch);
    }
  }

  function handleGoBackClick() {
    setSection("personal-information");
    dispatch({ type: "SET_ERROR", payload: null });
  }

  return (
    <div className="flex flex-col gap-3 w-full">
      <Button
        className="h-12 w-full rounded-md text-base font-semibold bg-primary-main text-white hover:bg-primary-dark shadow-md shadow-primary-main/20 transition-all hover:-translate-y-0.5 active:translate-y-0"
        onClick={handleSubmit}
        disabled={isPending}
      >
        {isPending ? <Loader2Icon className="animate-spin" /> : t("continue")}
      </Button>
      <Button
        type="button"
        className="h-12 w-full rounded-md text-base font-semibold bg-white text-gray-800 border border-gray-200 hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-none"
        onClick={handleGoBackClick}
        disabled={isPending}
      >
        {t("go_back")}
      </Button>
    </div>
  );
}
