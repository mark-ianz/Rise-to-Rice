import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Category } from "@/types/materials";
import MaterialItems from "./MaterialItems";
import AddMaterial from "./AddMaterial";

type Props = { category: Category };

export default function ViewMaterial({ category }: Props) {
  return (
    <Dialog>
      <DialogTrigger className="text-tertiary underline">View</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Types of {category.category}</DialogTitle>
          <DialogDescription>
            List of materials under{" "}
            <span className="font-semibold">{category.category}</span> category
          </DialogDescription>
        </DialogHeader>
        <ul className="flex flex-col gap-4">
          {category.types.length === 0 && (
            <p className="text-tertiary">No materials available</p>
          )}
          {category.types.map((material, index) => (
            <MaterialItems
              material={material}
              key={material.material_id + index}
            />
          ))}
        </ul>
        <DialogFooter>
          <AddMaterial category={category} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
