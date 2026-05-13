import SectionWrapper from "@/components/general/SectionWrapper";
import Matters from "./Matters";
import Benefits from "./Benefits";

export default function MattersAndBenefits() {
  return (
    <SectionWrapper
      id="matters-benefits"
      className="py-24 max-lg:py-20 max-md:py-16 bg-warm-beige"
    >
      <div className="w-full max-w-screen-xl mx-auto px-20 max-lg:px-10 max-sm:px-6">
        <div className="grid grid-cols-2 gap-8 max-md:grid-cols-1 max-md:gap-8">
          <Matters />
          <Benefits />
        </div>
      </div>
    </SectionWrapper>
  );
}
