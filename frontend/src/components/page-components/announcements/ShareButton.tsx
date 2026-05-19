import { Button } from "@/components/ui/button";
import { Link } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Announcement } from "@/types/announcements";
import { getAnnouncementUrl } from "@/utils/url";

type Props = { announcement: Announcement };

export default function ShareButton({ announcement }: Props) {
  const { t } = useTranslation("announcements");
  const base_url = import.meta.env.VITE_FRONTEND_BASE_URL;

  const copyToClipboard = async (text: string) => {
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
      } catch (err) {
        console.error("Clipboard API failed:", err);
        fallbackCopy(text);
      }
    } else {
      fallbackCopy(text);
    }
  };

  const fallbackCopy = (text: string) => {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    try {
      document.execCommand("copy");
    } catch (err) {
      console.error("Fallback copy failed:", err);
    }
    document.body.removeChild(textarea);
  };

  const handleCopyLink = async () => {
    const post_link = `${base_url}${getAnnouncementUrl(announcement)}`;
    await copyToClipboard(post_link);

    toast.success(
      <span className="flex flex-col gap-0.5">
        <span className="font-bold text-slate-800">{t("toast.success")}</span>
        <span className="font-normal text-slate-500 text-xs">{t("toast.subtext")}</span>
      </span>
    );
  };

  return (
    <Button
      className="rounded-full px-4 h-9 flex items-center gap-1.5 border border-slate-200/80 bg-white hover:bg-slate-50 hover:border-slate-300 hover:scale-[1.02] text-slate-600 font-semibold shadow-sm transition-all duration-200 [&_svg]:size-4 max-md:text-xs"
      onClick={handleCopyLink}
      size={"sm"}
    >
      <Link className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
      <span className="text-xs">{t("button.share")}</span>
    </Button>
  );
}
