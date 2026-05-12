import { useTranslation } from "react-i18next";
import SectionWrapper from "./SectionWrapper";

export default function GenericError() {
  const { t } = useTranslation("global");

  return (
    <SectionWrapper
      id="generic-error"
      className="flex flex-col items-center justify-center h-full"
    >
      <p className="text-tertiary">{t("error.generic")}</p>
    </SectionWrapper>
  );
}
