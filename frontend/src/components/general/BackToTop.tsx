import { ArrowUp } from "lucide-react";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { useTranslation } from "react-i18next";

export default function BackToTop() {
  const { t } = useTranslation("global");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Check if the page is scrolled more than 200px
      if (window.scrollY > 200) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
    });
  };

  return (
    <TooltipProvider>
      <Tooltip delayDuration={200}>
        <TooltipContent>{t("back_to_top")}</TooltipContent>
        <TooltipTrigger asChild>
          <Button
            className={cn(
              "w-12 h-12 rounded-full fixed bottom-6 right-6 z-[98] hidden bg-primary-main-light hover:bg-primary-main max-md:right-2 max-md:bottom-2 max-sm:w-10 max-sm:h-10",
              isVisible && "flex"
            )}
            onClick={scrollToTop}
          >
            <ArrowUp />
          </Button>
        </TooltipTrigger>
      </Tooltip>
    </TooltipProvider>
  );
}
