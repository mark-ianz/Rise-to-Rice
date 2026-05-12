import InputText from "@/components/general/InputText";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ZodErrorDisplay from "@/components/general/ZodErrorDisplay";
import { useEditMaterial } from "@/hooks/query/useMaterial";
import { formatZodErrors } from "@/lib/format";
import { EditMaterialSchema } from "@/schema/Material";
import { Material } from "@/types/materials";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { ZodError } from "zod";
import { DialogClose } from "@radix-ui/react-dialog";
import { Edit } from "lucide-react";

type Props = { material: Material };

export default function EditButton({ material }: Props) {
  const [materialName, setMaterialName] = useState<string>(material.material);
  const [pointsExchangeRate, setPointsExchangeRate] = useState<number>(
    material.points_per_kg
  );
  const [error, setError] = useState<string[] | null>(null);
  const [open, setOpen] = useState(false);

  const { mutate, isPending } = useEditMaterial();

  const handlePointsExchangeRateChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    const parsedValue = parseFloat(value);
    if (!isNaN(parsedValue)) {
      setPointsExchangeRate(parsedValue);
    } else {
      setPointsExchangeRate(0);
    }
  };

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const parsedData = EditMaterialSchema.parse({
        material_id: material.material_id,
        material: materialName,
        points_per_kg: Number(pointsExchangeRate),
      });

      mutate(parsedData, {
        onSuccess: () => {
          setOpen(false);
          toast.success("Material updated successfully");
        },
        onError: () => {
          toast.error("Failed to update material");
        },
      });
    } catch (error) {
      if (error instanceof ZodError) {
        setError(formatZodErrors(error));
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"secondary"} className="w-10">
          <Edit />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>Edit {material.material}</DialogTitle>
            <DialogDescription>
              You can change the name and points exchange rate of the{" "}
              {material.material} here.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <InputText
              label="Material Name"
              name="material-name"
              type="text"
              labelClassname="text-sm"
              value={materialName}
              onChange={(e) => setMaterialName(e.target.value)}
            />
            <InputText
              step={0.01}
              label="Points Exchange Rate"
              name="points-exchange-rate"
              type="number"
              labelClassname="text-sm"
              value={pointsExchangeRate}
              onChange={handlePointsExchangeRateChange}
            />
            <ZodErrorDisplay error={error} />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              Save
            </Button>
            <DialogClose disabled={isPending} asChild>
              <Button variant={"outline"}>Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
