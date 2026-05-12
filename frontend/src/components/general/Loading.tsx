import { cn } from "@/lib/utils";
import { Loader2Icon } from "lucide-react";

export default function Loading({
  className,
  size,
}: {
  className?: string;
  size?: number;
}) {
  return <Loader2Icon className={cn("animate-spin" ,className)} size={size} />;
}
