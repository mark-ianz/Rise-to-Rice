import InputText from "@/components/general/InputText";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAddCategory } from "@/hooks/query/useMaterial";
import { Plus } from "lucide-react";
import { FormEvent, useRef, useState } from "react";
import { toast } from "sonner";

export default function AddCategory() {
  const { mutate, isPending } = useAddCategory();
  const categoryRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (categoryRef.current) {
      const category = categoryRef.current.value;
      if (category) {
        mutate(
          { category },
          {
            onSuccess: () => {
              toast.success("Category added successfully");
              categoryRef.current!.value = "";
              setOpen(false);
            },
          }
        );
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="rounded-full max-md:[&_svg]:size-3 max-lg:w-8 max-lg:h-8 max-md:w-7 max-md:h-7"
          size={"icon"}
          variant={"outline"}
        >
          <Plus />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>Add Category</DialogTitle>
            <DialogDescription>
              Fill in the form below to add a new category.
            </DialogDescription>
          </DialogHeader>
          <InputText
            ref={categoryRef}
            label="Category"
            name="category"
            type="text"
          />
          <DialogFooter>
            <Button disabled={isPending} type="submit">
              Submit
            </Button>
            <DialogClose asChild>
              <Button disabled={isPending} variant={"outline"}>
                Cancel
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
