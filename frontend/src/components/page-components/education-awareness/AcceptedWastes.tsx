import { format } from "date-fns";
import AcceptedWastesLeft from "@/components/page-components/education-awareness/AcceptedWastesLeft";
import AcceptedWastesRight from "@/components/page-components/education-awareness/AcceptedWastesRight";
import HeaderText from "@/components/general/HeaderText";
import SectionWrapper from "@/components/general/SectionWrapper";
import { useTranslation } from "react-i18next";

export default function AcceptedWastes() {
  const { t } = useTranslation("education_and_awareness");

  return (
    <SectionWrapper
      id="accepted-wastes"
      className="px-20 flex-col items-start pt-10 gap-8 max-lg:text-sm pb-10 max-lg:gap-4 max-md:px-10"
    >
      <span>
        <HeaderText>{t("accepted_wastes.title")}</HeaderText>
        <p className="text-sm italic text-tertiary">
          {t("accepted_wastes.date", {
            date: format(new Date(), "MMMM dd, yyyy"),
          })}
        </p>
      </span>
      <div className="flex gap-20 max-lg:flex-col max-lg:gap-10">
        <AcceptedWastesLeft />
        <AcceptedWastesRight />
      </div>
    </SectionWrapper>
  );
}
