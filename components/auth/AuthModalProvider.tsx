"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import AuthModal from "@/components/auth/AuthModal";
import TourModal from "@/components/onboarding/TourModal";

interface AuthModalContextValue {
  openAuthModal: () => void;
}

const AuthModalContext = createContext<AuthModalContextValue>({
  openAuthModal: () => {},
});

export function useAuthModal() {
  return useContext(AuthModalContext);
}

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  const [tourOpen, setTourOpen] = useState(false);
  const [tourUsername, setTourUsername] = useState("");

  return (
    <AuthModalContext.Provider value={{ openAuthModal: () => setOpen(true) }}>
      {children}
      <AuthModal
        open={open}
        onClose={() => setOpen(false)}
        onSignupComplete={(username) => {
          // Ports setTimeout(() => window.__startTour(username,
          // profilePic), 300) — same 300ms delay after the auth modal
          // closes, before the tour opens. profilePic isn't needed by
          // TourModal itself (only step 1's title uses username; the
          // original's _tourProfilePic is captured but never actually
          // read anywhere in tourStepData's rendering either), so only
          // username is threaded through here.
          setTimeout(() => {
            setTourUsername(username);
            setTourOpen(true);
          }, 300);
        }}
      />
      <TourModal
        open={tourOpen}
        username={tourUsername}
        onFinish={() => {
          // Ports window.__nextTourStep's last-step branch: closeTour()
          // then __openThemePicker(). The theme picker is a large,
          // separate feature already tracked as a placeholder in
          // AppearancePanel (Settings → Appearance's own "Open Theme
          // Picker" button already toasts "isn't built yet") — rather
          // than duplicate that placeholder here, this just closes the
          // tour. Once the real theme picker exists, this is the one
          // line that needs to call it instead.
          setTourOpen(false);
        }}
      />
    </AuthModalContext.Provider>
  );
}
