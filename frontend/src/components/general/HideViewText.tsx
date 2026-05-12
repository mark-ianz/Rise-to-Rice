import { ReactNode, useState } from "react";

type Props = {
  children: ReactNode;
};

export default function HideViewText({ children }: Props) {
  const [isHidden, setIsHidden] = useState(true);

  return !isHidden ? (
    <span className="flex flex-col items-center">
      {children}
      <span
        onClick={() => setIsHidden(true)}
        className="text-sm text-tertiary underline cursor-pointer w-fit"
      >
        Hide
      </span>
    </span>
  ) : (
    <span
      className="text-sm text-tertiary underline cursor-pointer"
      onClick={() => setIsHidden(false)}
    >
      Show
    </span>
  );
}
