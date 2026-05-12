import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  const { t, i18n } = useTranslation("global");

  return (
    <div className="flex flex-col items-center justify-center w-full h-full grow text-center p-4">
      <h1 className="text-6xl font-bold text-tertiary mb-4">404 ERROR</h1>
      <p className="text-xl text-muted-foreground mb-8">
        {t("error.page_not_found")}
      </p>
      <Link to="/" className="underline">{i18n.language === "en" ? "Go Home" : "Bumalik"}</Link>
    </div>
  );
}
