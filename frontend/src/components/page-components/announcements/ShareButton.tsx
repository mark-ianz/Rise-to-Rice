import { Button } from "@/components/ui/button";
import { Link } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

type Props = { announcement_id: number };

export default function ShareButton({ announcement_id }: Props) {
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
      // Clipboard API not available
      fallbackCopy(text);
    }
  };

  const fallbackCopy = (text: string) => {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed"; // prevents scrolling
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
    const post_link = `${base_url}/announcements/${announcement_id}`;
    await copyToClipboard(post_link);

    toast.success(
      <span className="flex flex-col">
        <span>{t("toast.success")}</span>
        <span className="font-normal">{t("toast.subtext")}</span>
      </span>
    );
  };
  return (
    <Button
      className="max-md:text-xs"
      variant={"secondary"}
      onClick={handleCopyLink}
      size={"sm"}
    >
      <Link size={20} />
      <p>{t("button.share")}</p>
    </Button>
  );
}
