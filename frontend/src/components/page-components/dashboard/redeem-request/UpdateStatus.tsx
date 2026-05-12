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
import { capitalizeWordStart } from "@/lib/format";
import SelectDropDown from "../../view_profile/SelectDropDown";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { ConfirmationInput } from "@/components/general/ConfirmationInput";
import { toast } from "sonner";
import LoadingComponent from "@/components/general/LoadingComponent";

type MutationValue = {
  id: number;
  email?: string;
  points_cost?: number;
  user_id?: number;
  current_status?: string;
  new_status: string;
};

type Props = {
  status: string;
  id: number;
  useMutation_hook: () => {
    mutate: (
      data: MutationValue,
      options?: {
        onSuccess?: () => void;
        onError?: (error: Error) => void;
      }
    ) => void;
    isPending: boolean;
  };
  mutation_value: MutationValue;
  dropdown_items: {
    label: string;
    value: string;
  }[];
  resource_name: string;
};

export default function UpdateStatus({
  status,
  id,
  useMutation_hook,
  mutation_value,
  dropdown_items,
  resource_name,
}: Props) {
  const [open, setOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<{
    label: string;
    value: string;
  }>();
  const [error, setError] = useState<string[] | null>(null);
  const [confirmationInput, setConfirmationInput] = useState<string>("");

  const neededInput = `update ${resource_name} id #${id}`;

  const isInputValid = confirmationInput === neededInput;

  const { mutate, isPending } = useMutation_hook();

  const findAndSetStatus = useCallback(
    (value: string) => {
      const selectedStatus = dropdown_items.find(
        (item) => item.value === value
      );
      setSelectedStatus(selectedStatus);
    },
    [dropdown_items]
  );

  useEffect(() => {
    findAndSetStatus(status);
  }, [status, findAndSetStatus]);

  const handleUpdate = (e: FormEvent) => {
    e.preventDefault();
    if (!selectedStatus) return;
    if (selectedStatus.value === status) {
      setError(["Please select a different status."]);
      return;
    }

    mutate(
      { ...mutation_value, new_status: selectedStatus.value },
      {
        onSuccess: () => {
          setOpen(false);
          setError(null);
          toast.success("Status updated successfully!");
        },
        onError: (error: Error) => {
          console.error("Error updating status:", error);
          setError([
            "There was an error updating the status. Please try again later.",
          ]);
        },
      }
    );
  };

  if (!selectedStatus) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"secondary"}>Update Status</Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleUpdate} className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>Update Status</DialogTitle>
            <DialogDescription>
              Update the status of this {resource_name} to the selected status.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-4 flex-col">
            <div className="flex gap-2">
              <InputText
                label="From"
                name="current_status"
                type="text"
                labelClassname="text-sm"
                wrapperClassName="w-1/2"
                disabled
                value={capitalizeWordStart(status)}
              />
              <span className="w-1/2">
                <label htmlFor="select_status" className="text-sm">
                  To
                </label>
                <SelectDropDown
                  className="w-full"
                  name="select_status"
                  items={dropdown_items}
                  value={selectedStatus?.value}
                  onValueChange={findAndSetStatus}
                >
                  {selectedStatus.label}
                </SelectDropDown>
              </span>
            </div>
            <ConfirmationInput
              onValueChange={(e) => setConfirmationInput(e.target.value)}
              value={confirmationInput}
              error={error}
              input={neededInput}
              actionText="to confirm the update of this status"
            />
          </div>
          <DialogFooter>
            <Button
              className="min-w-20"
              type="submit"
              disabled={!isInputValid || isPending}
            >
              {isPending ? <LoadingComponent /> : "Update"}
            </Button>
            <Button
              variant="outline"
              disabled={isPending}
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
