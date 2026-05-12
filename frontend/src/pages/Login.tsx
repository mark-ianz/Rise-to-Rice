import GoBackButton from "@/components/general/GoBackButton";
import HeaderText from "@/components/general/HeaderText";
import InputText from "@/components/general/InputText";
import LoadingComponent from "@/components/general/LoadingComponent";
import SectionWrapper from "@/components/general/SectionWrapper";
import ZodErrorDisplay from "@/components/general/ZodErrorDisplay";
import PasswordInput from "@/components/general/PasswordInput";
import { Button } from "@/components/ui/button";
import { useLogin } from "@/hooks/query/useUser";
import useUserContext from "@/hooks/useUserContext";
import { formatZodErrors } from "@/lib/format";
import axios from "axios";
import { FormEvent, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { ZodError } from "zod";
import { Helmet } from "react-helmet";

export default function Login() {
  const { dispatch } = useUserContext();
  const email = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string[] | null>(null);
  const navigate = useNavigate();
  const { t } = useTranslation("login");

  const { mutate, isPending } = useLogin();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email.current || !password.current) {
      return;
    }

    mutate(
      { email: email.current?.value, password: password.current?.value },
      {
        onError: (error: unknown) => {
          if (axios.isAxiosError(error)) {
            setError(
              (error.response?.data.error && [error.response?.data.error]) ||
                (error.response?.statusText && [error.response?.statusText])
            );
          }

          if (error instanceof ZodError) {
            setError(formatZodErrors(error));
          }
        },
        onSuccess: (data) => {
          dispatch({ type: "LOGIN", payload: data });
          navigate("/");
        },
      }
    );
  };

  return (
    <SectionWrapper
      id="login"
      className="justify-center px-20 py-10 max-md:px-10 max-sm:px-6"
    >
      <Helmet>
        <title>Login | Rise to Rice</title>
        <meta
          name="description"
          content="Log in to your Rise to Rice account and access your rewards and profile."
        />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href="https://risetorice.com/login" />

        <meta property="og:title" content="Login — Rise to Rice" />
        <meta
          property="og:description"
          content="Access your account to redeem, view your points and more."
        />
        <meta property="og:url" content="https://risetorice.com/login" />
        <meta
          property="og:image"
          content="https://risetorice.com/frontend/og-image.png"
        />
      </Helmet>
      <form
        onSubmit={handleSubmit}
        className="flex items-center justify-center bg-secondary-light relative p-20 w-full rounded-xl shadow-lg border flex-col max-w-screen-sm max-md:px-10 max-md:py-14 max-sm:px-6 max-sm:py-10"
      >
        <GoBackButton />
        <div className="flex flex-col items-center">
          <HeaderText className="font-bold">{t("title")}</HeaderText>
          <p className="max-md:text-sm text-center">{t("subtitle")}</p>
        </div>
        <div className="mt-10 flex flex-col gap-4 w-full max-sm:mt-6">
          <InputText name="email" ref={email} type="email" label="Email" />
          <PasswordInput name="password" ref={password} label="Password" />
          <ZodErrorDisplay error={error} />
        </div>
        <div className="flex flex-col items-center gap-10 mt-4 w-full">
          <Button
            disabled={isPending}
            className="rounded-md px-14 w-full"
            variant={"default"}
            type="submit"
          >
            {isPending ? <LoadingComponent /> : t("button.login")}
          </Button>
        </div>
        <div className="flex my-2 text-sm w-full">
          <Link
            to={"/forgot-password"}
            className="hover:underline ml-auto min-w-fit max-md:text-xs"
          >
            {t("button.forgot_password")}
          </Link>
        </div>
        <Link
          to={"/register"}
          className="text-sm text-tertiary text-center mt-4 max-md:text-xs"
        >
          {t("button.register")}
        </Link>
      </form>
    </SectionWrapper>
  );
}
