import { Button } from "@/components/ui/button";
import { Announcement } from "@/types/announcements";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ReactButton from "./reactions/ReactButton";
import { useTranslation } from "react-i18next";
import ShareButton from "./ShareButton";
import { getAnnouncementUrl } from "@/utils/url";

type Props = {
  announcement: Announcement;
  viewing?: boolean;
};

export default function AnnouncementFooter({ announcement, viewing }: Props) {
  const { t } = useTranslation("announcements");
  const navigate = useNavigate();

  return (
    <div className="flex gap-2.5 items-center w-full flex-wrap">
      {/* React Button Pill Trigger */}
      <ReactButton announcement_id={announcement.announcement_id} />
      
      {/* View Post Detail Pill */}
      {!viewing && (
        <Button
          size={"sm"}
          className="rounded-full px-4 h-9 flex items-center gap-1.5 border border-slate-200/80 bg-white hover:bg-slate-50 hover:border-slate-300 hover:scale-[1.02] text-slate-600 font-semibold shadow-sm transition-all duration-200 [&_svg]:size-4 max-md:text-xs"
          onClick={() =>
            navigate(getAnnouncementUrl(announcement))
          }
        >
          <Eye className="w-4 h-4 text-slate-400" />
          <span className="text-xs">{t("button.view_post")}</span>
        </Button>
      )}
      
      {/* Share Button Pill */}
      <ShareButton announcement={announcement} />
    </div>
  );
}
