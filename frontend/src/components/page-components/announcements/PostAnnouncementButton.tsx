import { Button } from "@/components/ui/button";
import HeaderText from "@/components/general/HeaderText";
import useUserContext from "@/hooks/useUserContext";
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

export default function PostAnnouncementButton() {
  const { state: user } = useUserContext();

  // refs
  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null); // ref for the input file

  const [isOpen, setIsOpen] = useState<boolean>(false);

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
      setErrors([]);
      setIsOpen(false);

      toast.success(
        <span className="flex flex-col">
          Announcement posted successfully!
          <Link
            to={`/announcements/${data.announcement_id}`}
            className="text-blue-500 hover:underline"
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
      });
      const formData = new FormData();

      formData.append("title", parsedData.title);
      if (parsedData.description)
        formData.append("description", parsedData.description);

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
    // reset errors
    setErrors([]);

    // check if there is an existing image
    const image = e.target.files?.[0];

    if (!image) {
      setImageSrc(null);
      return;
    }

    // check if the file type is allowed
    if (!allowedUploadTypes.includes(image?.type)) {
      setErrors([
        "Invalid file type. Only png, jpeg, jpg and webp are allowed.",
      ]);
      return;
    }

    // generate the image source
    const src = URL.createObjectURL(image);
    setImageSrc(src);
  };

  return (
    user?.isAdmin && (
      <Dialog onOpenChange={setIsOpen} open={isOpen}>
        <DialogTrigger asChild>
          <Button
            onClick={() => setImageSrc(null)} // clear the image source when the dialog is clicked
            variant={"ghost"}
            className="bg-secondary-light border-tertiary border-dashed border-2 p-4 rounded-lg shadow-md hover:scale-105 transition-transform duration-200 cursor-pointer flex items-center justify-center h-20 hover:bg-secondary-light hover:brightness-105"
          >
            <HeaderText className="text-xl text-tertiary max-lg:text-md">
              Post New Announcement
            </HeaderText>
          </Button>
        </DialogTrigger>
        <DialogContent onInteractOutside={(e) => e.preventDefault()}>
          <form
            className="flex flex-col gap-4"
            onSubmit={handleAnnouncementPost}
          >
            <div className="flex flex-col gap-2">
              <DialogHeader>
                <DialogTitle className="text-center">
                  Post New Announcement
                </DialogTitle>
              </DialogHeader>
              <DialogDescription>
                Fill out the form below to post a new announcement.
              </DialogDescription>
            </div>
            <div className="flex flex-col gap-2">
              <InputText
                labelClassname="text-sm"
                label="Title"
                type="text"
                name="announcement-title"
                ref={titleRef}
              />
              <textarea
                ref={descriptionRef}
                rows={7}
                className="text-sm border rounded-md outline-none px-4 py-2"
                placeholder="(Optional)"
              />
              <span className="flex flex-col gap-4">
                <InputText
                  onChange={handleImageChange}
                  ref={imageInputRef}
                  labelClassname="text-sm"
                  label="Upload Image (Optional)"
                  type="file"
                  name="announcement-image"
                />
                {imageSrc && (
                  <div className="w-full flex flex-col items-center rounded-md max-lg:text-sm">
                    <ViewImage src={imageSrc} alt="Image uploaded by the user.">
                      <p className="text-tertiary">Image Preview</p>
                    </ViewImage>
                  </div>
                )}
              </span>
            </div>
            <ZodErrorDisplay error={errors} />
            <Button disabled={isPending} type="submit">
              {isPending ? <LoadingComponent /> : "Post"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    )
  );
}
