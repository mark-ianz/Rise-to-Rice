import {
  requestVerificationCode,
  verifyVerificationCode,
} from "@/services/verification-code.service";
import { useMutation } from "@tanstack/react-query";

export function useRequestVerificationCode() {
  return useMutation({
    mutationKey: ["request-code"],
    mutationFn: async ({
      email,
      type,
    }: {
      email: string;
      type: "register" | "forgot-password";
    }) => {
      await requestVerificationCode(email, type);
    },
  });
}

export function useVerifyVerificationCode() {
  return useMutation({
    mutationKey: ["verify-code"],
    mutationFn: async ({
      email,
      code,
      type,
    }: {
      email: string;
      code: string;
      type: "register" | "forgot-password";
    }) => {
      const response = await verifyVerificationCode(email, code, type);

      return response.data;
    },
  });
}
