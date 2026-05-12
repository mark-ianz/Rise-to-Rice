import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useLogExchange } from "@/hooks/query/useExchange";
import useLogExchangeContext from "@/hooks/useLogExchangeContext";
import { displayFullName } from "@/lib/format";
import { LogExchangeSchema } from "@/schema/LogExchange";
import { UserProfile } from "@/types/user.type";
import { toast } from "sonner";
import { ZodError } from "zod";

type Props = {
  user: UserProfile;
  points_added: number | string;
};

export default function SubmitLogExchangeButton({ user, points_added }: Props) {
  const { state, dispatch } = useLogExchangeContext();

  const { mutate, isPending } = useLogExchange();

  const handleExchangeSubmit = () => {
    try {
      const parsed = LogExchangeSchema.parse(state);

      mutate(
        { data: parsed, user_id: user.user_id },
        {
          onSuccess: () => [toast.success("Exchange logged successfully!")],
          onError: () => {
            toast.error("An error occurred. Please try again.");
          },
        }
      );

      dispatch({ type: "RESET" });
    } catch (error) {
      if (error instanceof ZodError) {
        dispatch({
          type: "SET_ERROR",
          payload: error.errors.map((err) => err.message),
        });
      }
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          disabled={!state.selectedMaterial.material || !state.weight}
          type="button"
        >
          Submit
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Log Exchange</AlertDialogTitle>
          <AlertDialogDescription>
            {`${displayFullName(
              user
            )} will get ${points_added} points for exchanging ${state.weight} ${
              state.unit.unit
            } of ${state.selectedMaterial.material}.`}{" "}
            Are you sure you want to submit this exchange log?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction
            asChild
            onClick={handleExchangeSubmit}
            disabled={isPending}
          >
            <Button>Submit</Button>
          </AlertDialogAction>
          <AlertDialogCancel asChild>
            <Button variant="secondary">Cancel</Button>
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
