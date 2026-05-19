import InputText from "@/components/general/InputText";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { displayFullName } from "@/lib/format";
import { UserProfile } from "@/types/user.type";
import { useEffect } from "react";

import CategorySelect from "./CategorySelect";
import WeightInput from "./WeightInput";
import SubmitLogExchangeButton from "./SubmitLogExchangeButton";
import useLogExchangeContext from "@/hooks/useLogExchangeContext";
import { calculatePoints } from "@/lib/utils";
import ZodErrorDisplay from "@/components/general/ZodErrorDisplay";
import MaterialSelect from "./MaterialSelect";
import { useGetCategories } from "@/hooks/query/useMaterial";

type Props = {
  user: UserProfile;
};

export default function LogExchangeButton({ user }: Props) {
  const { state, dispatch } = useLogExchangeContext();
  const { data: categories } = useGetCategories();

  useEffect(() => {
    if (categories && categories.length > 0) {
      dispatch({
        type: "SET_SELECTED_CATEGORY",
        payload: categories[0],
      });
    }
  }, [dispatch, categories]);

  if (!categories) return <p>loading</p>;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"secondary"}>Log Exchange</Button>
      </DialogTrigger>
      <DialogContent>
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Log Exchange</DialogTitle>
            <DialogDescription>
              You are about to log an exchange for{" "}
              <span className="text-tertiary font-semibold">
                {displayFullName(user)}
              </span>
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <CategorySelect />
            <MaterialSelect />
            <WeightInput />
            <InputText
              labelClassname="text-sm"
              label="Points"
              type="number"
              name="points"
              disabled
              value={
                state.weight
                  ? calculatePoints(
                      state.weight,
                      state.unit,
                      state.selectedMaterial
                    )
                  : ""
              }
            />
            <div className="flex flex-col gap-1.5">
              <label htmlFor="image" className="text-sm font-medium">
                Proof Image (Optional)
              </label>
              <input
                type="file"
                id="image"
                accept="image/*"
                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  dispatch({ type: "SET_IMAGE", payload: file });
                }}
              />
            </div>
          </div>
          <ZodErrorDisplay error={state.error} />
          <SubmitLogExchangeButton
            points_added={calculatePoints(
              state.weight,
              state.unit,
              state.selectedMaterial
            )}
            user={user}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}
