import { ReactNode } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { cn } from "@/lib/utils";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { Button } from "../ui/button";
import { X } from "lucide-react";

type Props = {
  children: ReactNode | string;
  src: string;
  alt?: string;
  className?: string;
};

export default function ViewImage({ children, src, alt, className }: Props) {
  return (
    <Dialog>
      <DialogTrigger
        className={cn(className, "flex items-center justify-center")}
      >
        {children}
      </DialogTrigger>
      <DialogContent
        className={cn(
          "p-0 border-0 h-dvh w-screen max-h-[90vh] max-w-[90vw] shadow-none flex items-center justify-center focus:outline-none [&>button]:hidden bg-secondary-light-2 opacity-100"
        )}
        aria-describedby={undefined}
      >
        <VisuallyHidden.Root>
          <DialogTitle>Image</DialogTitle>
        </VisuallyHidden.Root>
        <div className="flex items-center justify-center h-full">
          <DialogClose className="absolute top-4 right-4" asChild>
            <Button
              variant={"default"}
              size={"icon"}
              className="rounded-full w-6 h-6 p-4"
            >
              <X />
            </Button>
          </DialogClose>
          <img loading="lazy" src={src} alt={alt} className="w-full h-full object-contain" />
        </div>
      </DialogContent>
    </Dialog>
  );
}
