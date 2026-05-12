import { ChangeEvent, forwardRef, useState } from "react";
import { Eye, EyeClosed } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

type Props = {
  label: string;
  name: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  value?: string;
};

const PasswordInput = forwardRef<HTMLInputElement, Props>(
  ({ name, label, onChange, value }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div>
        <p className="text-sm">{label}</p>
        <div className="relative w-full">
          <Input
            onChange={onChange}
            ref={ref}
            name={name}
            value={value}
            type={showPassword ? "text" : "password"}
            className="bg-white max-md:text-sm max-xsm:text-xs pr-10"
          />
          <Button
            size={"icon"}
            asChild
            onClick={() => setShowPassword((prev) => !prev)}
            variant={"ghost"}
            className="cursor-pointer absolute right-1 top-1/2 translate-x-0 -translate-y-1/2 h-7 w-7"
          >
            <span>{showPassword ? <EyeClosed /> : <Eye />}</span>
          </Button>
        </div>
      </div>
    );
  }
);

export default PasswordInput;
