import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useGetAnnouncementReactions } from "@/hooks/query/useReactions";
import { SmilePlus } from "lucide-react";
import ReactionsList from "./ReactionsList";
import { useState } from "react";

type Props = {
  announcement_id: number;
};

export default function ReactionCount({ announcement_id }: Props) {
  const { data: reactions, isLoading } =
    useGetAnnouncementReactions(announcement_id);
  const [open, setOpen] = useState(false);

  if (!reactions) return null;
  if (isLoading) return <p>Loading</p>;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <span className="flex items-center gap-1 text-sm border-b w-fit border-tertiary/0 hover:border-tertiary cursor-pointer">
          <SmilePlus size={14} /> {reactions?.length}{" "}
        </span>
      </DialogTrigger>
      <ReactionsList reactions={reactions} announcement_id={announcement_id}/>
    </Dialog>
  );
}
