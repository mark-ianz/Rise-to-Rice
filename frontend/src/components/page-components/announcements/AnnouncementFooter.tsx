import { Button } from "@/components/ui/button";
import { Announcement } from "@/types/announcements";
import { File } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ReactButton from "./reactions/ReactButton";
import { useTranslation } from "react-i18next";
import ShareButton from "./ShareButton";

type Props = {
  announcement: Announcement;
  viewing?: boolean;
};

export default function AnnouncementFooter({ announcement, viewing }: Props) {
  const { t } = useTranslation("announcements");

  const navigate = useNavigate();

  return (
    <div className="flex gap-2">
      <ReactButton announcement_id={announcement.announcement_id} />
      {!viewing && (
        <Button
          size={"sm"}
          className="max-md:text-xs"
          variant={"secondary"}
          onClick={() =>
            navigate(`/announcements/${announcement.announcement_id}`)
          }
        >
          <File size={20} />
          <p>{t("button.view_post")}</p>
        </Button>
      )}
      <ShareButton announcement_id={announcement.announcement_id} />
    </div>
  );
}
