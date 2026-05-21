import { Button } from "@/components/ui/button";
import useUserContext from "@/hooks/useUserContext";
import companyLogo from "@/assets/COMPONY LOGO NO BG.png";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import InputText from "@/components/general/InputText";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { ZodError } from "zod";
import ZodErrorDisplay from "@/components/general/ZodErrorDisplay";
import { allowedUploadTypes } from "@/lib/const";
import LoadingComponent from "@/components/general/LoadingComponent";
import { AnnouncementCreateSchema } from "@/schema/PostAnnouncementSchema";
import ViewImage from "@/components/general/ViewImage";
import { usePostAnnouncement } from "@/hooks/query/useAnnouncement";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { Image, Megaphone, Plus, FileUp } from "lucide-react";
import { getAnnouncementUrl } from "@/utils/url";
import { FLARE_OPTIONS, FLARES, type FlareType } from "@/lib/flares";
import { useTranslation } from "react-i18next";

export default function PostAnnouncementButton() {
  const { state: user } = useUserContext();

  // refs
  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null); // ref for the input file

  const { i18n } = useTranslation();
  const currentLang = i18n.language || "en";

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedFlare, setSelectedFlare] = useState<string>("General");

  // errors
  const [errors, setErrors] = useState<string[]>([]);

  // image source (if there is)
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  const { mutate, isPending, isSuccess, data } = usePostAnnouncement();

  useEffect(() => {
    if (isSuccess) {
      if (titleRef.current) titleRef.current.value = "";
      if (descriptionRef.current) descriptionRef.current.value = "";
      if (imageInputRef.current) imageInputRef.current.value = "";

      setImageSrc(null);
      setSelectedFlare("General");
      setErrors([]);
      setIsOpen(false);

      toast.success(
        <span className="flex flex-col gap-0.5">
          <span className="font-bold text-slate-800">Announcement posted successfully!</span>
          <Link
            to={getAnnouncementUrl(data)}
            className="text-emerald-600 hover:text-emerald-700 font-semibold text-xs flex items-center gap-1 mt-1 hover:underline"
          >
            View it here
          </Link>
        </span>
      );
    }
  }, [isSuccess, data]);

  const handleAnnouncementPost = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors([]);

    try {
      const parsedData = AnnouncementCreateSchema.parse({
        title: titleRef.current!.value,
        description: descriptionRef.current?.value,
        image: imageInputRef.current?.files?.[0],
        flare: selectedFlare,
      });
      const formData = new FormData();

      formData.append("title", parsedData.title);
      if (parsedData.description)
        formData.append("description", parsedData.description);
      formData.append("flare", parsedData.flare);

      if (parsedData.image) {
        formData.append("image", parsedData.image);
      }

      mutate(formData, {
        onSuccess: () => {
          setIsOpen(false);
        },
        onError: (error) => {
          if (error instanceof ZodError) {
            setErrors(error.errors.map((err) => err.message));
          } else {
            setErrors([error.message]);
          }
        },
      });
    } catch (error) {
      if (error instanceof ZodError) {
        setErrors(error.errors.map((err) => err.message));
      }
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    setErrors([]);
    const image = e.target.files?.[0];

    if (!image) {
      setImageSrc(null);
      return;
    }

    if (!allowedUploadTypes.includes(image?.type)) {
      setErrors([
        "Invalid file type. Only png, jpeg, jpg and webp are allowed.",
      ]);
      return;
    }

    const src = URL.createObjectURL(image);
    setImageSrc(src);
  };

  return (
    user?.isAdmin && (
      <Dialog onOpenChange={setIsOpen} open={isOpen}>
        <DialogTrigger asChild>
          {/* Native Feed-Composer Trigger Card */}
          <div
            onClick={() => setImageSrc(null)}
            className="bg-white p-5 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_15px_45px_rgba(45,90,39,0.04)] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer flex flex-col gap-4 w-full"
          >
            {/* Upper Composer Block */}
            <div className="flex items-center gap-3 w-full">
              {/* User Avatar */}
              <div className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center bg-white p-0.5 select-none shadow-sm overflow-hidden ring-2 ring-emerald-100/50">
                <img
                  src={companyLogo}
                  alt="Rise to Rice Logo"
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Mock Input Placeholder */}
              <div className="flex-1 bg-slate-50 hover:bg-slate-100/70 border border-slate-100/60 rounded-full py-2.5 px-5 text-slate-400 text-xs sm:text-sm font-medium transition-colors text-left select-none">
                Write an official community announcement...
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-slate-50 w-full" />

            {/* Lower Quick Action Bar */}
            <div className="flex items-center gap-4 justify-between max-xsm:flex-col max-xsm:items-start max-xsm:gap-3">
              <div className="flex gap-4">
                <span className="flex items-center gap-1.5 text-xs text-slate-500 font-bold hover:text-emerald-600 transition-colors">
                  <Image className="w-4 h-4 text-emerald-500" />
                  <span>Photo / Image</span>
                </span>
                <span className="flex items-center gap-1.5 text-xs text-slate-500 font-bold hover:text-blue-600 transition-colors">
                  <Megaphone className="w-4 h-4 text-blue-500" />
                  <span>Official Alert</span>
                </span>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold hover:bg-emerald-100/80 transition-all select-none">
                <Plus className="w-3.5 h-3.5" /> Post Announcement
              </span>
            </div>
          </div>
        </DialogTrigger>

        {/* Redesigned Composer Dialog */}
        <DialogContent onInteractOutside={(e) => e.preventDefault()} className="rounded-3xl border border-slate-100 shadow-2xl p-6 sm:p-8 max-w-[500px]">
          <form
            className="flex flex-col gap-5"
            onSubmit={handleAnnouncementPost}
          >
            <div className="flex flex-col gap-1">
              <DialogHeader>
                <DialogTitle className="text-xl font-extrabold text-slate-800 flex items-center gap-1.5">
                  Post Announcement
                </DialogTitle>
              </DialogHeader>
              <DialogDescription className="text-slate-400 text-xs">
                Draft an announcement to keep the Rise to Rice community informed and engaged.
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

              {/* Description inputs */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                  Description / Content
                </label>
                <textarea
                  ref={descriptionRef}
                  rows={6}
                  className="text-sm text-slate-600 border border-slate-200/80 hover:border-slate-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl outline-none px-4 py-3 min-h-[140px] transition-all leading-relaxed font-roboto placeholder:text-slate-300"
                  placeholder="Share details about upcoming clean-ups, events, statistics, or rewards..."
                />
              </div>

              {/* File Upload inputs */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1">
                  <FileUp className="w-3.5 h-3.5 text-slate-400" />
                  Upload Hero Image (Optional)
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
                      <ViewImage src={imageSrc} alt="Image uploaded by the user.">
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
                onClick={() => setIsOpen(false)}
                className="rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50"
              >
                Cancel
              </Button>
              <Button
                disabled={isPending}
                type="submit"
                className="rounded-xl px-5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white min-w-[80px]"
              >
                {isPending ? <LoadingComponent /> : "Post"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    )
  );
}
