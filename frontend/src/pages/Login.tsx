import LogoNav from "@/components/header/LogoNav";
import InputText from "@/components/general/InputText";
import LoadingComponent from "@/components/general/LoadingComponent";
import PasswordInput from "@/components/general/PasswordInput";
import ZodErrorDisplay from "@/components/general/ZodErrorDisplay";
import AuthHeroPanel from "@/components/page-components/auth/AuthHeroPanel";
import AuthPageLayout from "@/components/page-components/auth/AuthPageLayout";
import AuthShell from "@/components/page-components/auth/AuthShell";
import { Button } from "@/components/ui/button";
import { useLogin } from "@/hooks/query/useUser";
import useUserContext from "@/hooks/useUserContext";
import { formatZodErrors } from "@/lib/format";
import axios from "axios";
import { FormEvent, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { ZodError } from "zod";

export default function Login() {
  const { dispatch } = useUserContext();
  const email = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string[] | null>(null);
  const navigate = useNavigate();
  const { t: form } = useTranslation("form");

  const { mutate, isPending } = useLogin();

  const authFieldClassName =
    "h-11 rounded-lg border border-gray-300 bg-white px-3 shadow-sm transition-colors focus-visible:ring-1 focus-visible:ring-primary-main focus-visible:border-primary-main focus-visible:outline-none";
  const authLabelClassName = "text-sm font-medium text-gray-700 mb-1.5";

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email.current || !password.current) {
      return;
    }

    mutate(
      { email: email.current.value, password: password.current.value },
      {
        onError: (error: unknown) => {
          if (axios.isAxiosError(error)) {
            setError(
              (error.response?.data.error && [error.response.data.error]) ||
              (error.response?.statusText && [error.response.statusText])
            );
          }

          if (error instanceof ZodError) {
            setError(formatZodErrors(error));
          }
        },
        onSuccess: (data) => {
          localStorage.removeItem("registerState");
          localStorage.removeItem("registerSection");
          localStorage.removeItem("registerMaxReachedSection");
          dispatch({ type: "LOGIN", payload: data });
          navigate("/home");
        },
      }
    );
  };

  const loginFeatures = [
    {
      title: "Track Your Impact",
      description: "Monitor your recycling progress and see the real-world difference you're making.",
    },
    {
      title: "Earn Exclusive Rewards",
      description: "Accumulate points for every contribution and redeem them for exciting perks.",
    },
    {
      title: "Join the Community",
      description: "Connect with like-minded individuals dedicated to sustainability and a cleaner future.",
    },
  ];

  return (
    <AuthPageLayout id="login">
      <Helmet>
        <title>Login | Rise to Rice</title>
        <meta
          name="description"
          content="Log in to your Rise to Rice account and access your rewards and profile."
        />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href="https://risetorice.com/login" />
      </Helmet>

      <AuthShell
        hero={
          <AuthHeroPanel
            title={
              <>
                Connecting You to a<br />
                Greener Future
              </>
            }
            description="Discover a platform designed to help you contribute, collaborate, and grow your sustainable impact."
            features={loginFeatures}
          />
        }
      >
        <div className="relative flex flex-col justify-center min-h-screen bg-[#fcfdfc] p-8 sm:p-12 lg:p-16">
          <div className="absolute top-12 right-12">
            <LogoNav rightLogo />
          </div>

          <form
            autoComplete="off"
            onSubmit={handleSubmit}
            className="flex w-full max-w-xl flex-col gap-8 mx-auto"
          >
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Welcome back!
              </h1>
              <p className="text-base text-gray-500 font-medium">
                Enter your credentials to securely access your account.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex flex-col gap-6">
                <InputText
                  name="email"
                  ref={email}
                  type="email"
                  label={form("email")}
                  autoComplete="email"
                  labelClassname={authLabelClassName}
                  inputClassName={authFieldClassName}
                  placeholder="Enter your email"
                />
                <div className="space-y-2">
                  <PasswordInput
                    name="password"
                    ref={password}
                    label={form("password")}
                    autoComplete="current-password"
                    labelClassName={authLabelClassName}
                    inputClassName={authFieldClassName}
                    toggleButtonClassName="right-2 h-9 w-9 text-gray-400 hover:text-gray-600 transition-colors"
                    placeholder="Password"
                  />
                  <div className="flex justify-end">
                    <Link
                      to={"/forgot-password"}
                      className="text-sm font-semibold text-primary-main hover:text-primary-dark transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>
                </div>

                <ZodErrorDisplay
                  error={error}
                  className="rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-100"
                />
              </div>

              <div className="pt-4 flex flex-col gap-4 items-center">
                <Button
                  disabled={isPending}
                  className="h-12 w-full rounded-md text-base font-semibold bg-primary-main text-white hover:bg-primary-dark shadow-md shadow-primary-main/20 transition-all hover:-translate-y-0.5 active:translate-y-0"
                  variant={"default"}
                  type="submit"
                >
                  {isPending ? <LoadingComponent /> : "Login Now"}
                </Button>

                <Link
                  to={"/register"}
                  className="text-sm text-primary-main hover:text-primary-dark transition-colors"
                >
                  Don't have an account?
                </Link>
              </div>
            </div>
          </form>
        </div>
      </AuthShell>
    </AuthPageLayout>
  );
}

