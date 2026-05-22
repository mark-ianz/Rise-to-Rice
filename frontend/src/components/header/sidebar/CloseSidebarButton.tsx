import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

type Props = {
  setIsSidebarOpen: (isOpen: boolean) => void;
};

export default function CloseSidebarButton({ setIsSidebarOpen }: Props) {
  return (
    <Button
      size={"icon"}
      variant={"ghost"}
      className="rounded-full absolute top-8 right-6 w-9 h-9 flex items-center justify-center bg-secondary-light-2/40 hover:bg-secondary-light-2 active:scale-95 transition-all text-secondary-dark/60 hover:text-secondary-dark border border-warm-tan/10"
      onClick={() => setIsSidebarOpen(false)}
    >
      <X size={18} />
    </Button>
  );
}
