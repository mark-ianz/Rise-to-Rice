import { cn } from "@/lib/utils";
import { forwardRef } from "react";

type Props = {
  src: string | undefined;
  alt?: string;
  containerClassName?: string;
  imgClassName?: string;
};

const ImageDisplay = forwardRef<HTMLImageElement, Props>(
  ({ src, alt, containerClassName, imgClassName }, ref) => {
    return (
      <div
        className={cn(
          "w-full rounded-md aspect-square max-h-96 bg-secondary-light-2",
          containerClassName
        )}
      >
        <img
          ref={ref}
          src={src}
          alt={alt}
          loading="lazy"
          className={cn(
            "w-full h-full object-contain rounded-md",
            imgClassName
          )}
        />
      </div>
    );
  }
);

export default ImageDisplay;
