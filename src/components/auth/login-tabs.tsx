"use client";

import { useState } from "react";

import { LoginForm } from "@/components/auth/login-form";
import { OtpLoginForm } from "@/components/auth/otp-login-form";

import "./LoginTabs.css";

export function LoginTabs() {
  const [mode, setMode] = useState<"password" | "otp">("password");

  return (
    <>
      <div
        className="login-tabs"
        role="tablist"
        aria-label="Sign in method"
      >
        <button
          type="button"
          role="tab"
          aria-selected={mode === "password"}
          onClick={() => setMode("password")}
          className="login-tabs__tab"
        >
          Password
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={mode === "otp"}
          onClick={() => setMode("otp")}
          className="login-tabs__tab"
        >
          Email / Mobile OTP
        </button>
      </div>

      {mode === "password" ? <LoginForm /> : <OtpLoginForm />}
    </>
  );
}
