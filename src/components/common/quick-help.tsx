"use client";

import {
  ChevronRight,
  HelpCircle,
  PackageSearch,
  RotateCcw,
  ShoppingBag,
  Truck,
  X,
} from "lucide-react";

import Link from "next/link";
import { useState } from "react";

import "./QuickHelp.css";

/* =========================================================
   HELP ITEMS
========================================================= */

const helpItems = [
  {
    label: "Track an Order",
    description: "Check your order status",
    href: "/account/orders",
    icon: PackageSearch,
  },
  {
    label: "Shipping & Delivery",
    description: "Delivery information",
    href: "/shipping",
    icon: Truck,
  },
  {
    label: "Returns & Exchange",
    description: "View our return policy",
    href: "/returns",
    icon: RotateCcw,
  },
  {
    label: "Shopping Help",
    description: "Need help choosing?",
    href: "/contact",
    icon: ShoppingBag,
  },
];

/* =========================================================
   COMPONENT
========================================================= */

export function QuickHelp() {
  const [open, setOpen] = useState(false);

  /* =======================================================
     CLOSE PANEL
  ======================================================= */

  const closeHelp = () => {
    setOpen(false);
  };

  /* =======================================================
     TOGGLE PANEL
  ======================================================= */

  const toggleHelp = () => {
    setOpen((current) => !current);
  };

  return (
    <>
      {/* =====================================================
          BACKDROP
      ===================================================== */}

      {open && (
        <button
          type="button"
          aria-label="Close quick help"
          className="quick-help__backdrop"
          onClick={closeHelp}
        />
      )}

      {/* =====================================================
          QUICK HELP
      ===================================================== */}

      <div
        className={[
          "quick-help",
          open ? "quick-help--open" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {/* ===================================================
            HELP PANEL
        =================================================== */}

        {open && (
          <div
            id="quick-help-panel"
            className="quick-help__panel"
            role="dialog"
            aria-modal="false"
            aria-labelledby="quick-help-title"
          >
            {/* ===============================================
                HEADER
            =============================================== */}

            <div className="quick-help__panel-header">
              <div>
                <p className="quick-help__eyebrow">
                  AAYESHA CARE
                </p>

                <h2
                  id="quick-help-title"
                  className="quick-help__title"
                >
                  How can we help?
                </h2>
              </div>

              <button
                type="button"
                onClick={closeHelp}
                aria-label="Close quick help"
                className="quick-help__close"
              >
                <X
                  size={17}
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
              </button>
            </div>

            {/* ===============================================
                HELP ITEMS
            =============================================== */}

            <div className="quick-help__items">
              {helpItems.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={closeHelp}
                    className="quick-help__item"
                  >
                    {/* ICON */}

                    <span
                      aria-hidden="true"
                      className="quick-help__item-icon"
                    >
                      <Icon
                        size={17}
                        strokeWidth={1.5}
                      />
                    </span>

                    {/* CONTENT */}

                    <span className="quick-help__item-content">
                      <span className="quick-help__item-label">
                        {item.label}
                      </span>

                      <span className="quick-help__item-description">
                        {item.description}
                      </span>
                    </span>

                    {/* NAVIGATION INDICATOR */}

                    <ChevronRight
                      className="quick-help__item-arrow"
                      size={16}
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                  </Link>
                );
              })}
            </div>

            {/* ===============================================
                FOOTER
            =============================================== */}

            <div className="quick-help__panel-footer">
              <span>
                Need something else?
              </span>

              <Link
                href="/contact"
                onClick={closeHelp}
              >
                Contact us
              </Link>
            </div>
          </div>
        )}

        {/* ===================================================
            TRIGGER
        =================================================== */}

        <button
          type="button"
          onClick={toggleHelp}
          aria-expanded={open}
          aria-controls="quick-help-panel"
          aria-label={
            open
              ? "Close quick help"
              : "Open quick help"
          }
          className="quick-help__trigger"
        >
          {/* TRIGGER ICON */}

          <span
            aria-hidden="true"
            className="quick-help__trigger-icon"
          >
            {open ? (
              <X
                size={19}
                strokeWidth={1.6}
              />
            ) : (
              <HelpCircle
                size={19}
                strokeWidth={1.6}
              />
            )}
          </span>
        </button>
      </div>
    </>
  );
}