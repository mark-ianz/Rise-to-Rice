import InputText from "@/components/general/InputText";
import SelectSuffix from "@/components/general/SelectSuffix";
import useCreateAccountContext from "@/hooks/useCreateAccountContext";
import SelectGender from "../SelectGender";
import { Gender } from "@/types/createAccount.type";
import ZodErrorDisplay from "@/components/general/ZodErrorDisplay";
import { SectionAndSetSection } from "../credentials/CredentialsSubmitButton";
import PersonalInformationSubmitButton from "./PersonalInformationSubmitButton";
import HeaderText from "@/components/general/HeaderText";
import LoginLink from "../LoginLink";
import { useTranslation } from "react-i18next";

export default function Form_PersonalInformation({
  section,
  setSection,
}: SectionAndSetSection) {
  const { t: form } = useTranslation("form");
  const { t } = useTranslation("register");

  const { state, dispatch } = useCreateAccountContext();

  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: "SET_FIRST_NAME", payload: e.target.value });
  };

  const handleMiddleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: "SET_MIDDLE_NAME", payload: e.target.value });
  };

  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: "SET_LAST_NAME", payload: e.target.value });
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: "SET_ADDRESS", payload: e.target.value });
  };

  const handleContactNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch({ type: "SET_CONTACT_NUMBER", payload: e.target.value });
  };

  const handleBirthDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: "SET_DATE_OF_BIRTH",
      payload: e.target.value,
    });
  };

  const handleGenderChange = (value: Gender) => {
    dispatch({ type: "SET_GENDER", payload: value });
  };

  const handleSuffixChange = (suffix: string) => {
    dispatch({ type: "SET_SUFFIX", payload: suffix });
  };

  return (
    <>
      <HeaderText>{t("register")}</HeaderText>
      <div className="flex flex-col gap-4">
        <div className="flex flex-row gap-4 max-sm:flex-wrap">
          <InputText
            name="first_name"
            value={state.first_name}
            onChange={handleFirstNameChange}
            type="text"
            label={form("first_name")}
            wrapperClassName="max-md:grow w-full"
          />
          <InputText
            name="middle_name"
            value={state.middle_name}
            onChange={handleMiddleNameChange}
            type="text"
            label={form("middle_name")}
            wrapperClassName="max-md:grow w-full"
            placeholder="(Optional)"
          />
          <InputText
            name="last_name"
            value={state.last_name}
            onChange={handleLastNameChange}
            wrapperClassName="max-md:grow w-full"
            type="text"
            label={form("last_name")}
          />
        </div>
        <div className="flex flex-row gap-4 max-sm:flex-wrap">
          <SelectSuffix className="max-lg:w-full" value={state.suffix || "None"} onChange={handleSuffixChange} />
          <SelectGender className="max-lg:w-full" value={state.gender} onChange={handleGenderChange} />
          <InputText
            name="birthdate"
            onChange={handleBirthDateChange}
            label={form("birthdate")}
            type="date"
            wrapperClassName="max-lg:w-full grow"
          />
        </div>
        <div className="flex gap-4 max-sm:flex-wrap">
          <InputText
            name="address"
            onChange={handleAddressChange}
            value={state.address}
            type="text"
            label={form("address")}
            wrapperClassName="flex-1 max-sm:w-full grow"
            placeholder="Blk, Street, Barangay, City"
          />
          <InputText
            name="contact_number"
            value={state.contact_number}
            onChange={handleContactNumberChange}
            type="text"
            wrapperClassName="max-sm:w-full"
            label={form("contact_number")}
          />
        </div>
      </div>
      <ZodErrorDisplay error={state.error} />
      <PersonalInformationSubmitButton
        section={section}
        setSection={setSection}
      />
      <LoginLink>{t("already_have_account")}</LoginLink>
    </>
  );
}
