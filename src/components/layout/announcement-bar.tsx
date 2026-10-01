"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Gift, RotateCcw, ShieldCheck, Truck } from "lucide-react";

import {
  getAvailableCustomerCoupons,
  type AvailableCustomerCoupon,
} from "@/services/coupon.service";

import "./AnnouncementBar.css";

type Message = {
  id: string;
  text: string;
  href: string;
  icon: "truck" | "gift" | "shield" | "return";
};

const STATIC_MESSAGES: Message[] = [
  {
    id: "shipping",
    text: "Complimentary shipping on orders above ₹2,999",
    href: "/shop",
    icon: "truck",
  },
  {
    id: "payments",
    text: "Pay easily by UPI: your bill is sent straight to WhatsApp",
    href: "/shipping",
    icon: "shield",
  },
  {
    id: "returns",
    text: "Easy returns & exchanges on eligible orders",
    href: "/returns",
    icon: "return",
  },
];

const ROTATE_MS = 4200;

const money = (value: number) =>
  `₹${value.toLocaleString("en-IN")}`;

function couponMessage(coupon: AvailableCustomerCoupon): Message {
  const offer =
    coupon.discountType === "percentage"
      ? `${coupon.discountValue}% off`
      : coupon.discountType === "fixed"
        ? `${money(coupon.discountValue)} off`
        : "Free shipping";

  const min =
    coupon.minimumOrderValue > 0
      ? ` on orders above ${money(coupon.minimumOrderValue)}`
      : "";

  return {
    id: `coupon-${coupon.code}`,
    text: `${offer}${min} — use code ${coupon.code}`,
    href: "/shop",
    icon: "gift",
  };
}

function Icon({ name }: { name: Message["icon"] }) {
  const props = { size: 13, strokeWidth: 1.5 } as const;

  switch (name) {
    case "gift":
      return <Gift {...props} />;
    case "shield":
      return <ShieldCheck {...props} />;
    case "return":
      return <RotateCcw {...props} />;
    default:
      return <Truck {...props} />;
  }
}

/**
 * Top-of-site offer strip. Rotates through the store's live coupon
 * (when one is active) and standing promises. It sits in normal flow
 * at the very top of the page; the fixed header slides up to the
 * viewport edge as the bar scrolls out of view (see --announce-offset).
 */
export function AnnouncementBar() {
  const barRef = useRef<HTMLDivElement>(null);

  const [coupons, setCoupons] = useState<AvailableCustomerCoupon[]>([]);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  /* Live offers */
  useEffect(() => {
    let cancelled = false;

    getAvailableCustomerCoupons()
      .then((items) => {
        if (!cancelled) setCoupons(items.slice(0, 2));
      })
      .catch(() => {
        /* standing messages only */
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const messages = [...coupons.map(couponMessage), ...STATIC_MESSAGES];
  const active = messages[index % messages.length] ?? STATIC_MESSAGES[0]!;

  /* Rotation */
  useEffect(() => {
    if (paused || messages.length < 2) return;

    const timer = window.setInterval(
      () => setIndex((current) => current + 1),
      ROTATE_MS,
    );

    return () => window.clearInterval(timer);
  }, [paused, messages.length]);

  /* Header offset: the bar scrolls away, the header takes its place */
  useEffect(() => {
    const root = document.documentElement;
    const node = barRef.current;

    if (!node) return;

    const update = () => {
      const height = node.offsetHeight;

      root.style.setProperty("--announce-height", `${height}px`);
      root.style.setProperty(
        "--announce-offset",
        `${Math.max(0, height - window.scrollY)}px`,
      );
    };

    update();

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      root.style.removeProperty("--announce-height");
      root.style.removeProperty("--announce-offset");
    };
  }, []);

  return (
    <div
      ref={barRef}
      className="announcement-bar"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <Link
        key={active.id}
        href={active.href}
        className="announcement-bar__link"
      >
        <span className="announcement-bar__icon" aria-hidden="true">
          <Icon name={active.icon} />
        </span>

        <span className="announcement-bar__text">{active.text}</span>
      </Link>
    </div>
  );
}
