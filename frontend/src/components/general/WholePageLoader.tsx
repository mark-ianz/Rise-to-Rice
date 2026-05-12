import LoadingComponent from "./LoadingComponent";
import SectionWrapper from "./SectionWrapper";

export default function WholePageLoader() {
  return (
    <SectionWrapper
      id="none"
      className="items-center justify-center"
    >
      <LoadingComponent />
    </SectionWrapper>
  );
}
