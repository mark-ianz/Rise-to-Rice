import InputText from "@/components/general/InputText";
import LoadingComponent from "@/components/general/LoadingComponent";
import ZodErrorDisplay from "@/components/general/ZodErrorDisplay";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useUpdateAnnouncement } from "@/hooks/query/useAnnouncement";
import { formatZodErrors } from "@/lib/format";
import { UpdateAnnouncementSchema } from "@/schema/PostAnnouncementSchema";
import { Announcement } from "@/types/announcements";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { ZodError } from "zod";

type Props = { announcement: Announcement };

export default function EditAnnouncementButton({ announcement }: Props) {
  // refs
  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { mutate, isPending } = useUpdateAnnouncement();

  const handleUpdateSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const title = titleRef.current?.value;
    const description = descriptionRef.current?.value;

    try {
      const parsed = UpdateAnnouncementSchema.parse({
        title,
        description,
        announcement_id: announcement.announcement_id,
      });

      mutate(parsed, {
        onSuccess: () => {
          setIsOpen(false);
          toast.success("Announcement updated successfully!");
          if (titleRef.current) titleRef.current.value = "";
          if (descriptionRef.current) descriptionRef.current.value = "";
          setErrors([]);
        },
        onError: (error) => {
          toast.error("Failed to update announcement.");
          console.error("Unexpected error:", error);
          setErrors(["An unexpected error occurred."]);
        },
      });
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = formatZodErrors(error);
        setErrors(formattedErrors);
      } else {
        console.error("Unexpected error:", error);
        setErrors(["An unexpected error occurred."]);
      }
    }
  };

  // errors
  const [errors, setErrors] = useState<string[]>([]);
  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger asChild>
        <Button variant={"secondary"} className="">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent onInteractOutside={(e) => e.preventDefault()}>
        <form onSubmit={handleUpdateSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <DialogHeader>
              <DialogTitle className="text-center">
                Edit Announcement
              </DialogTitle>
            </DialogHeader>
            <DialogDescription>
              Fill out the form below to update the announcement.
            </DialogDescription>
          </div>
          <div className="flex flex-col gap-2">
            <InputText
              labelClassname="text-sm"
              label="Title"
              type="text"
              name="announcement-title"
              ref={titleRef}
              defaultValue={announcement.title}
            />
            <textarea
              ref={descriptionRef}
              rows={7}
              className="text-sm border rounded-md outline-none px-4 py-2"
              defaultValue={announcement.description}
              placeholder="(Optional)"
            />
          </div>
          <ZodErrorDisplay error={errors} />
          <Button disabled={isPending} type="submit">
            {isPending ? <LoadingComponent /> : "Update"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
