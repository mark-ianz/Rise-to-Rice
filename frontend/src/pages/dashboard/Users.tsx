import HeaderText from "@/components/general/HeaderText";
import SearchForm from "@/components/page-components/dashboard/SearchForm";
import SearchUserResult from "@/components/page-components/dashboard/users/SearchUserResult";
import SectionWrapper from "@/components/general/SectionWrapper";
import { userSearchForFilter } from "@/lib/const/filter_items";
import RoleCheckboxFilter from "../../components/page-components/dashboard/users/RoleCheckboxFilter";
import { Helmet } from "react-helmet-async";

export default function Users() {
  return (
    <SectionWrapper
      id="users"
      className="flex-col items-start p-10 max-md:p-6 max-md:pt-4"
    >
      <Helmet>
        <title>Users | Rise to Rice</title>
      </Helmet>
      <div className="flex flex-col gap-6 w-full grow max-lg:gap-4">
        <HeaderText>Users</HeaderText>
        <SearchForm searchForItems={userSearchForFilter} />
        <RoleCheckboxFilter />
        <SearchUserResult />
      </div>
    </SectionWrapper>
  );
}
