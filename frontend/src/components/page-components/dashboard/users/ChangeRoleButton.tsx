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
import { getFormattedRole } from "@/lib/format";
import { UserProfile } from "@/types/user.type";
import SelectDropDown from "../../view_profile/SelectDropDown";
import { useState } from "react";
import { roles } from "@/lib/const";
import { Label } from "@/components/ui/label";
import { ConfirmationInput } from "@/components/general/ConfirmationInput";
import { useUpdateUserRole } from "@/hooks/query/useUser";
import { toast } from "sonner";

type Props = {
  user: UserProfile;
};

export default function ChangeRoleButton({ user }: Props) {
  const [role, setRole] = useState<{ value: string; label: string }>(() => {
    const roleObj = roles.find((role) => role.value === user.role);
    return roleObj ? roleObj : { value: "", label: "" };
  });
  const [open, setOpen] = useState(false);

  const [confirmationInput, setConfirmationInput] = useState<string>("");

  const neededInput = `set role to ${role.label.toLowerCase()}`;
  const isInputValid = confirmationInput === neededInput;

  const handleOnChange = (value: string) => {
    const newRole = roles.find((role) => role.value === value);
    if (!newRole) return;
    setRole(newRole);
  };

  const { mutate, isPending } = useUpdateUserRole();

  const handleOnChangeRole = () => {
    const role_id = roles.find((r) => r.value === role.value)?.id;

    if (!role_id) return;
    if (user.role === role.value) {
      return;
    }

    mutate(
      {
        role_id: role_id,
        user_id: user.user_id,
      },
      {
        onSuccess: () => {
          setConfirmationInput("");
          setOpen(false);
          toast.success("Role updated successfully!");
        },
        onError: () => {
          setConfirmationInput("");
          toast.error("Something went wrong, please try again later");
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"secondary"}>Change Role</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Role</DialogTitle>
          <DialogDescription>
            This will change the role of the user. Please select the new role.
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-4 flex-col">
          <div className="flex gap-4">
            <InputText
              disabled
              name="current-role"
              label="Current Role"
              type="text"
              wrapperClassName="w-1/2"
              value={getFormattedRole(user.role)}
            />
            <span className="w-1/2">
              <Label className="font-normal text-sm" htmlFor="new-role">
                New Role
              </Label>
              <SelectDropDown
                className="w-full"
                name="new-role"
                value={role?.value}
                onValueChange={handleOnChange}
                items={roles}
              >
                {role.label}
              </SelectDropDown>
            </span>
          </div>
          <ConfirmationInput
            actionText="to confirm the update of the role"
            input={neededInput}
            value={confirmationInput}
            onValueChange={(e) => setConfirmationInput(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button
            onClick={handleOnChangeRole}
            disabled={!isInputValid || isPending}
          >
            Confirm
          </Button>
          <DialogClose asChild>
            <Button variant="outline" disabled={isPending}>
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
