import { Gender } from "@/types/createAccount.type";
import axios, { isAxiosError } from "axios";
import { Dispatch } from "react";
import { ZodError } from "zod";

type ErrorAction = {
  type: "SET_ERROR";
  payload: string | boolean | Gender | Date | string[] | null;
};

export function handleError(error: unknown, dispatch: Dispatch<ErrorAction>) {
  if (axios.isAxiosError(error)) {
    dispatch({
      type: "SET_ERROR",
      payload: error.response?.data.errors.map(
        (error: { message: string; path: string }) => error.message
      ) || [error.response?.statusText],
    });
  }

  if (error instanceof ZodError) {
    dispatch({
      type: "SET_ERROR",
      payload: error.errors.map((err) => err.message),
    });
  }
}

export function axiosError(error: unknown) {
  if (isAxiosError(error)) {
    throw Error(error.response?.data.error || error.message);
  }
}
