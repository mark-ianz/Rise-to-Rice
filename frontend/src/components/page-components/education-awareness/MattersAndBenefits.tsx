import SectionWrapper from "@/components/general/SectionWrapper";
import Matters from "./Matters";
import Benefits from "./Benefits";
import { Separator } from "@/components/ui/separator";

export default function MattersAndBenefits() {
  return (
    <SectionWrapper
      id="matters-benefits"
      className="px-20 py-16 items-start bg-secondary-light max-lg:py-12 max-lg:px-10 max-sm:px-6 max-md:py-10"
    >
      <div className="flex gap-16 max-lg:gap-10 max-lg:text-sm max-sm:flex-col max-sm:gap-8 w-full max-w-screen-xl mx-auto">
        <Matters />
        <Separator className="hidden max-sm:block bg-primary-main/20"/>
        <Benefits />
      </div>
    </SectionWrapper>
  );
}
