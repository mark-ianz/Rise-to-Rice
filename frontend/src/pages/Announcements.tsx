import PostAnnouncementButton from "@/components/page-components/announcements/PostAnnouncementButton";
import HeaderText from "@/components/general/HeaderText";
import SectionWrapper from "@/components/general/SectionWrapper";
import AnnouncementList from "@/components/page-components/announcements/AnnouncementList";
import SortAnnouncement from "@/components/page-components/announcements/SortAnnouncement";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";

export default function Announcements() {
  const { t } = useTranslation("announcements");

  return (
    <SectionWrapper className="items-start justify-center" id="announcements">
      <Helmet>
        <title>Announcements | Rise to Rice</title>
        <meta
          name="description"
          content="Stay up to date with our latest news and announcements from Rise to Rice."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://risetorice.com/announcements" />

        <meta property="og:title" content="Announcements — Rise to Rice" />
        <meta
          property="og:description"
          content="Stay up to date with our latest news and announcements from Rise to Rice."
        />
        <meta
          property="og:url"
          content="https://risetorice.com/announcements"
        />
        <meta
          property="og:image"
          content="https://risetorice.com/frontend/og-image.png"
        />
      </Helmet>
      <div className="p-10 flex flex-col max-w-screen-md gap-4 w-full max-xsm:p-5">
        <span className="flex flex-col">
          <HeaderText className="font-bold">{t("title")}</HeaderText>
          <p className="text-sm italic text-tertiary">{t("subtext")}</p>
        </span>
        <PostAnnouncementButton />
        <SortAnnouncement />
        <AnnouncementList />
      </div>
    </SectionWrapper>
  );
}
