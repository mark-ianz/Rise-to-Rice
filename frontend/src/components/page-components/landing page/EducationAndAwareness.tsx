import { motion } from "framer-motion";
import AcceptedWastes from "@/components/page-components/education-awareness/AcceptedWastes";
import MattersAndBenefits from "@/components/page-components/education-awareness/MattersAndBenefits";


export default function EducationAndAwareness() {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
      }}
    >
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 30 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
        }}
      >
        <AcceptedWastes />
      </motion.div>
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 30 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
        }}
      >
        <MattersAndBenefits />
      </motion.div>
    </motion.div>
  );
}
