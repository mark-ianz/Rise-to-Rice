import { Gender } from "@/types/createAccount.type";
import axios, { isAxiosError } from "axios";
import { Dispatch } from "react";
import { ZodError } from "zod";

type ErrorAction = {
  type: "SET_ERROR";
  payload: string | boolean | Gender | Date | string[] | null;
};

export function getErrorMessage(error: unknown): string[] {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    let errorMessages: string[] = [];

    if (data) {
      // 1. Check for 'errors' array (objects with message)
      if (Array.isArray(data.errors)) {
        errorMessages = data.errors.map((err: any) => err.message || "An error occurred");
      }
      // 2. Check for 'error' as an array of objects or strings
      else if (data.error) {
        if (Array.isArray(data.error)) {
          errorMessages = data.error.map((err: any) => 
            typeof err === 'string' ? err : (err.message || "An error occurred")
          );
        } else if (typeof data.error === 'string') {
          errorMessages = [data.error];
        }
      }
      // 3. Check for 'message' key
      else if (data.message) {
        errorMessages = [data.message];
      }
    }

    // 4. Fallback if no specific messages found
    if (errorMessages.length === 0) {
      errorMessages = [error.response?.statusText || error.message];
    }
    return errorMessages;
  }

  if (error instanceof ZodError) {
    return error.errors.map((err) => err.message);
  }

  if (error instanceof Error) {
    return [error.message];
  }

  return ["An unknown error occurred."];
}

export function handleError(error: unknown, dispatch: Dispatch<ErrorAction>) {
  dispatch({
    type: "SET_ERROR",
    payload: getErrorMessage(error),
  });
}

export function axiosError(error: unknown) {
  if (isAxiosError(error)) {
    throw Error(error.response?.data.error || error.message);
  }
}
