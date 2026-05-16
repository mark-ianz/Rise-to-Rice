import HeaderText from "@/components/general/HeaderText";
import SearchContactMessagesResult from "@/components/page-components/dashboard/contact-messages/SearchContactMessagesResult";
import SearchForm from "@/components/page-components/dashboard/SearchForm";
import SectionWrapper from "@/components/general/SectionWrapper";
import { userSearchForFilter } from "@/lib/const/filter_items";
import { Helmet } from "react-helmet-async";

export default function ContactMessages() {
  return (
    <SectionWrapper
      id="contact-messages"
      className="flex-col items-start p-10 max-md:p-6 max-md:pt-4"
    >
      <Helmet>
        <title>Contact Messages | Rise to Rice</title>
      </Helmet>
      <div className="flex flex-col gap-6 w-full grow max-lg:gap-4">
        <HeaderText>Contact Messages</HeaderText>
        <SearchForm searchForItems={userSearchForFilter} />
        <SearchContactMessagesResult />
      </div>
    </SectionWrapper>
  );
}
