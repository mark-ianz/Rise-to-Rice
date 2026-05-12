import { FormEvent, useRef, useState } from "react";
import { toast } from "sonner";
import { AddMaterialSchema } from "@/schema/Material";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import InputText from "@/components/general/InputText";
import ZodErrorDisplay from "@/components/general/ZodErrorDisplay";
import { ZodError } from "zod";
import { useAddMaterial } from "@/hooks/query/useMaterial";
import { Category } from "@/types/materials";

export default function AddMaterial({ category }: { category: Category }) {
  const [open, setOpen] = useState(false);
  const materialNameRef = useRef<HTMLInputElement>(null);
  const pointsExchangeRateRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string[] | null>(null);

  const { mutate, isPending } = useAddMaterial();

  const handleCreateMaterial = (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!materialNameRef.current || !pointsExchangeRateRef.current) return;
    const materialName = materialNameRef.current.value.trim();
    const points_per_kg = pointsExchangeRateRef.current.value.trim();

    try {
      const parsedData = AddMaterialSchema.parse({
        material: materialName,
        points_per_kg: Number(points_per_kg),
        category_id: category.category_id,
      });

      mutate(parsedData, {
        onSuccess: () => {
          setOpen(false);
          toast.success("Material created successfully.");
        },
        onError: () => {
          setError(["Failed to create material. Please try again."]);
        },
      });
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map((err) => err.message);
        setError(errors);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">Add Material</Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleCreateMaterial} className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>Add New Material</DialogTitle>
            <DialogDescription>
              Please enter the details of the new material you want to add under
              the {category.category} category
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <InputText
              label="Material Name"
              name="material-name"
              type="text"
              labelClassname="text-sm"
              ref={materialNameRef}
            />
            <InputText
              step={0.01}
              label="Points Exchange Rate"
              name="points-exchange-rate"
              type="number"
              labelClassname="text-sm"
              ref={pointsExchangeRateRef}
            />
            <p className="text-sm text-muted-foreground -mt-2">
              The points per KG is the amount of points the user will get
              <strong> per KG</strong> for exchanging this material type.
            </p>
            <ZodErrorDisplay error={error} />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              Create Material
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setOpen(false);
              }}
              disabled={isPending}
            >
              Cancel
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
