import CenterLayout from "@/components/general/CenterLayout";
import HeroSection from "@/components/page-components/landing page/HeroSection";
import HowDoesItWork from "@/components/page-components/landing page/HowDoesItWork";
import LatestPosts from "@/components/page-components/landing page/LatestPosts";
import EducationAndAwareness from "@/components/page-components/landing page/EducationAndAwareness";
import { Helmet } from "react-helmet";

export default function LandingPage() {
  return (
    <CenterLayout className="items-center">
      <Helmet>
        <title>Home | Rise to Rice</title>
        <meta
          name="description"
          content="Recyclables to rice and support a greener community. Welcome to Rise to Rice, a community-driven initiative that transforms recyclable waste into a valuable resource to support sustainability and local communities. By repurposing waste, we reduce environmental impact and create opportunities for a greener future."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://risetorice.com/" />

        <meta
          property="og:title"
          content="Rise to Rice — Recyclables to rice and support a greener community"
        />
        <meta
          property="og:description"
          content="Welcome to Rise to Rice, a community-driven initiative that transforms recyclable waste into a valuable resource to support sustainability and local communities. By repurposing waste, we reduce environmental impact and create opportunities for a greener future."
        />
        <meta property="og:url" content="https://risetorice.com/" />
        <meta
          property="og:image"
          content="https://risetorice.com/frontend/og-image.png"
        />
      </Helmet>
      <HeroSection />
      <HowDoesItWork />
      <EducationAndAwareness />
      <LatestPosts />
    </CenterLayout>
  );
}

/* Join us in our mission to recycle, repurpose, and rise to the challenge of building a more sustainable world. Together, we can make a difference, one recyclable at a time. */
