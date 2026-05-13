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
      className="px-20 flex-col items-start py-14 gap-10 max-lg:text-sm max-lg:gap-8 max-lg:px-10 max-sm:px-6 max-md:py-10"
    >
      <div className="flex flex-col gap-2">
        <HeaderText className="text-3xl max-lg:text-2xl max-md:text-xl">{t("accepted_wastes.title")}</HeaderText>
        <p className="text-sm italic text-tertiary">
          {t("accepted_wastes.date", {
            date: format(new Date(), "MMMM dd, yyyy"),
          })}
        </p>
      </div>
      <div className="flex gap-16 max-lg:flex-col max-lg:gap-10 w-full">
        <AcceptedWastesLeft />
        <AcceptedWastesRight />
      </div>
    </SectionWrapper>
  );
}
