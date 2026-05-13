import HeaderText from "@/components/general/HeaderText";
import LoadingComponent from "@/components/general/LoadingComponent";
import ZodErrorDisplay from "@/components/general/ZodErrorDisplay";
import useCreateAccountContext from "@/hooks/useCreateAccountContext";
import { handleError } from "@/helper/errorHandler";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  useRequestVerificationCode,
  useVerifyVerificationCode,
} from "@/hooks/query/useVerification";
import { SectionAndSetSection } from "../credentials/CredentialsSubmitButton";

export default function EmailVerification({
  setSection,
}: SectionAndSetSection) {
  const { t: form } = useTranslation("form");
  const { t } = useTranslation("register");

  const { state, dispatch } = useCreateAccountContext();
  const [otp, setOtp] = useState<string>("");

  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const [timer, setTimer] = useState(0);

  const { mutate: request_code_mutate, isPending: request_code_isPending } =
    useRequestVerificationCode();

  const { mutate: verify_code_mutate } = useVerifyVerificationCode();

  const canResend = !isResendDisabled && !request_code_isPending;

  useEffect(() => {
    if (!state.email) return;

    request_code_mutate(
      { email: state.email, type: "register" },
      {
        onSettled: () => {
          setTimer(120);
          setIsResendDisabled(true);
        },
        onSuccess: () => {
          setOtp("");
        },
      }
    );
  }, [state.email, request_code_mutate]);

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

    dispatch({
      type: "SET_ERROR",
      payload: null,
    });

    request_code_mutate(
      {
        email: state.email,
        type: "register",
      },
      {
        onSettled: () => {
          setTimer(120);
          setIsResendDisabled(true);
        },
        onSuccess: () => {
          setOtp("");
        },
        onError: (error) => {
          handleError(error, dispatch);
          setIsResendDisabled(false);
        },
      }
    );
  }

  const handleOtpChange = (otp: string) => {
    if (!/^\d*$/.test(otp)) return;

    setOtp(otp);

    if (otp.length === 6) {
      verify_code_mutate(
        {
          email: state.email,
          code: otp,
          type: "register",
        },
        {
          onSuccess: () => {
            dispatch({
              type: "SET_ERROR",
              payload: null,
            });
            setSection("success");
          },
          onError: (error) => {
            handleError(error, dispatch);
          },
        }
      );
    }
  };

  const handleGoBack = () => {
    setSection("credentials");
    dispatch({ type: "SET_ERROR", payload: null });
  };

  if (request_code_isPending && !otp) {
    return (
      <div className="flex min-h-[18rem] items-center justify-center">
        <LoadingComponent className="h-12 w-12 text-gray-900" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gray-500">
          {t("steps.email_verification.eyebrow")}
        </p>
        <HeaderText className="text-gray-900 text-2xl font-bold">
          {t("steps.email_verification.title")}
        </HeaderText>

      </div>

      <div className="grid gap-4">
        <div className="bg-gray-50 p-6 rounded-md border border-gray-200 text-sm leading-6 text-gray-700">
          <p>
            {form("we_emailed_code")}{" "}
            <span className="font-bold text-gray-900">
              {state.email}
            </span>
          </p>
          <p className="text-gray-500">{form("we_emailed_code_2")}</p>
        </div>

        <div className="mt-4">
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={handleOtpChange}
            containerClassName="w-full"
          >
            <InputOTPGroup className=" w-full">
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <InputOTPSlot
                  key={index}
                  index={index}
                  className="flex-1 aspect-square h-auto  text-2xl font-bold max-sm:text-xl"
                />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>

        <ZodErrorDisplay
          error={state.error}
          className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-100"
        />

        <div className="space-y-2 flex items-center justify-center flex-col">
          <p className="text-sm text-gray-500 font-medium">
            {form("code_validity", {
              time: "10",
            })}
          </p>

          {!canResend ? (
            <div className="flex flex-col gap-1 text-sm text-gray-500 font-medium w-full justify-center items-center">
              <span>{form("didnt_receive_code")}</span>
              <span className="font-bold text-gray-900 text-center w-full">
                {request_code_isPending
                  ? form("sending")
                  : form("resend_code_2", {
                    timer,
                  })}
              </span>
            </div>
          ) : (
            <div className="w-full flex items-center justify-center">

              <button
                type="button"
                onClick={handleResend}
                className="text-sm font-bold text-gray-900 underline underline-offset-4 transition-colors hover:text-black self-start text-left"
              >
                {form("resend_code")}
              </button>
            </div>

          )}
          <div className="pt-6 flex flex-col gap-4 w-full">
            <Button
              type="button"
              className="h-12 w-full rounded-md text-base font-semibold bg-white text-gray-800 border border-gray-200 hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-none"
              onClick={handleGoBack}
            >
              {form("go_back")}
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}