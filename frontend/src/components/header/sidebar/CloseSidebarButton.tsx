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
      className="rounded-full absolute top-4 right-4"
      onClick={() => setIsSidebarOpen(false)}
    >
      <X />
    </Button>
  );
}
