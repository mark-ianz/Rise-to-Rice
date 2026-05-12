import GoBackButton from "@/components/general/GoBackButton";
import HeaderText from "@/components/general/HeaderText";
import AnnouncementCard from "@/components/page-components/announcements/AnnouncementCard";
import SectionWrapper from "@/components/general/SectionWrapper";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import AnnouncementCardSkeleton from "@/components/skeletons/announcements/AnnouncementCardSkeleton";
import NotFoundPage from "@/components/page-components/NotFoundPage";
import { useGetSingleAnnouncement } from "@/hooks/query/useAnnouncement";
import { Helmet } from "react-helmet";

export default function ViewAnnouncement() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation("announcements");

  const { data: announcement, isLoading } = useGetSingleAnnouncement(
    Number(id)
  );

  if (!announcement && !isLoading) {
    return (
      <SectionWrapper
        id="view-announcement"
        className="flex flex-col justify-start py-10 pb-20 bg-secondary-light-2"
      >
        <NotFoundPage />;
      </SectionWrapper>
    );
  }

  return (
    <SectionWrapper
      id="view-announcement"
      className="flex flex-col justify-start p-10 pb-20 bg-secondary-light-2 max-md:px-6"
    >
      <Helmet>
        <title>{`${announcement?.title}`} | Rise to Rice</title>
        <meta name="description" content={announcement?.title} />
        <meta name="robots" content="index, follow" />
        <link
          rel="canonical"
          href={`https://risetorice.com/announcements/${announcement?.announcement_id}`}
        />
      </Helmet>

      <div className="w-full max-w-screen-lg flex flex-col items-start gap-6 max-md:gap-4">
        <span className="flex gap-3">
          <GoBackButton
            variant="secondary"
            className="static bg-secondary-light hover:brightness-110"
          />
          <HeaderText>{t("view_title")}</HeaderText>
        </span>
        {isLoading && <AnnouncementCardSkeleton viewing />}
        {announcement && !isLoading && (
          <AnnouncementCard viewing announcement={announcement} />
        )}
      </div>
    </SectionWrapper>
  );
}
