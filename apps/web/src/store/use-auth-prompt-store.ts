import { create } from "zustand";

/**
 * Drives the phone+OTP modal used for lazy auth: browsing stays open to
 * guests, and any action that needs an identity (confirm booking, open
 * Profile/My Bookings/My Contracts) opens this modal instead of routing to a
 * dedicated login page. `onSuccess` lets the caller resume whatever it was
 * doing once verification completes, instead of navigating away.
 */
interface AuthPromptState {
  isOpen: boolean;
  onSuccess: (() => void) | null;
  open: (onSuccess?: () => void) => void;
  close: () => void;
}

export const useAuthPromptStore = create<AuthPromptState>((set) => ({
  isOpen: false,
  onSuccess: null,
  open: (onSuccess) => set({ isOpen: true, onSuccess: onSuccess ?? null }),
  close: () => set({ isOpen: false, onSuccess: null }),
}));
