"use client";

import { useEffect, useState, type FormEvent } from "react";

import { BadgeCheck, Loader2, MailCheck } from "lucide-react";
import toast from "react-hot-toast";

import { apiFetch } from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";

import "./EmailVerification.css";

const RESEND_SECONDS = 60;

/**
 * Optional email verification from the profile. Sign-in never depends on it:
 * the customer can skip this and verify whenever they like.
 */
export function EmailVerification({
  email,
  verified,
  onVerified,
}: {
  email: string;
  verified: boolean;
  onVerified: () => void;
}) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const fetchMe = useAuthStore((state) => state.fetchMe);

  const [open, setOpen] = useState(false);
  const [otp, setOtp] = useState("");
  const [busy, setBusy] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = window.setTimeout(() => setCooldown((value) => value - 1), 1000);

    return () => window.clearTimeout(timer);
  }, [cooldown]);

  if (verified) {
    return (
      <div className="email-verification email-verification--done">
        <BadgeCheck size={17} aria-hidden="true" />

        <span>Email verified</span>
      </div>
    );
  }

  const messageOf = (cause: unknown, fallback: string) =>
    cause instanceof Error && cause.message ? cause.message : fallback;

  async function sendCode() {
    if (busy || cooldown > 0 || !accessToken) return;

    setBusy(true);
    setError("");

    try {
      const result = await apiFetch<{ alreadyVerified: boolean }>(
        "/auth/email-verification/send",
        { method: "POST", accessToken },
      );

      if (result.alreadyVerified) {
        await fetchMe();
        onVerified();

        return;
      }

      setOpen(true);
      setOtp("");
      setCooldown(RESEND_SECONDS);
      toast.success(`We have emailed a 6-digit code to ${email}.`);
    } catch (cause) {
      setError(messageOf(cause, "We could not send the code. Please try again."));
    } finally {
      setBusy(false);
    }
  }

  async function confirm(event: FormEvent) {
    event.preventDefault();

    if (busy || !accessToken) return;

    if (!/^\d{6}$/.test(otp)) {
      setError("Enter the 6-digit code.");

      return;
    }

    setBusy(true);
    setError("");

    try {
      await apiFetch("/auth/email-verification/confirm", {
        method: "POST",
        accessToken,
        body: JSON.stringify({ otp }),
      });

      await fetchMe();
      toast.success("Your email is verified.");
      setOpen(false);
      onVerified();
    } catch (cause) {
      setError(messageOf(cause, "That code did not work. Please try again."));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="email-verification">
      <div className="email-verification__row">
        <MailCheck size={17} aria-hidden="true" />

        <span>Email not verified (optional)</span>

        {!open ? (
          <button
            type="button"
            className="email-verification__button"
            disabled={busy}
            onClick={() => void sendCode()}
          >
            {busy ? <Loader2 size={14} className="email-verification__spin" aria-hidden="true" /> : null}
            Verify email
          </button>
        ) : null}
      </div>

      {open ? (
        <form className="email-verification__form" onSubmit={confirm} noValidate>
          <label htmlFor="email-verification-code">
            Enter the code sent to {email}
          </label>

          <div className="email-verification__controls">
            <input
              id="email-verification-code"
              value={otp}
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              placeholder="6-digit code"
              onChange={(event) =>
                setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))
              }
            />

            <button type="submit" className="email-verification__button" disabled={busy}>
              Confirm
            </button>
          </div>

          <button
            type="button"
            className="email-verification__link"
            disabled={busy || cooldown > 0}
            onClick={() => void sendCode()}
          >
            {cooldown > 0 ? `Resend code in ${cooldown}s` : "Resend code"}
          </button>
        </form>
      ) : null}

      {error ? (
        <p role="alert" className="email-verification__error">
          {error}
        </p>
      ) : null}
    </div>
  );
}
