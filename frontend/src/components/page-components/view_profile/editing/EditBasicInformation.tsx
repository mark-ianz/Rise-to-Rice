import InputText from "@/components/general/InputText";
import SelectGender from "@/components/page-components/register/left-side/SelectGender";
import SelectSuffix from "@/components/general/SelectSuffix";
import useEditProfileContext from "@/hooks/useEditProfileContext";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";

export default function EditBasicInformation() {
  const { t } = useTranslation("form");
  const { state: editingProfile, dispatch } = useEditProfileContext();

  return (
    <div className="flex gap-4 text-tertiary flex-wrap max-lg:text-sm">
      <div className="flex gap-4">
        <InputText
          name="first_name"
          type="text"
          label={t("first_name")}
          value={editingProfile?.first_name}
          wrapperClassName="flex-1"
          onChange={(e) =>
            dispatch({
              type: "SET_FIRST_NAME",
              payload: e.target.value,
            })
          }
        />
        <InputText
          name="middle_name"
          type="text"
          label={t("middle_name")}
          value={editingProfile?.middle_name || ""}
          wrapperClassName="flex-1"
          onChange={(e) =>
            dispatch({
              type: "SET_MIDDLE_NAME",
              payload: e.target.value,
            })
          }
        />
        <InputText
          name="last_name"
          type="text"
          label={t("last_name")}
          value={editingProfile?.last_name}
          wrapperClassName="flex-1"
          onChange={(e) =>
            dispatch({
              type: "SET_LAST_NAME",
              payload: e.target.value,
            })
          }
        />
      </div>
      <SelectSuffix
        value={editingProfile.suffix || "None"}
        onChange={(suffix) => dispatch({ type: "SET_SUFFIX", payload: suffix })}
      />
      <SelectGender
        value={editingProfile.gender}
        onChange={(gender) => dispatch({ type: "SET_GENDER", payload: gender })}
      />
      <InputText
        name="birthdate"
        value={format(new Date(editingProfile.birthdate), "yyyy-MM-dd")}
        onChange={(e) =>
          dispatch({ type: "SET_BIRTHDATE", payload: e.target.value })
        }
        label={t("birthdate")}
        type="date"
      />
    </div>
  );
}
