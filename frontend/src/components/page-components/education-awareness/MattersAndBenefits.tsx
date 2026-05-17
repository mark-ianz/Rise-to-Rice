import SectionWrapper from "@/components/general/SectionWrapper";
import Matters from "./Matters";
import Benefits from "./Benefits";

export default function MattersAndBenefits() {
  return (
    <SectionWrapper
      id="matters-benefits"
      className="py-24 max-lg:py-20 max-md:py-16 bg-[#F8F9FA] overflow-hidden"
    >
      <div className="w-full max-w-screen-xl mx-auto px-10 max-sm:px-6">
        <div className="flex flex-col gap-24 max-lg:gap-16 w-full">
          <Matters />
          <Benefits />
        </div>
      </div>
    </SectionWrapper>
  );
}
