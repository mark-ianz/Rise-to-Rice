import { Button } from "@/components/ui/button";
import useUserContext from "@/hooks/useUserContext";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export default function GetStartedButton({
  className,
}: {
  className?: string;
}) {
  const { t } = useTranslation("landing_page");
  const { state } = useUserContext();
  const navigate = useNavigate();

  return (
    <Button
      onClick={() => navigate(state.user_id ? "/profile" : "/login")}
      className={cn(
        "py-6",
        className
      )}
    >
      <p className="max-lg:text-xs">
        {state.user_id ? t("hero.button.profile") : t("hero.button.get_started")}
      </p>
    </Button>
  );
}
