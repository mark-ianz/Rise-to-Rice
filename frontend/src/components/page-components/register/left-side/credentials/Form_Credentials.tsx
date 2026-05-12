import InputText from "@/components/general/InputText";
import useCreateAccountContext from "@/hooks/useCreateAccountContext";
import SubmitButton, { SectionAndSetSection } from "./CredentialsSubmitButton";
import ZodErrorDisplay from "@/components/general/ZodErrorDisplay";
import LoginLink from "../LoginLink";
import HeaderText from "@/components/general/HeaderText";
import { useTranslation } from "react-i18next";
import PasswordInput from "@/components/general/PasswordInput";

export default function Form_Credentials({
  section,
  setSection,
}: SectionAndSetSection) {
  const { t: form } = useTranslation("form");
  const { t } = useTranslation("register");

  const { state, dispatch } = useCreateAccountContext();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: "SET_EMAIL", payload: e.target.value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: "SET_PASSWORD", payload: e.target.value });
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch({ type: "SET_CONFIRM_PASSWORD", payload: e.target.value });
  };

  return (
    <>
      <HeaderText>{t("register")}</HeaderText>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4">
          <InputText
            name="email"
            value={state.email}
            onChange={handleEmailChange}
            type="email"
            label="Email"
          />
          <PasswordInput
            onChange={handlePasswordChange}
            label="Password"
            name="password"
            value={state.password}
          />
          <PasswordInput
            onChange={handleConfirmPasswordChange}
            label={form("confirm_password")}
            name="confirm_password"
            value={state.confirm_password}
          />
        </div>
      </div>
      <ZodErrorDisplay error={state.error} />
      <SubmitButton section={section} setSection={setSection} />
      <LoginLink>{t("already_have_account")}</LoginLink>
    </>
  );
}
