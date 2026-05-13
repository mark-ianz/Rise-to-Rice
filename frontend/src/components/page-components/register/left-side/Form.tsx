import LogoNav from "@/components/header/LogoNav";
import GoBackButton from "@/components/general/GoBackButton";
import LoadingComponent from "@/components/general/LoadingComponent";
import AuthStepIndicator from "@/components/page-components/auth/AuthStepIndicator";
import Form_PersonalInformation from "./personal-information/Form_PersonalInformation";
import useCreateAccountContext from "@/hooks/useCreateAccountContext";
import { FormEvent, useEffect, useState } from "react";
import Field_SecondSection from "./credentials/Form_Credentials";
import { Link, useNavigate } from "react-router-dom";
import { RegisterSections } from "@/types/register";
import EmailVerification from "./email-verification/EmailVerification";
import {
  UserCreate_First_Part,
  UserCreate_Second_Part,
} from "@/schema/CreateAccountSchema";
import { handleError } from "@/helper/errorHandler";
import useUserContext from "@/hooks/useUserContext";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useTranslation } from "react-i18next";

export default function LeftSide() {
  const { state, dispatch } = useCreateAccountContext();
  const { refetchAuth } = useUserContext();
  const [section, setSection] = useState<RegisterSections>(() => {
    const savedSection = localStorage.getItem("registerSection");
    return (savedSection as RegisterSections) || "personal-information";
  });
  const navigate = useNavigate();
  const { t } = useTranslation("register");

  const { mutate, isPending } = useMutation({
    mutationFn: async (
      parsedData: UserCreate_First_Part & UserCreate_Second_Part
    ) => {
      const response = await axios.post("/api/user/create", parsedData);

      return response.data;
    },
    onError: (error) => {
      handleError(error, dispatch);
    },
    onSuccess: (data) => {
      localStorage.removeItem("registerState");
      localStorage.removeItem("registerSection");
      dispatch({ type: "LOGIN", payload: data });
      refetchAuth();
      navigate("/");
    },
  });

  const steps = [
    {
      key: "personal-information",
      label: t("steps.personal_information.label"),
    },
    {
      key: "credentials",
      label: t("steps.credentials.label"),
    },
    {
      key: "email-verification",
      label: t("steps.email_verification.label"),
    },
  ];

  useEffect(() => {
    if (section === "success") {
      mutate(state as UserCreate_First_Part & UserCreate_Second_Part);
    }
    localStorage.setItem("registerSection", section);
  }, [section, mutate, state]);

  useEffect(() => {
    dispatch({ type: "SET_ERROR", payload: null });
  }, [section, dispatch]);

  return (
    <div className="relative flex flex-col h-full bg-[#fcfdfc] p-8 sm:p-12 lg:p-16">
      <div className="absolute top-12 right-12">
        <LogoNav />
      </div>

      <form
        autoComplete="off"
        onSubmit={(e: FormEvent<HTMLFormElement>) => e.preventDefault()}
        className="flex w-full max-w-xl flex-col gap-8 mx-auto justify-center flex-1 mt-12"
      >
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {t("form_description_title", "Create an account")}
          </h1>
          <p className="text-base text-gray-500 font-medium">
            {t("form_description")}
          </p>
        </div>

        <AuthStepIndicator
          currentStep={section === "success" ? "email-verification" : section}
          steps={steps}
        />

        <div className="relative mt-2 flex-1 flex flex-col">
          {isPending && (
            <div className="absolute inset-0 z-20 flex items-center justify-center rounded-xl bg-white/80 backdrop-blur-sm">
              <LoadingComponent className="h-10 w-10" />
            </div>
          )}

          <div className="min-h-[400px] flex-1 flex flex-col">
            <div className="flex-1">
              {section === "personal-information" && (
                <Form_PersonalInformation section={section} setSection={setSection} />
              )}
              {section === "credentials" && (
                <Field_SecondSection section={section} setSection={setSection} />
              )}
              {section === "email-verification" && (
                <EmailVerification section={section} setSection={setSection} />
              )}
            </div>

          </div>
        </div>
      </form>
    </div>
  );
}
