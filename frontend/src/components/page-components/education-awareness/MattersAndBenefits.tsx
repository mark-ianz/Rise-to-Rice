import SectionWrapper from "@/components/general/SectionWrapper";
import Matters from "./Matters";
import Benefits from "./Benefits";
import { Separator } from "@/components/ui/separator";

export default function MattersAndBenefits() {
  return (
    <SectionWrapper
      id="matters-benefits"
      className="p-20 items-start bg-secondary-light max-lg:py-10 max-md:px-10"
    >
      <div className="flex gap-20 max-lg:gap-10 max-lg:text-sm max-sm:flex-col max-sm:gap-6">
        <Matters />
        <Separator className="hidden max-sm:block"/>
        <Benefits />
      </div>
    </SectionWrapper>
  );
}
