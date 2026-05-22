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
        "h-44 flex flex-col justify-between p-6 rounded-2xl shadow-sm text-white relative overflow-hidden group hover:shadow-md hover:-translate-y-0.5 transition-all duration-300",
        bg
      )}
    >
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50 pointer-events-none" />
      
      {/* Absolute positioned background icon for premium look */}
      <div className="absolute right-[-10px] bottom-[-10px] text-white/5 group-hover:scale-110 group-hover:text-white/10 transition-all duration-300 pointer-events-none">
        {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement, { size: 100 }) : icon}
      </div>

      <div className="flex justify-between items-start w-full h-full z-10">
        <div className="flex flex-col justify-between h-full">
          <span className="text-white/85 font-semibold text-xs uppercase tracking-wider">{title}</span>
          <p className="font-black text-3xl tracking-tight leading-none mb-1">{value}</p>
        </div>
        <div className="p-3 bg-white/15 rounded-xl backdrop-blur-sm shrink-0">
          {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement, { size: 24 }) : icon}
        </div>
      </div>
    </li>
  );
}
