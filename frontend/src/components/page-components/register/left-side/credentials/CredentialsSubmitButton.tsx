import useCreateAccountContext from "@/hooks/useCreateAccountContext";
import { UserCreate_Second_Part_Schema } from "@/schema/CreateAccountSchema";
import { UserCreate_Second_Part_Schema as UserCreate_Second_Part_SchemaTL } from "@/schema/tl/CreateAccountSchema";
import { Button } from "@/components/ui/button";
import { handleError } from "@/helper/errorHandler";
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
      // this will check if the email exists
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
      dispatch({ type: "SET_ERROR", payload: [error.message] });
    },
    onSuccess: () => {
      // if the email does not exist, go to the next step
      setSection("email-verification");
    },
  });

  async function handleSubmit() {
    // handle second part
    try {
      dispatch({ type: "SET_ERROR", payload: null });
      const parsedCredentials = parser.parse(state);
      mutate(parsedCredentials.email);
    } catch (error) {
      handleError(error, dispatch);
    }
  }

  function handleGoBackClick() {
    setSection("personal-information");
    dispatch({ type: "SET_ERROR", payload: null });
  }

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <Button className="w-full" onClick={handleSubmit} disabled={isPending}>
        {isPending ? <Loader2Icon className="animate-spin" /> : t("continue")}
      </Button>
      <Button
        type="submit"
        variant={"outline"}
        className="w-full"
        onClick={handleGoBackClick}
        disabled={isPending}
      >
        {t("go_back")}
      </Button>
    </div>
  );
}
