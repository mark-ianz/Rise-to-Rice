import SectionWrapper from "@/components/general/SectionWrapper";
import ViewProfile from "@/components/page-components/view_profile/ViewProfile";
import { Helmet } from "react-helmet-async";

export default function Profile() {
  return (
    <SectionWrapper
      id="profile"
      className="px-20 py-10 max-md:px-10 max-sm:px-6 items-start bg-secondary-light-2 dark:bg-background"
    >
      <Helmet>
        <title>Profile | Rise to Rice</title>
        <meta
          name="description"
          content="Manage your profile, view your rewards, and track your activities on Rise to Rice."
        />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href="https://risetorice.com/profile" />

        <meta property="og:title" content="Your Profile — Rise to Rice" />
        <meta
          property="og:description"
          content="View and update your profile, track your rewards, and more."
        />
        <meta property="og:url" content="https://risetorice.com/profile" />
        <meta
          property="og:image"
          content="https://risetorice.com/frontend/og-image.png"
        />
      </Helmet>
      <ViewProfile />
    </SectionWrapper>
  );
}
