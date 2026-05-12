import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

type Props = {
  className?: string;
  variant?: "default" | "outline" | "ghost" | "link" | "destructive" | "secondary";
};

export default function GoBackButton({ className, variant }: Props) {
  const navigate = useNavigate();

  return (
    <Button
      asChild
      className={cn(
        "absolute text-gray-500 top-4 left-4 rounded-full",
        className
      )}
      onClick={() => navigate(-1)}
      variant={variant || "ghost"}
      size={"icon"}
    >
      <span className="cursor-pointer">
        <ArrowLeft />
      </span>
    </Button>
  );
}
