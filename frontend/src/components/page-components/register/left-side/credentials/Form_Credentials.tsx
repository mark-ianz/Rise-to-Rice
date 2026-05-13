import HeaderText from "@/components/general/HeaderText";
import InputText from "@/components/general/InputText";
import PasswordInput from "@/components/general/PasswordInput";
import ZodErrorDisplay from "@/components/general/ZodErrorDisplay";
import useCreateAccountContext from "@/hooks/useCreateAccountContext";
import { useTranslation } from "react-i18next";
import LoginLink from "../LoginLink";
import SubmitButton, { SectionAndSetSection } from "./CredentialsSubmitButton";

export default function Form_Credentials({
  section,
  setSection,
}: SectionAndSetSection) {
  const { t: form } = useTranslation("form");
  const { t } = useTranslation("register");

  const { state, dispatch } = useCreateAccountContext();

  const authFieldClassName =
    "h-12 border-b border-gray-300 bg-transparent px-2 shadow-none rounded-none transition-colors focus-visible:ring-0 focus-visible:border-black focus-visible:border-b-2 focus-visible:bg-gray-50 focus-visible:outline-none";
  const authLabelClassName = "sr-only";

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
    <div className="space-y-10">
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gray-500">
          {t("steps.credentials.eyebrow")}
        </p>
        <HeaderText className="text-gray-900 text-2xl font-bold">
          {t("steps.credentials.title")}
        </HeaderText>
        <p className="max-w-2xl text-sm leading-6 text-gray-500 font-medium">
          {t("steps.credentials.description")}
        </p>
      </div>

      <div className="grid gap-6">
        <InputText
          name="email"
          value={state.email}
          onChange={handleEmailChange}
          type="email"
          label={form("email")}
          autoComplete="email"
          labelClassname={authLabelClassName}
          inputClassName={authFieldClassName}
          placeholder="Email address"
        />
        <PasswordInput
          onChange={handlePasswordChange}
          label={form("password")}
          name="password"
          value={state.password}
          autoComplete="new-password"
          labelClassName={authLabelClassName}
          inputClassName={authFieldClassName}
          toggleButtonClassName="right-2 h-9 w-9 text-gray-400 hover:text-gray-600 transition-colors"
          placeholder="Password"
        />
        <PasswordInput
          onChange={handleConfirmPasswordChange}
          label={form("confirm_password")}
          name="confirm_password"
          value={state.confirm_password}
          autoComplete="new-password"
          labelClassName={authLabelClassName}
          inputClassName={authFieldClassName}
          toggleButtonClassName="right-2 h-9 w-9 text-gray-400 hover:text-gray-600 transition-colors"
          placeholder="Confirm password"
        />
      </div>

      <ZodErrorDisplay
        error={state.error}
        className="rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-100"
      />

      <div className="pt-4 flex flex-col gap-4">
        <SubmitButton section={section} setSection={setSection} />
        <LoginLink className="text-gray-500">{t("already_have_account")}</LoginLink>
      </div>
    </div>
  );
}
