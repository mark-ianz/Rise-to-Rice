import { ChangeEvent, forwardRef, useState } from "react";
import { Eye, EyeClosed } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";

type Props = {
  label: string;
  name: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  inputClassName?: string;
  wrapperClassName?: string;
  labelClassName?: string;
  placeholder?: string;
  autoComplete?: string;
  toggleButtonClassName?: string;
};

const PasswordInput = forwardRef<HTMLInputElement, Props>(
  (
    {
      name,
      label,
      onChange,
      value,
      inputClassName,
      wrapperClassName,
      labelClassName,
      placeholder,
      autoComplete,
      toggleButtonClassName,
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div className={cn("flex flex-col gap-1", wrapperClassName)}>
        <p className={cn("text-sm", labelClassName)}>{label}</p>
        <div className="relative w-full">
          <Input
            onChange={onChange}
            ref={ref}
            name={name}
            value={value}
            autoComplete={autoComplete}
            placeholder={placeholder}
            type={showPassword ? "text" : "password"}
            className={cn(
              "bg-white pr-10 max-md:text-sm max-xsm:text-xs",
              inputClassName
            )}
          />
          <Button
            type="button"
            size={"icon"}
            onClick={() => setShowPassword((prev) => !prev)}
            variant={"ghost"}
            className={cn(
              "absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 cursor-pointer",
              toggleButtonClassName
            )}
          >
            {showPassword ? <EyeClosed /> : <Eye />}
          </Button>
        </div>
      </div>
    );
  }
);

export default PasswordInput;
