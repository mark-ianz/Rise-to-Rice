import man_recycling from "@/assets/Young man bringing a bottle for recycling.png";
import { useTranslation } from "react-i18next";

export default function RightSide() {
  const { t } = useTranslation("register");

  return (
    <div className="rounded-r-xl bg-secondary-light-2/75 flex items-center justify-center flex-col px-10 py-4 text-center gap-4 max-lg:rounded-none">
      <div className="w-72 max-sm:w-52">
        <img
          loading="lazy"
          className="w-full h-auto"
          src={man_recycling}
          alt="Young man bringing a bottle for recycling"
        />
      </div>
      <div className="flex flex-col gap-4">
        <p className="max-sm:text-sm">{t("right_side.paragraph_1")}</p>
        <p className="text-sm max-sm:text-xs">{t("right_side.paragraph_2")}</p>
      </div>
    </div>
  );
}
