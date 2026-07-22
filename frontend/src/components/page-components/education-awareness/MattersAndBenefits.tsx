import { motion } from "framer-motion";
import SectionWrapper from "@/components/general/SectionWrapper";
import Matters from "./Matters";
import Benefits from "./Benefits";

export default function MattersAndBenefits() {
  return (
    <SectionWrapper
      id="matters-benefits"
      className="py-24 max-lg:py-20 max-md:py-16 bg-[#F8F9FA] overflow-hidden"
    >
      <motion.div
        className="w-full max-w-screen-xl mx-auto px-10 max-sm:px-6"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="flex flex-col gap-24 max-lg:gap-16 w-full">
          <Matters />
          <Benefits />
        </div>
      </motion.div>
    </SectionWrapper>
  );
}
