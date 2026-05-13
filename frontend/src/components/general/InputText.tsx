import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import {
  ChangeEventHandler,
  forwardRef,
  HTMLInputTypeAttribute,
  LegacyRef,
} from "react";

type Props = {
  label: string;
  placeholder?: string;
  inputClassName?: string;
  wrapperClassName?: string;
  type: HTMLInputTypeAttribute;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  value?: string | undefined | undefined | number | Date;
  ref?: LegacyRef<HTMLInputElement> | undefined;
  readOnly?: boolean;
  disabled?: boolean;
  labelClassname?: string;
  name: string;
  defaultValue?: string;
  autoFocus?: boolean;
  step?: string | number;
  autoComplete?: string;
};

const InputText = forwardRef<HTMLInputElement, Props>(
  (
    {
      label,
      placeholder,
      inputClassName,
      wrapperClassName,
      type,
      onChange,
      value,
      readOnly = false,
      disabled = false,
      labelClassname,
      name,
      defaultValue,
      autoFocus,
      step,
      autoComplete,
    },
    ref
  ) => {
    return (
      <span className={cn("flex flex-col gap-1", wrapperClassName)}>
        <p className={cn("text-sm", labelClassname)}>{label}</p>
        <Input
          step={step}
          autoFocus={autoFocus}
          autoComplete={autoComplete}
          defaultValue={defaultValue}
          name={name}
          disabled={disabled}
          readOnly={readOnly}
          ref={ref}
          value={value?.toString()}
          onChange={onChange}
          type={type}
          placeholder={placeholder}
          className={cn(
            "bg-white max-md:text-sm max-xsm:text-xs",
            inputClassName
          )}
        />
      </span>
    );
  }
);

export default InputText;
