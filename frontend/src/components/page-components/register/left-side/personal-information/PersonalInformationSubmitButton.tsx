import { handleError } from "@/helper/errorHandler";
import useCreateAccountContext from "@/hooks/useCreateAccountContext";
import { UserCreate_First_Part_Schema } from "@/schema/CreateAccountSchema";
import { UserCreate_First_Part_Schema as UserCreate_First_Part_SchemaTL } from "@/schema/tl/CreateAccountSchema";
import { SectionAndSetSection } from "../credentials/CredentialsSubmitButton";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

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
    <Button size={"sm"} className="w-full" onClick={handleSubmit}>
      {t("continue")}
    </Button>
  );
}
