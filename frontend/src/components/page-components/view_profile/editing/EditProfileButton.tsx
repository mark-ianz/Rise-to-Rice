import useEditProfileContext from "@/hooks/useEditProfileContext";
import { cn } from "@/lib/utils";
import { Button } from "../../../ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../../ui/alert-dialog";
import { handleError } from "@/helper/errorHandler";
import ZodErrorDisplay from "../../../general/ZodErrorDisplay";
import { UpdatePersonalInfoSchema } from "@/schema/UpdatePersonalInfoSchema";
import { UpdatePersonalInfoSchema as UpdatePersonalInfoSchemaTL } from "@/schema/tl/UpdatePersonalInfoSchema";
import useFullUserContext from "@/hooks/useFullUserContext";
import { useTranslation } from "react-i18next";
import { useGetUser, useUpdateUser } from "@/hooks/query/useUser";
import { toast } from "sonner";
import { PenSquare } from "lucide-react";

export default function EditProfileButton({ user_id }: { user_id: number }) {
  const { t, i18n } = useTranslation("profile");

  const parser =
    i18n.language === "en"
      ? UpdatePersonalInfoSchema
      : UpdatePersonalInfoSchemaTL;

  // initiate the queryClient
  const { state: editProfile, dispatch } = useEditProfileContext();
  const { dispatch: fullUserDispatch } = useFullUserContext();

  // this will query the user data that will be used as the initial value of the editProfile
  const { data: user } = useGetUser(user_id);

  // this will mutate the user data and will handle the submit edit
  const { mutate } = useUpdateUser();

  if (!user) return null;

  // this will initialize the current profile data
  // and the data was from the user data fetched
  const currentProfile = {
    first_name: user?.first_name,
    middle_name: user?.middle_name,
    last_name: user?.last_name,
    suffix: user?.suffix || null,
    gender: user?.gender,
    address: user?.address,
    contact_number: user?.contact_number,
    birthdate: user?.birthdate,
    createdAt: user?.createdAt,
  };

  // this will handle the edit button click
  const handleEditClick = () => {
    // if the user is currently editing, it will set the isEditing to false
    if (editProfile.isEditing) {
      dispatch({ type: "SET_IS_EDITING", payload: false });
      return;
    }

    // else, it will set the current profile data to the editProfile state and set the isEditing to true
    dispatch({
      type: "SET_ALL",
      payload: { ...currentProfile, isEditing: true, error: [] },
    });
  };

  // this will trigger when the user click the save button
  const handleSaveChanges = () => {
    // the function will simply call the mutate function
    try {
      const {
        first_name,
        middle_name,
        last_name,
        address,
        gender,
        birthdate,
        contact_number,
        suffix,
      } = editProfile;

      const parsedInfo = parser.parse({
        first_name,
        middle_name,
        last_name,
        address,
        gender,
        birthdate,
        contact_number,
        suffix,
      });

      mutate(
        {
          updatedUser: parsedInfo,
          user_id: user_id,
        },
        {
          onSuccess: (updatedUser) => {
            fullUserDispatch({
              type: "SET_FULL_USER_PROFILE",
              payload: updatedUser,
            });

            dispatch({ type: "SET_IS_EDITING", payload: false });

            toast.success(t("profile.edit_profile.toast.success"));
          },
          onError: (error) => {
            console.log(error)
            handleError(error, dispatch);
            toast.error(t("profile.edit_profile.toast.error"));
          },
        }
      );
    } catch (error) {
      console.log(error)
      handleError(error, dispatch);
    }
  };

  // if the user is not editing, it will show the edit button
  if (!editProfile.isEditing) {
    return (
      <Button
        variant="default"
        onClick={handleEditClick}
        className={cn(
          "w-fit flex gap-2 cursor-pointer items-center bg-primary-main text-white hover:bg-primary-dark hover:shadow-md rounded-lg px-4 h-10 shadow-sm transition-all duration-200"
        )}
      >
        <PenSquare size={15} />
        <span className="max-lg:text-xs font-medium">
          {t("profile.edit_profile.button")}
        </span>
      </Button>
    );
  }

  // if the user is editing, it will show the save and cancel button
  if (editProfile.isEditing && user) {
    return (
      <div className="flex flex-col gap-2">
        <ZodErrorDisplay error={editProfile.error} />
        <div className="flex gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                className={cn(
                  "w-fit flex gap-1.5 cursor-pointer items-center bg-primary-main hover:bg-primary-dark rounded-lg px-4 h-10 shadow-sm transition-all duration-200"
                )}
              >
                {t("profile.edit_profile.save")}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogTitle>
                {t("profile.edit_profile.dialog.title")}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {t("profile.edit_profile.dialog.description")}
              </AlertDialogDescription>
              <AlertDialogFooter>
                <AlertDialogAction onClick={handleSaveChanges} className="bg-primary-main text-white hover:bg-primary-dark rounded-lg">
                  {t("profile.edit_profile.dialog.confirm")}
                </AlertDialogAction>
                <AlertDialogCancel className="bg-destructive text-destructive-foreground border-destructive hover:bg-destructive/90 rounded-lg">
                  {t("profile.edit_profile.dialog.cancel")}
                </AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button
            variant="destructive"
            onClick={handleEditClick}
            className={cn(
              "w-fit flex gap-1.5 cursor-pointer items-center bg-destructive text-white hover:bg-destructive/90 rounded-lg px-4 h-10 shadow-sm transition-all duration-200"
            )}
          >
            {t("profile.edit_profile.cancel")}
          </Button>
        </div>
      </div>
    );
  }
}
