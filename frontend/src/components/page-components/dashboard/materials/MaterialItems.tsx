import InputText from "@/components/general/InputText";
import { Material } from "@/types/materials";
import EditButton from "./EditButton";
import DeleteData from "../DeleteData";
import { useDeleteMaterial } from "@/hooks/query/useMaterial";
import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  material: Material;
};

export default function MaterialItems({ material }: Props) {
  return (
    <li className="flex gap-2  items-end">
      <div className="flex gap-2 w-full">
        <InputText
          label="Material"
          name="material"
          type="text"
          disabled
          wrapperClassName="grow"
          value={material.material}
        />
        <InputText
          label="Points per KG"
          name="points-per-kg"
          type="number"
          disabled
          wrapperClassName="grow"
          value={material.points_per_kg.toFixed(2)}
        />
      </div>
      <EditButton material={material} />
      <DeleteData
        resource_name="material"
        description={"This action cannot be undone."}
        id={material.material_id}
        useMutation_hook={useDeleteMaterial}
      >
        <Button variant={"destructive"} className="w-10">
          <Trash />
        </Button>
      </DeleteData>
    </li>
  );
}
