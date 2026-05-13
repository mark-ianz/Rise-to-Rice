import HeaderText from "@/components/general/HeaderText";
import InputText from "@/components/general/InputText";
import SelectSuffix from "@/components/general/SelectSuffix";
import ZodErrorDisplay from "@/components/general/ZodErrorDisplay";
import useCreateAccountContext from "@/hooks/useCreateAccountContext";
import { Gender } from "@/types/createAccount.type";
import { useTranslation } from "react-i18next";
import SelectGender from "../SelectGender";
import LoginLink from "../LoginLink";
import { SectionAndSetSection } from "../credentials/CredentialsSubmitButton";
import PersonalInformationSubmitButton from "./PersonalInformationSubmitButton";

export default function Form_PersonalInformation({
  section,
  setSection,
}: SectionAndSetSection) {
  const { t: form } = useTranslation("form");
  const { t } = useTranslation("register");

  const { state, dispatch } = useCreateAccountContext();

  const authFieldClassName =
    "h-12 border-b border-gray-300 bg-transparent px-2 shadow-none rounded-none transition-colors focus-visible:ring-0 focus-visible:border-black focus-visible:border-b-2 focus-visible:bg-gray-50 focus-visible:outline-none";
  const authLabelClassName = "text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1";

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
    <div className="space-y-10">
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gray-500">
          {t("steps.personal_information.eyebrow")}
        </p>
        <HeaderText className="text-gray-900 text-2xl font-bold">
          {t("steps.personal_information.title")}
        </HeaderText>
        <p className="max-w-2xl text-sm leading-6 text-gray-500 font-medium">
          {t("steps.personal_information.description")}
        </p>
      </div>

      <div className="grid gap-8">
        <div className="grid gap-6 md:grid-cols-3">
          <InputText
            name="first_name"
            value={state.first_name}
            onChange={handleFirstNameChange}
            type="text"
            label={form("first_name")}
            autoComplete="given-name"
            labelClassname={authLabelClassName}
            inputClassName={authFieldClassName}
            wrapperClassName="w-full"
          />
          <InputText
            name="middle_name"
            value={state.middle_name}
            onChange={handleMiddleNameChange}
            type="text"
            label={form("middle_name")}
            autoComplete="additional-name"
            labelClassname={authLabelClassName}
            inputClassName={authFieldClassName}
            wrapperClassName="w-full"
            placeholder={`(${form("optional")})`}
          />
          <InputText
            name="last_name"
            value={state.last_name}
            onChange={handleLastNameChange}
            type="text"
            label={form("last_name")}
            autoComplete="family-name"
            labelClassname={authLabelClassName}
            inputClassName={authFieldClassName}
            wrapperClassName="w-full"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <SelectSuffix
            className="w-full"
            value={state.suffix || "None"}
            onChange={handleSuffixChange}
            labelClassName={authLabelClassName}
            triggerClassName={authFieldClassName}
          />
          <SelectGender
            className="w-full"
            value={state.gender}
            onChange={handleGenderChange}
            labelClassName={authLabelClassName}
            triggerClassName={authFieldClassName}
          />
          <InputText
            name="birthdate"
            onChange={handleBirthDateChange}
            label={form("birthdate")}
            type="date"
            labelClassname={authLabelClassName}
            inputClassName={authFieldClassName}
            wrapperClassName="w-full"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-[1.3fr_0.7fr]">
          <InputText
            name="address"
            onChange={handleAddressChange}
            value={state.address}
            type="text"
            label={form("address")}
            autoComplete="street-address"
            labelClassname={authLabelClassName}
            inputClassName={authFieldClassName}
            wrapperClassName="w-full"
            placeholder="Blk, Street, Barangay, City"
          />
          <InputText
            name="contact_number"
            value={state.contact_number}
            onChange={handleContactNumberChange}
            type="text"
            autoComplete="tel"
            label={form("contact_number")}
            labelClassname={authLabelClassName}
            inputClassName={authFieldClassName}
            wrapperClassName="w-full"
          />
        </div>
      </div>

      <ZodErrorDisplay
        error={state.error}
        className="rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-100"
      />

      <div className="pt-4 flex flex-col gap-4">
        <PersonalInformationSubmitButton
          section={section}
          setSection={setSection}
        />
        <LoginLink className="text-gray-500">{t("already_have_account")}</LoginLink>
      </div>
    </div>
  );
}
