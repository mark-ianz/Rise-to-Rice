import { Button } from "@/components/ui/button";
import { handleError } from "@/helper/errorHandler";
import useCreateAccountContext from "@/hooks/useCreateAccountContext";
import { UserCreate_First_Part_Schema } from "@/schema/CreateAccountSchema";
import { UserCreate_First_Part_Schema as UserCreate_First_Part_SchemaTL } from "@/schema/tl/CreateAccountSchema";
import { useTranslation } from "react-i18next";
import { SectionAndSetSection } from "../credentials/CredentialsSubmitButton";

export default function PersonalInformationSubmitButton({
  setSection,
}: SectionAndSetSection) {
  const { state, dispatch } = useCreateAccountContext();

  const { t, i18n } = useTranslation("form");

  const parser =
    i18n.language === "en"
      ? UserCreate_First_Part_Schema
      : UserCreate_First_Part_SchemaTL;

  function handleSubmit() {
    try {
      parser.parse(state);
      setSection("credentials");
      dispatch({ type: "SET_ERROR", payload: null });
    } catch (error) {
      handleError(error, dispatch);
    }
  }

  return (
    <Button
      className="h-12 w-full rounded-md text-base font-semibold bg-primary-main text-white hover:bg-primary-dark shadow-md shadow-primary-main/20 transition-all hover:-translate-y-0.5 active:translate-y-0"
      onClick={handleSubmit}
    >
      {t("continue")}
    </Button>
  );
}
