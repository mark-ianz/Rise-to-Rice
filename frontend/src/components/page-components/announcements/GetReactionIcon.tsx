import AngryReact from "@/components/icons/AngryReact";
import HahaReact from "@/components/icons/HahaReact";
import HeartReact from "@/components/icons/HeartReact";
import LikeReact from "@/components/icons/LikeReact";
import SadReact from "@/components/icons/SadReact";
import WowReact from "@/components/icons/WowReact";
import { Reaction } from "@/types/reactions";

type Props = {
  reaction: Reaction;
  className?: string;
};

export default function GetReactionIcon({ reaction, className }: Props) {
  switch (reaction) {
    case "Like":
      return <LikeReact className={className} />;
    case "Heart":
      return <HeartReact className={className} />;
    case "Haha":
      return <HahaReact className={className} />;
    case "Wow":
      return <WowReact className={className} />;
    case "Sad":
      return <SadReact className={className} />;
    case "Angry":
      return <AngryReact className={className} />;
    default:
      return <LikeReact className={className} />;
  }
}
