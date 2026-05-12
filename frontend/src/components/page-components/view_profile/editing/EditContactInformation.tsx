import InputText from "@/components/general/InputText";
import useEditProfileContext from "@/hooks/useEditProfileContext";
import { useTranslation } from "react-i18next";

export default function EditContactInformation({ email }: { email: string }) {
  const { t } = useTranslation("form");

  const { state: editingProfile, dispatch } = useEditProfileContext();

  const handleContactNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch({ type: "SET_CONTACT_NUMBER", payload: e.target.value });
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: "SET_ADDRESS", payload: e.target.value });
  };

  return (
    <div className="flex gap-4 text-tertiary flex-wrap">
      <InputText
        name="email"
        value={email}
        readOnly
        label={t("email")}
        type="email"
        wrapperClassName="max-xsm:w-full"
        disabled
      />
      <InputText
        name="contact_number"
        onChange={handleContactNumberChange}
        value={editingProfile.contact_number}
        type="string"
        wrapperClassName="max-xsm:w-full"
        label={t("contact_number")}
      />
      <InputText
        name="address"
        onChange={handleAddressChange}
        value={editingProfile.address}
        wrapperClassName="max-xsm:w-full"
        type="string"
        label={t("address")}
      />
    </div>
  );
}
