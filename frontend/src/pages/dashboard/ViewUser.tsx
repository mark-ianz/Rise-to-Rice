import ViewProfile from "@/components/page-components/view_profile/ViewProfile";
import SectionWrapper from "@/components/general/SectionWrapper";
import { useParams } from "react-router-dom";

export default function ViewUser() {
  const { id } = useParams<{ id: string }>();

  return (
    <SectionWrapper id="view-user" className="px-20 py-10 max-md:px-10 max-sm:px-6">
      <ViewProfile user_id={Number(id)} />
    </SectionWrapper>
  );
}
