import { cn } from "@/lib/utils";
import React from "react";

type Props = {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  bg: string;
};

export default function Card({ title, value, icon, bg }: Props) {
  return (
    <li
      key={title}
      className={cn(
        "h-60 flex flex-col justify-center shadow-md p-6 rounded-md gap-10 text-secondary-light",
        bg
      )}
    >
      <span className="flex items-center justify-center flex-col gap-2">
        {icon}
        <span className="font-semibold text-center text-lg">{title}</span>
      </span>
      <p className="font-thin mt-auto text-lg">{value}</p>
    </li>
  );
}
