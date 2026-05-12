import ActionButton from "./ActionButton";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { UserProfile } from "@/types/user.type";
import LogExchangeButton from "./LogExchangeButton";
import DeleteData from "../DeleteData";
import { useDeleteUser } from "@/hooks/query/useUser";
import ChangeRoleButton from "./ChangeRoleButton";
import useUserContext from "@/hooks/useUserContext";

type Props = {
  user: UserProfile;
};

export default function UserActionButton({ user }: Props) {
  const navigate = useNavigate();
  const { state } = useUserContext();

  return (
    <ActionButton>
      <Button
        variant={"secondary"}
        onClick={() => navigate("/dashboard/users/" + user.user_id)}
      >
        View
      </Button>
      <LogExchangeButton user={user} />
      {state.role === "super_admin" && (
        <>
          <ChangeRoleButton user={user} />
          <DeleteData
            description={
              <>
                <span className="flex flex-col">
                  <span>
                    This will permanently delete the user and all of their data.
                  </span>
                  <span>
                    This action <strong>CANNOT</strong> be undone.
                  </span>
                </span>
              </>
            }
            id={user.user_id}
            useMutation_hook={useDeleteUser}
            resource_name="user"
          />
        </>
      )}
    </ActionButton>
  );
}
