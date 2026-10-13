"use client";

/**
 * Firebase Phone Auth, loaded only when the backend says real SMS login is on
 * (in test mode none of this runs). Only the app and auth packages are used, so
 * none of Firebase's database code reaches the page.
 */
import type { ConfirmationResult } from "@firebase/auth";

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "",
};

export const isFirebaseConfigured = Boolean(
  config.apiKey && config.authDomain && config.projectId && config.appId,
);

type Verifier = { clear: () => void };

let verifier: Verifier | null = null;

async function getFirebaseAuth() {
  const [{ getApp, getApps, initializeApp }, { getAuth }] = await Promise.all([
    import("@firebase/app"),
    import("@firebase/auth"),
  ]);

  const app = getApps().length ? getApp() : initializeApp(config);

  const auth = getAuth(app);

  auth.languageCode = "en";

  return auth;
}

/** Sends the SMS code to an Indian mobile number (10 digits). */
export async function sendFirebaseCode(
  tenDigitPhone: string,
  recaptchaContainerId: string,
): Promise<ConfirmationResult> {
  const { RecaptchaVerifier, signInWithPhoneNumber } = await import("@firebase/auth");
  const auth = await getFirebaseAuth();

  verifier?.clear();

  const recaptcha = new RecaptchaVerifier(auth, recaptchaContainerId, {
    size: "invisible",
  });

  verifier = recaptcha;

  try {
    return await signInWithPhoneNumber(auth, `+91${tenDigitPhone}`, recaptcha);
  } catch (error) {
    recaptcha.clear();
    verifier = null;

    throw error;
  }
}

/** Confirms the SMS code and returns the Firebase ID token for the backend. */
export async function confirmFirebaseCode(
  confirmation: ConfirmationResult,
  code: string,
): Promise<string> {
  const credential = await confirmation.confirm(code);

  return credential.user.getIdToken();
}

/** Friendly text for the Firebase errors a customer can actually hit. */
export function describeFirebaseError(error: unknown): string {
  const code = (error as { code?: string } | null)?.code ?? "";

  switch (code) {
    case "auth/invalid-phone-number":
      return "Enter a valid 10-digit mobile number.";
    case "auth/too-many-requests":
      return "Too many attempts. Please wait a few minutes and try again.";
    case "auth/invalid-verification-code":
    case "auth/code-expired":
      return "That OTP is invalid or has expired.";
    case "auth/captcha-check-failed":
    case "auth/network-request-failed":
      return "Could not reach the verification service. Check your connection and try again.";
    default:
      return "We could not send the OTP right now. Please try again shortly.";
  }
}
