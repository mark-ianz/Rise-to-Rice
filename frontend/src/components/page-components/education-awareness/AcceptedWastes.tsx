import { format } from "date-fns";
import AcceptedWastesLeft from "@/components/page-components/education-awareness/AcceptedWastesLeft";
import AcceptedWastesRight from "@/components/page-components/education-awareness/AcceptedWastesRight";
import SectionWrapper from "@/components/general/SectionWrapper";
import { useTranslation } from "react-i18next";
import { Package } from "lucide-react";

export default function AcceptedWastes() {
  const { t } = useTranslation("education_and_awareness");

  return (
    <SectionWrapper
      id="accepted-wastes"
      className="flex-col py-24 max-lg:py-20 max-md:py-16 bg-warm-cream"
    >
      <div className="w-full max-w-screen-xl mx-auto px-20 max-lg:px-10 max-sm:px-6">
        <div className="flex items-start gap-4 mb-12 max-md:mb-8">
          <div className="w-12 h-12 rounded-2xl bg-primary-main flex items-center justify-center flex-shrink-0">
            <Package className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl max-lg:text-2xl max-md:text-xl font-bold text-secondary-dark">
              {t("accepted_wastes.title")}
            </h2>
            <p className="text-secondary-dark/50 text-sm mt-1">
              Updated {format(new Date(), "MMMM d, yyyy")}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-5 gap-8 max-lg:grid-cols-1 max-lg:gap-12">
          <div className="col-span-2">
            <AcceptedWastesLeft />
          </div>
          <div className="col-span-3">
            <AcceptedWastesRight />
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
