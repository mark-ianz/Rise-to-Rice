import axios from "axios";

export async function requestVerificationCode(
  email: string,
  type: "register" | "forgot-password"
) {
  return await axios.post("/api/user/verification-code/request", {
    email,
    type,
  });
}

export async function verifyVerificationCode(
  email: string,
  code: string,
  type: "register" | "forgot-password"
) {
  return await axios.post("/api/user/verification-code/verify", {
    email,
    code,
    type,
  });
}
