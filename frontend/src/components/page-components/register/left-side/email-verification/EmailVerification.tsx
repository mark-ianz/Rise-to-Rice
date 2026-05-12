import useCreateAccountContext from "@/hooks/useCreateAccountContext";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useEffect, useState } from "react";
import LoadingComponent from "@/components/general/LoadingComponent";
import { handleError } from "@/helper/errorHandler";
import ZodErrorDisplay from "@/components/general/ZodErrorDisplay";
import { SectionAndSetSection } from "../credentials/CredentialsSubmitButton";
import { useTranslation } from "react-i18next";
import {
  useRequestVerificationCode,
  useVerifyVerificationCode,
} from "@/hooks/query/useVerification";

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

  // automatically request a verification code after the component mounts
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
          // clear the otp input
          setOtp("");
        },
      }
    );
  }, [state.email, request_code_mutate]);

  // useEffect for resend button cooldown
  // when the resend button is clicked, start a cooldown of 60 seconds
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

    // resend the code
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
          // clear the otp input
          setOtp("");
        },
        onError: (error) => {
          console.log(error)
          handleError(error, dispatch);
          setIsResendDisabled(false);
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

  if (request_code_isPending) {
    return (
      <span className="py-8 items-center flex justify-center">
        <LoadingComponent className="w-12 h-12" />
      </span>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-xl max-lg:text-base">{t("verify_email")}</p>
      <span className="text-muted-foreground max-md:text-sm flex flex-col gap-2">
        <p>
          {form("we_emailed_code")}{" "}
          <span className="font-semibold">{state.email}</span>
        </p>
        <p>{form("we_emailed_code_2")}</p>
      </span>
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
      <ZodErrorDisplay error={state.error} />
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
    </div>
  );
}
