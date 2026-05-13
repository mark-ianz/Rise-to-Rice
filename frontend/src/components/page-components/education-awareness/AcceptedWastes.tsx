import { format } from "date-fns";
import AcceptedWastesLeft from "@/components/page-components/education-awareness/AcceptedWastesLeft";
import AcceptedWastesRight from "@/components/page-components/education-awareness/AcceptedWastesRight";
import SectionWrapper from "@/components/general/SectionWrapper";
import { useTranslation } from "react-i18next";

export default function AcceptedWastes() {
  const { t } = useTranslation("education_and_awareness");

  return (
    <SectionWrapper
      id="accepted-wastes"
      className="flex-col py-24 max-lg:py-20 max-md:py-16 bg-white"
    >
      <div className="w-full max-w-screen-xl mx-auto px-20 max-lg:px-10 max-sm:px-6">
        <div className="text-center mb-16 max-md:mb-12">
          <span className="text-primary-main text-sm font-semibold uppercase tracking-wider">
            What We Accept
          </span>
          <h2 className="mt-3 text-4xl max-lg:text-3xl max-md:text-2xl font-bold text-secondary-dark">
            {t("accepted_wastes.title")}
          </h2>
          <p className="mt-2 text-sm text-secondary-dark/50">
            {t("accepted_wastes.date", {
              date: format(new Date(), "MMMM dd, yyyy"),
            })}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-16 max-lg:grid-cols-1 max-lg:gap-12">
          <AcceptedWastesLeft />
          <AcceptedWastesRight />
        </div>
      </div>
    </SectionWrapper>
  );
}
