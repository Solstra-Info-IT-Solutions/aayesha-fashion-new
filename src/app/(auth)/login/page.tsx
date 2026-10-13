import { AuthShell } from "@/components/auth/auth-shell";
import { MobileLoginForm } from "@/components/auth/mobile-login-form";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Account",
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginPage() {
  return (
    <AuthShell
      title="Log in"
      subtitle="Enter your mobile number to continue with Aayesha Fashion. We will send you a one-time password."
      backHref="/"
      backLabel="Back to home"
    >
      <MobileLoginForm />
    </AuthShell>
  );
}