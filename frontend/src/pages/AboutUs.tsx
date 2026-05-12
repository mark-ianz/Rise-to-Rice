import BESWMC from "@/components/page-components/about-us/BESWMC";
import HeroSection from "@/components/page-components/about-us/HeroSection";
import MissionVision from "@/components/page-components/about-us/MissionVision";
import OurPartners from "@/components/page-components/about-us/OurPartners";
import { Helmet } from "react-helmet";

export default function AboutUs() {
  return (
    <>
      <Helmet>
        <title>About Us | Rise to Rice</title>
        <meta
          name="description"
          content="Learn more about Rise to Rice, our mission, policies, and the team behind the platform."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://risetorice.com/about-us" />

        <meta property="og:title" content="About Us — Rise to Rice" />
        <meta
          property="og:description"
          content="Learn more about Rise to Rice, our mission, policies, and the team behind the platform."
        />
        <meta property="og:url" content="https://risetorice.com/about-us" />
        <meta
          property="og:image"
          content="https://risetorice.com/frontend/og-image.png"
        />
      </Helmet>
      <HeroSection />
      <MissionVision />
      <OurPartners />
      <BESWMC />
    </>
  );
}
