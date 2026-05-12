// forward ref component

import { ChangeEventHandler, forwardRef, LegacyRef } from "react";
import { Input } from "../ui/input";
import ZodErrorDisplay from "./ZodErrorDisplay";

type Props = {
  ref?: LegacyRef<HTMLInputElement> | undefined;
  error?: string[] | null;
  input: string;
  actionText: string;
  value?: string | number;
  onValueChange?: ChangeEventHandler<HTMLInputElement>;
};

export const ConfirmationInput = forwardRef<HTMLInputElement, Props>(
  ({ error, input, actionText, value, onValueChange }, ref) => {
    return (
      <div className="flex flex-col gap-2">
        <p className="text-sm text-muted-foreground">
          Type <strong>{input}</strong> {actionText}.
        </p>
        <Input
          autoFocus
          onChange={onValueChange}
          value={value}
          type="text"
          name="delete-confirm"
          ref={ref}
        />
        {error?.length && <ZodErrorDisplay error={error} />}
      </div>
    );
  }
);
