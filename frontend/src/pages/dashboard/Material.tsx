import HeaderText from "@/components/general/HeaderText";
import SearchMaterialResult from "@/components/page-components/dashboard/materials/SearchMaterialResult";
import SectionWrapper from "@/components/general/SectionWrapper";
import AddCategory from "@/components/page-components/dashboard/materials/AddCategory";
import { Helmet } from "react-helmet";

export default function Material() {
  return (
    <SectionWrapper
      id="rewards"
      className="flex-col items-start p-10 max-md:p-6 max-md:pt-4"
    >
      <Helmet>
        <title>Materials | Rise to Rice</title>
      </Helmet>
      <div className="flex flex-col gap-6 w-full grow max-lg:gap-4">
        <span className="flex gap-2 items-center">
          <HeaderText>Material Categories</HeaderText>
          <AddCategory />
        </span>
        <SearchMaterialResult />
      </div>
    </SectionWrapper>
  );
}
