import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Reaction, ReactionQuery } from "@/types/reactions";
import { GroupedReactions, groupReactionsByType } from "@/utils/reaction";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GetReactionIcon from "../GetReactionIcon";
import RenderReactors from "./RenderReactors";
import { useTranslation } from "react-i18next";

type Props = {
  reactions: ReactionQuery[];
  announcement_id: string;
};

export default function ReactionsList({ reactions, announcement_id }: Props) {
  const { t } = useTranslation("announcements");

  const groupedReactions = groupReactionsByType(reactions);

  const keys = Object.keys(groupedReactions) as Array<keyof GroupedReactions>;

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{t("reactions_list.title")}</DialogTitle>
        <DialogDescription>{t("reactions_list.subtext")}</DialogDescription>
      </DialogHeader>
      {reactions.length > 0 ? (
        <Tabs defaultValue="all">
          <TabsList className="h-auto p-2 w-full justify-start">
            <TabsTrigger value="all" className="min-w-14">
              {t("reactions_list.all")}
            </TabsTrigger>
            {keys.map((reaction, index) => {
              const hasReactions = groupedReactions[reaction].length > 0;

              return (
                hasReactions && (
                  <TabsTrigger
                    className="p-2 min-w-14"
                    key={reaction + index + announcement_id}
                    value={reaction}
                  >
                    <GetReactionIcon
                      className="w-4"
                      reaction={reaction as Reaction}
                    />
                  </TabsTrigger>
                )
              );
            })}
          </TabsList>
          <TabsContent value={"all"}>
            <RenderReactors
              reaction={"all"}
              announcement_id={announcement_id}
            />
          </TabsContent>
          {keys.map((reaction, index) => (
            <TabsContent
              value={reaction}
              key={reaction + index + announcement_id}
            >
              <RenderReactors
                reaction={reaction}
                announcement_id={announcement_id}
              />
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        <p className="text-tertiary text-sm">
          {t("reactions_list.no_reactions")}
        </p>
      )}
    </DialogContent>
  );
}
