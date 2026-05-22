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
import { allowedUploadTypes } from "@/lib/const";
import ViewImage from "@/components/general/ViewImage";
import { FileUp } from "lucide-react";
import { FLARE_OPTIONS, FLARES } from "@/lib/flares";
import { useTranslation } from "react-i18next";

type Props = {
  announcement: Announcement;
  children?: React.ReactNode;
};

export default function EditAnnouncementButton({ announcement, children }: Props) {
  // refs
  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const { i18n } = useTranslation();
  const currentLang = i18n.language || "en";

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedFlare, setSelectedFlare] = useState<string>(announcement.flare || "General");
  const [imageSrc, setImageSrc] = useState<string | null>(announcement.image_url || null);
  const [errors, setErrors] = useState<string[]>([]);

  const { mutate, isPending } = useUpdateAnnouncement();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!allowedUploadTypes.includes(file.type)) {
      setErrors([
        "Invalid file type. Only png, jpeg, jpg and webp are allowed.",
      ]);
      return;
    }

    const src = URL.createObjectURL(file);
    setImageSrc(src);
    setErrors([]);
  };

  const handleUpdateSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const title = titleRef.current?.value;
    const description = descriptionRef.current?.value;
    const imageFile = imageInputRef.current?.files?.[0];

    try {
      const parsed = UpdateAnnouncementSchema.parse({
        title,
        description,
        announcement_id: announcement.announcement_id,
        flare: selectedFlare,
      });

      const formData = new FormData();
      formData.append("title", parsed.title);
      if (parsed.description !== undefined) {
        formData.append("description", parsed.description || "");
      }
      formData.append("announcement_id", parsed.announcement_id);
      formData.append("flare", parsed.flare);
      if (imageFile) {
        formData.append("image", imageFile);
      }

      mutate(formData, {
        onSuccess: () => {
          setIsOpen(false);
          toast.success("Announcement updated successfully!");
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

  return (
    <Dialog onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) {
        setImageSrc(announcement.image_url || null);
        setSelectedFlare(announcement.flare || "General");
        setErrors([]);
      }
    }} open={isOpen}>
      <DialogTrigger asChild>
        {children ? children : (
          <Button variant={"secondary"} className="">
            Edit
          </Button>
        )}
      </DialogTrigger>
      <DialogContent onInteractOutside={(e) => e.preventDefault()} className="rounded-3xl border border-slate-100 shadow-2xl p-6 sm:p-8 max-w-[500px] [@media(max-height:850px)]:max-h-[90vh] [@media(max-height:850px)]:overflow-y-auto">
        <form onSubmit={handleUpdateSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <DialogHeader>
              <DialogTitle className="text-xl font-extrabold text-slate-800 flex items-center gap-1.5">
                Edit Announcement
              </DialogTitle>
            </DialogHeader>
            <DialogDescription className="text-slate-400 text-xs">
              Fill out the details below to update the announcement post.
            </DialogDescription>
          </div>

          <div className="flex flex-col gap-4">
            {/* Title input */}
            <InputText
              labelClassname="text-xs font-bold text-slate-500 uppercase tracking-wide"
              label="Announcement Title"
              type="text"
              name="announcement-title"
              ref={titleRef}
              defaultValue={announcement.title}
              inputClassName="rounded-xl border-slate-200/80 focus-visible:ring-emerald-500 focus-visible:border-emerald-500"
            />

            {/* Flare selection */}
            <div className="flex flex-col gap-3">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                Announcement Flare / Tag <span className="text-red-500">*</span>
              </label>
              
              {/* Grouped selector container */}
              <div className="flex flex-col gap-3.5 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                {/* Operational Group */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Operational</span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {FLARE_OPTIONS.filter(f => FLARES[f].group === "operational").map((flare) => {
                      const config = FLARES[flare];
                      const Icon = config.icon;
                      const isActive = selectedFlare === flare;
                      return (
                        <button
                          key={flare}
                          type="button"
                          onClick={() => setSelectedFlare(flare)}
                          className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-lg border transition-all duration-200 active:scale-95 ${
                            isActive ? config.active + " border-transparent" : config.formInactive + " bg-white"
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          <span>{config.label[currentLang === "tl" ? "tl" : "en"]}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-slate-200/60" />

                {/* Program-Specific Group */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Program-Specific</span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {FLARE_OPTIONS.filter(f => FLARES[f].group === "program").map((flare) => {
                      const config = FLARES[flare];
                      const Icon = config.icon;
                      const isActive = selectedFlare === flare;
                      return (
                        <button
                          key={flare}
                          type="button"
                          onClick={() => setSelectedFlare(flare)}
                          className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-lg border transition-all duration-200 active:scale-95 ${
                            isActive ? config.active + " border-transparent" : config.formInactive + " bg-white"
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          <span>{config.label[currentLang === "tl" ? "tl" : "en"]}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-slate-200/60" />

                {/* Community & Engagement Group */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Community & Engagement</span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {FLARE_OPTIONS.filter(f => FLARES[f].group === "community").map((flare) => {
                      const config = FLARES[flare];
                      const Icon = config.icon;
                      const isActive = selectedFlare === flare;
                      return (
                        <button
                          key={flare}
                          type="button"
                          onClick={() => setSelectedFlare(flare)}
                          className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-lg border transition-all duration-200 active:scale-95 ${
                            isActive ? config.active + " border-transparent" : config.formInactive + " bg-white"
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          <span>{config.label[currentLang === "tl" ? "tl" : "en"]}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Description input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                Description / Content
              </label>
              <textarea
                ref={descriptionRef}
                rows={6}
                className="text-sm text-slate-600 border border-slate-200/80 hover:border-slate-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl outline-none px-4 py-3 min-h-[140px] transition-all leading-relaxed font-roboto placeholder:text-slate-300"
                defaultValue={announcement.description}
                placeholder="Share details about upcoming clean-ups, events, statistics, or rewards..."
              />
            </div>

            {/* Image upload */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1">
                <FileUp className="w-3.5 h-3.5 text-slate-400" />
                Update Hero Image (Optional)
              </label>
              <InputText
                label=""
                onChange={handleImageChange}
                ref={imageInputRef}
                type="file"
                name="announcement-image"
                inputClassName="rounded-xl border-slate-200/80 text-xs file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-slate-50 file:text-slate-600 hover:file:bg-slate-100 transition-all"
              />

              {imageSrc && (
                <div className="w-full flex flex-col items-center rounded-xl p-3 border border-dashed border-slate-200 bg-slate-50/50 mt-2 max-lg:text-sm">
                  <p className="text-[11px] font-bold text-slate-400 mb-2 uppercase tracking-wider">Image Preview</p>
                  <div className="rounded-lg overflow-hidden max-h-48 shadow-sm">
                    <ViewImage src={imageSrc} alt="Announcement image preview">
                      <img src={imageSrc} className="w-full object-contain max-h-48" />
                    </ViewImage>
                  </div>
                </div>
              )}
            </div>
          </div>

          <ZodErrorDisplay error={errors} />

          <div className="flex justify-end gap-3 mt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setIsOpen(false);
                setImageSrc(announcement.image_url || null);
                setErrors([]);
              }}
              className="rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50"
            >
              Cancel
            </Button>
            <Button
              disabled={isPending}
              type="submit"
              className="rounded-xl px-5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white min-w-[80px]"
            >
              {isPending ? <LoadingComponent /> : "Update"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
