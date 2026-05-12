import { ReactNode } from "react";

export default function ValueWrapper({
  label,
  value,
}: {
  label: string;
  value: string | ReactNode;
}) {
  return (
    <span className="flex justify-between gap-4 border-b p-2 max-md:text-sm">
      <span className="text-muted-foreground font-semibold">{label}</span>
      <span className="line-clamp-2">{value}</span>
    </span>
  );
}
