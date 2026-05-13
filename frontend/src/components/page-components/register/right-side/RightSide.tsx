import AuthHeroPanel from "@/components/page-components/auth/AuthHeroPanel";
import { useTranslation } from "react-i18next";

export default function RightSide() {
  const { t } = useTranslation("register");

  const registerFeatures = [
    {
      title: "Verified Community",
      description: "Join a trusted network of individuals committed to making a positive impact.",
    },
    {
      title: "Seamless Experience",
      description: "Enjoy a streamlined onboarding process designed to get you started quickly.",
    },
    {
      title: "Direct Communication",
      description: "Connect easily with other members to share tips, updates, and progress.",
    },
  ];

  return (
    <AuthHeroPanel
      title={
        <>
          Make an
          <br />
          Impact.
        </>
      }
      description={t("hero.description", "Join a community dedicated to sustainability. Start recycling, track your contributions, and earn exclusive rewards for making a real difference.")}
      features={registerFeatures}
    />
  );
}
