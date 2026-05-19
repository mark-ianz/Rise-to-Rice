import crypto from "crypto";

/**
 * Generates a secure, non-guessable, 8-character alphanumeric string key.
 * This is similar to Reddit's base-36 IDs (e.g. "1tg4exj3") or YouTube's keys.
 */
export function generatePublicId(): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  const bytes = crypto.randomBytes(8);
  for (let i = 0; i < 8; i++) {
    result += chars[bytes[i] % chars.length];
  }
  return result;
}
