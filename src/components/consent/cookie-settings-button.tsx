"use client";

import { useState } from "react";

import { CookiePreferences } from "./cookie-preferences";

import "./CookieSettingsButton.css";

export function CookieSettingsButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="cookie-settings-button"
        onClick={() => setOpen(true)}
        aria-label="Manage cookie preferences"
      >
        Cookie Settings
      </button>

      <CookiePreferences
        open={open}
        onClose={() => setOpen(false)}
        onSaved={() => setOpen(false)}
      />
    </>
  );
}