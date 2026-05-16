import GoBackButton from "@/components/general/GoBackButton";
import HeaderText from "@/components/general/HeaderText";
import SectionWrapper from "@/components/general/SectionWrapper";
import ZodErrorDisplay from "@/components/general/ZodErrorDisplay";
import PasswordInput from "@/components/general/PasswordInput";
import { getErrorMessage } from "@/helper/errorHandler";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useLogin, useResetPassword } from "@/hooks/query/useUser";
import {
  useRequestVerificationCode,
  useVerifyVerificationCode,
} from "@/hooks/query/useVerification";
import useUserContext from "@/hooks/useUserContext";

import { PasswordResetSchema } from "@/schema/CreateAccountSchema";

import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Helmet } from "react-helmet";

type Sections = "first" | "second" | "reset-password";

type ForgotPasswordSectionAndSetSection = {
  section: Sections;
  setSection: (value: Sections) => void;
};

export default function ForgotPassword() {
  const [section, setSection] = useState<Sections>("first");
  const [email, setEmail] = useState<string>("");
  const [resetToken, setResetToken] = useState<string>("");

  if (section === "first") {
    return (
      <>
        <Helmet>
          <title>Forgot Password - Rise to Rice</title>
          <meta
            name="description"
            content="Reset your Rise to Rice account password. Enter your email to receive a confirmation code."
          />
          <link rel="canonical" href="https://risetorice.com/forgot-password" />
        </Helmet>
        <FirstSection
          setEmail={setEmail}
          email={email}
          setSection={setSection}
          section={section}
        />
      </>
    );
  }

  if (section === "second") {
    return (
      <>
        <Helmet>
          <title>Forgot Password - Rise to Rice</title>
          <meta
            name="description"
            content="Reset your Rise to Rice account password. Enter your email to receive a confirmation code."
          />
          <link rel="canonical" href="https://risetorice.com/forgot-password" />

          <meta property="og:title" content="Forgot Password — Rise to Rice" />
          <meta
            property="og:description"
            content="Having trouble signing in? Reset your password easily."
          />
          <meta
            property="og:url"
            content="https://risetorice.com/forgot-password"
          />
          <meta
            property="og:image"
            content="https://risetorice.com/frontend/og-image.png"
          />
        </Helmet>
        <SecondSection
          email={email}
          setResetToken={setResetToken}
          setSection={setSection}
          section={section}
        />
      </>
    );
  }

  if (section === "reset-password") {
    return (
      <>
        <Helmet>
          <title>Forgot Password - Rise to Rice</title>
          <meta
            name="description"
            content="Reset your Rise to Rice account password. Enter your email to receive a confirmation code."
          />
          <link rel="canonical" href="https://risetorice.com/forgot-password" />
        </Helmet>
        <ResetPassword email={email} resetToken={resetToken} />
      </>
    );
  }
}

function FirstSection({
  setSection,
  email,
  setEmail,
}: ForgotPasswordSectionAndSetSection & {
  email: string;
  setEmail: (value: string) => void;
}) {
  const [error, setError] = useState<string[] | null>(null);
  const { t } = useTranslation("forgot_password");

  const { mutate: request_code_mutate, isPending } =
    useRequestVerificationCode();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isPending) return;

    if (!email) {
      setError(["Email is required"]);
      return;
    }

    setError(null);

    request_code_mutate(
      { email, type: "forgot-password" },
      {
        onError: (error) => {
          setError(getErrorMessage(error));
        },
        onSuccess: () => {
          // handle success, e.g., navigate to the next step
          setSection("second");
        },
      }
    );
  };

  return (
    <SectionWrapper
      id="forgot-password"
      className="flex flex-col items-center justify-center px-20 max-md:px-10 max-sm:px-6"
    >
      <form
        onSubmit={handleSubmit}
        className="relative bg-secondary-light p-10 w-full max-w-[500px] flex flex-col items-center gap-4 rounded-lg shadow-md"
      >
        <div className="flex flex-col items-center gap-2">
          <HeaderText>{t("title")}</HeaderText>
          <p className="text-muted-foreground text-center">{t("subtext")}</p>
        </div>
        <span className="w-full flex flex-col gap-1">
          <Input
            className="bg-white"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            name="email"
            placeholder="Email address"
          />
          <ZodErrorDisplay error={error} />
        </span>
        <Button disabled={isPending} className="w-full" type="submit">
          {t("button.send")}
        </Button>
        <GoBackButton />
      </form>
    </SectionWrapper>
  );
}

function SecondSection({
  setSection,
  email,
  setResetToken,
}: ForgotPasswordSectionAndSetSection & {
  email: string;
  setResetToken: (value: string) => void;
}) {
  const { mutate: verify_code_mutate, isPending: request_code_isPending } =
    useVerifyVerificationCode();

  const { mutate: request_code_mutate } = useRequestVerificationCode();

  const { t: form } = useTranslation("form");
  const { t } = useTranslation("forgot_password");


  const [error, setError] = useState<string[] | null>(null);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [timer, setTimer] = useState(120);
  const [otp, setOtp] = useState<string>("");

  const canResend = !isResendDisabled && !request_code_isPending;

  useEffect(() => {
    if (isResendDisabled && timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(countdown);
    } else if (timer === 0) {
      setIsResendDisabled(false);
    }
  }, [isResendDisabled, timer]);

  async function handleResend() {
    if (!canResend) return;

    setError(null);

    // resend the code
    request_code_mutate(
      {
        email,
        type: "forgot-password",
      },
      {
        onSettled: () => {
          setTimer(120);
          setIsResendDisabled(true);
        },
        onSuccess: () => {
          // clear the otp input
          setOtp("");
        },
        onError: (error) => {
          setError(getErrorMessage(error));
        },
      }
    );
  }

  const handleOtpChange = (otp: string) => {
    // only allow numbers and return if not a number
    if (!/^\d*$/.test(otp)) return;

    setOtp(otp);

    // automatically submit the code when the length is 6
    if (otp.length === 6) {
      verify_code_mutate(
        {
          email: email,
          code: otp,
          type: "forgot-password",
        },
        {
          onSuccess: (data) => {
            // handle success, e.g., navigate to the next step
            setResetToken(data.reset_token);
            setSection("reset-password");
          },
          onError: (error) => {
            setError(getErrorMessage(error));
          },
        }
      );
    }
  };

  return (
    <SectionWrapper
      id="forgot-password-2nd"
      className="flex flex-col items-center justify-center px-20 max-md:px-10 max-sm:px-6"
    >
      <div className="relative bg-secondary-light p-10 w-full max-w-[500px] flex flex-col items-center gap-4 rounded-lg shadow-md">
        <div className="flex flex-col items-center gap-2">
          <HeaderText>{t("title")}</HeaderText>
          <span className="text-muted-foreground text-center">
            <p>
              {form("we_emailed_code")}{" "}
              <span className="font-semibold">{email}</span>
            </p>
            <p>{form("we_emailed_code_2")}</p>
          </span>
        </div>
        <InputOTP maxLength={6} value={otp} onChange={handleOtpChange}>
          <InputOTPGroup>
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <InputOTPSlot
                key={index}
                index={index}
                className="h-20 w-12 text-2xl max-lg:h-16 max-lg:w-10 max-lg:text-xl bg-white"
              />
            ))}
          </InputOTPGroup>
        </InputOTP>
        <ZodErrorDisplay error={error} />
        <p className="text-sm text-muted-foreground max-sm:text-xs">
          {form("code_validity", {
            time: "10",
          })}
        </p>
        {!canResend ? (
          <span className="flex flex-col items-center text-sm max-sm:text-xs">
            {form("didnt_receive_code")}{" "}
            <span className="text-tertiary">
              {request_code_isPending
                ? form("sending")
                : form("resend_code_2", {
                    timer,
                  })}
            </span>
          </span>
        ) : (
          <span
            onClick={handleResend}
            className="text-tertiary text-sm underline cursor-pointer"
          >
            {form("resend_code")}
          </span>
        )}
        <GoBackButton />
      </div>
    </SectionWrapper>
  );
}

function ResetPassword({
  email,
  resetToken,
}: {
  email: string;
  resetToken: string;
}) {
  const [error, setError] = useState<string[] | null>(null);
  const { dispatch } = useUserContext();
  const navigate = useNavigate();

  const { t: form } = useTranslation("form");

  const newPasswordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  const { mutate: reset_password_mutate } = useResetPassword();

  const { mutate: login_mutate } = useLogin();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError(null);

    const newPassword = newPasswordRef.current?.value;
    const confirmPassword = confirmPasswordRef.current?.value;

    try {
      const parsed = PasswordResetSchema.parse({
        password: newPassword,
        confirm_password: confirmPassword,
      });

      reset_password_mutate(
        { email, password: parsed.password, reset_token: resetToken },
        {
          onSuccess: () => {
            // handle success, e.g., navigate to the next step
            // automatically log the user in
            login_mutate(
              {
                email,
                password: parsed.password,
              },
              {
                onSuccess: (data) => {
                  dispatch({ type: "LOGIN", payload: data });
                  navigate("/");
                  toast.success(
                    <span className="flex flex-col gap-1">
                      <span>Password reset successfully.</span>
                      <span>You are now logged in.</span>
                    </span>
                  );
                },
                onError: (error) => {
                  setError(getErrorMessage(error));
                },
              }
            );
          },
          onError: (error) => {
            setError(getErrorMessage(error));
          },
        }
      );
    } catch (error) {
      setError(getErrorMessage(error));
    }
  };

  return (
    <SectionWrapper
      id="forgot-password"
      className="flex flex-col items-center justify-center px-20 max-md:px-10 max-sm:px-6"
    >
      <form
        onSubmit={handleSubmit}
        className="relative bg-secondary-light p-10 w-full max-w-[500px] flex flex-col items-center gap-4 rounded-lg shadow-md"
      >
        <div className="flex flex-col items-center gap-2">
          <HeaderText>Reset Password</HeaderText>
          <p className="text-muted-foreground">Enter your new password below</p>
        </div>
        <div className="w-full gap-2 flex flex-col">
          <PasswordInput
            label="Password"
            name="password"
            ref={newPasswordRef}
          />
          <PasswordInput
            label={form("confirm_password")}
            name="confirm_password"
            ref={confirmPasswordRef}
          />
          <ZodErrorDisplay error={error} />
        </div>
        <Button className="w-full" type="submit">
          Reset
        </Button>
        <GoBackButton />
      </form>
    </SectionWrapper>
  );
}
