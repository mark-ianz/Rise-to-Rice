import { cn } from "@/lib/utils";
import { Loader2Icon } from "lucide-react";

export default function LoadingComponent({
  className,
}: {
  className?: string;
}) {
  return <Loader2Icon className={cn("animate-spin text-tertiary", className)} />;
}
