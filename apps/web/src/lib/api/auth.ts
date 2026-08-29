import { apiFetch } from "@/lib/api-client";
import type { SendOtpInput, UpdateProfileInput, VerifyOtpInput } from "@karigar-wala/shared";

export interface CurrentUser {
  id: string;
  name?: string;
  phone: string;
  email?: string;
  photoUrl?: string;
  isTrusted: boolean;
  isVerified: boolean;
  memberSince: string;
}

export function sendOtp(input: SendOtpInput) {
  return apiFetch<{ message: string }>("/auth/otp/send", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function verifyOtp(input: VerifyOtpInput) {
  return apiFetch<{ user: CurrentUser }>("/auth/otp/verify", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function logout() {
  return apiFetch<void>("/auth/logout", { method: "POST" });
}

export function fetchCurrentUser() {
  return apiFetch<CurrentUser>("/users/me");
}

export function updateProfile(input: UpdateProfileInput) {
  return apiFetch<CurrentUser>("/users/me", {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}
