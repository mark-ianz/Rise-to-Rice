import { Role } from "@/types/user.type";
import AdminIcon from "../icons/AdminIcon";
import { UserRound } from "lucide-react";
import TooltipComponent from "./TooltipComponent";

type Props = {
  role: Role;
};

export default function GetRoleIcon({ role }: Props) {
  if (role === "user") {
    return (
      <TooltipComponent content="User">
        <UserRound className={"w-6 text-primary-main"} />
      </TooltipComponent>
    );
  }

  if (role === "admin") {
    return (
      <TooltipComponent content="Admin">
        <div>
          <AdminIcon className={"w-6"} />
        </div>
      </TooltipComponent>
    );
  }

  if (role === "super_admin") {
    return (
      <TooltipComponent content="Super Admin">
        <div>
          <AdminIcon className={"w-6 text-destructive"} fill="#ff0505" />
        </div>
      </TooltipComponent>
    );
  }
}
