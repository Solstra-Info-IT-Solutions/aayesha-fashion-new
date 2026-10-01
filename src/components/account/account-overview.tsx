"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Bell,
  CheckCircle2,
  Circle,
  Clock3,
  Heart,
  PackageCheck,
  ShoppingBag,
  Star,
} from "lucide-react";
import toast from "react-hot-toast";

import { ReorderButton } from "@/components/orders-sales/reorder-button";
import { getCustomerOrders, type OrderDetails } from "@/lib/api/orders";
import { getMyReviews } from "@/lib/api/reviews";
import {
  getCustomerAddresses,
  getCustomerProfile,
  updateCustomerProfile,
  type CustomerAddress,
} from "@/lib/customer-api";
import { getCart, type Cart } from "@/services/cart.service";
import { useAuthStore } from "@/store/auth-store";
import { useWishlistStore } from "@/store/wishlist-store";
import type { CustomerProfile } from "@/types/customer";

import "./AccountOverview.css";

const money = (value: number) =>
  `₹${Math.round(value).toLocaleString("en-IN")}`;

const pad = (value: number) => String(value).padStart(2, "0");

function countdown(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));

  return `${pad(Math.floor(total / 60))}:${pad(total % 60)}`;
}

type Action = {
  id: string;
  icon: typeof Clock3;
  tone?: "urgent";
  title: string;
  text: string;
  href?: string;
  cta?: string;
  custom?: React.ReactNode;
};

/**
 * Account home overview: what is happening with the customer's
 * orders, bag and wishlist, the best next step, and how complete the
 * profile is. Everything shown comes from the customer's own data.
 */
export function AccountOverview() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const isInitialized = useAuthStore((s) => s.isInitialized);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const wishlistCount = useWishlistStore((s) => s.productIds.length);

  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [orders, setOrders] = useState<OrderDetails[]>([]);
  const [addresses, setAddresses] = useState<CustomerAddress[]>([]);
  const [cart, setCart] = useState<Cart | null>(null);
  const [reviewed, setReviewed] = useState<string[]>([]);
  const [now, setNow] = useState(() => Date.now());
  const [savingPrefs, setSavingPrefs] = useState(false);

  useEffect(() => {
    if (!isInitialized || !isAuthenticated || !accessToken) return;

    let cancelled = false;

    Promise.allSettled([
      getCustomerProfile(accessToken),
      getCustomerOrders(accessToken),
      getCustomerAddresses(accessToken),
      getCart(),
      getMyReviews(accessToken),
    ]).then(([p, o, a, c, r]) => {
      if (cancelled) return;

      if (p.status === "fulfilled") setProfile(p.value);
      if (o.status === "fulfilled") setOrders(o.value.orders ?? []);
      if (a.status === "fulfilled") setAddresses(a.value);
      if (c.status === "fulfilled") setCart(c.value);
      if (r.status === "fulfilled") setReviewed(r.value.map((review) => review.productId));
    });

    return () => {
      cancelled = true;
    };
  }, [isInitialized, isAuthenticated, accessToken]);

  // Ticks only while an unpaid order is counting down.
  const unpaid = orders.find(
    (order) =>
      order.paymentMethod === "bank_upi" &&
      order.paymentStatus === "pending" &&
      order.status !== "cancelled" &&
      order.paymentExpiresAt &&
      new Date(order.paymentExpiresAt).getTime() > now,
  );

  useEffect(() => {
    if (!unpaid) return;

    const timer = window.setInterval(() => setNow(Date.now()), 1000);

    return () => window.clearInterval(timer);
  }, [unpaid]);

  const latestDelivered = orders.find((order) => order.status === "delivered");

  const unreviewed = useMemo(() => {
    for (const order of orders) {
      if (order.status !== "delivered") continue;

      const item = order.items.find((entry) => !reviewed.includes(entry.productId));

      if (item) return item;
    }

    return null;
  }, [orders, reviewed]);

  if (!isInitialized || !isAuthenticated || !profile) {
    return null;
  }

  const { user, customer } = profile;
  const bagCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  /* ---------------------------------------------------------
     NEXT STEPS (most valuable first)
  --------------------------------------------------------- */

  const actions: Action[] = [];

  if (unpaid) {
    actions.push({
      id: "pay",
      icon: Clock3,
      tone: "urgent",
      title: `Complete your payment for #${unpaid.orderNumber}`,
      text: `${countdown(new Date(unpaid.paymentExpiresAt as string).getTime() - now)} left before it is cancelled automatically.`,
      href: `/account/orders/${encodeURIComponent(unpaid.orderNumber)}`,
      cta: "Pay now",
    });
  }

  if (bagCount > 0) {
    actions.push({
      id: "bag",
      icon: ShoppingBag,
      title: `${bagCount} piece${bagCount === 1 ? "" : "s"} waiting in your bag`,
      text: "Finish your order whenever you are ready.",
      href: "/cart",
      cta: "Go to bag",
    });
  }

  if (unreviewed) {
    actions.push({
      id: "review",
      icon: Star,
      title: `How was ${unreviewed.name}?`,
      text: "Your review helps other shoppers choose with confidence.",
      href: `/products/${unreviewed.productId}#reviews`,
      cta: "Write a review",
    });
  }

  if (wishlistCount > 0) {
    actions.push({
      id: "wishlist",
      icon: Heart,
      title: `${wishlistCount} saved piece${wishlistCount === 1 ? "" : "s"}`,
      text: "Add the ones you still love to your bag in one tap.",
      href: "/wishlist",
      cta: "View wishlist",
    });
  }

  if (latestDelivered) {
    actions.push({
      id: "again",
      icon: PackageCheck,
      title: "Loved your last order?",
      text: `Order #${latestDelivered.orderNumber} again in one tap.`,
      custom: (
        <ReorderButton
          items={latestDelivered.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            name: item.name,
          }))}
        />
      ),
    });
  }

  const shownActions = actions.slice(0, 4);

  /* ---------------------------------------------------------
     PROFILE COMPLETENESS (what each step really gives)
  --------------------------------------------------------- */

  const steps = [
    {
      id: "email",
      done: user.emailVerified,
      label: "Verify your email",
      benefit: "Secure account and order emails",
    },
    {
      id: "phone",
      done: Boolean(user.phone),
      label: "Add your phone number",
      benefit: "Your WhatsApp bill and order updates",
      href: "/account/edit",
    },
    {
      id: "address",
      done: addresses.length > 0,
      label: "Save a delivery address",
      benefit: "Faster checkout next time",
      href: "/account/addresses/new",
    },
    {
      id: "dob",
      done: Boolean(customer.dateOfBirth),
      label: "Add your birthday",
      benefit: "Helps us celebrate with you",
      href: "/account/edit",
    },
    {
      id: "offers",
      done: customer.marketingEmails || customer.marketingWhatsapp,
      label: "Choose how to hear about offers",
      benefit: "New arrivals and offers, only if you want them",
    },
  ];

  const doneCount = steps.filter((step) => step.done).length;
  const percent = Math.round((doneCount / steps.length) * 100);
  const todo = steps.filter((step) => !step.done);

  async function optIn(kind: "email" | "whatsapp" | "both") {
    if (!accessToken || savingPrefs) return;

    try {
      setSavingPrefs(true);

      const updated = await updateCustomerProfile(accessToken, {
        ...(kind !== "whatsapp" ? { marketingEmails: true } : {}),
        ...(kind !== "email" ? { marketingWhatsapp: true } : {}),
      });

      setProfile(updated);
      toast.success("Thanks! You can change this any time below.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to save your choice.",
      );
    } finally {
      setSavingPrefs(false);
    }
  }

  return (
    <section className="account-overview" aria-label="Your account at a glance">
      {/* STATS */}

      <ul className="account-overview__stats">
        <li>
          <span>Orders placed</span>
          <strong>{customer.totalOrders}</strong>
        </li>

        <li>
          <span>Total spent</span>
          <strong>{money(customer.totalSpent)}</strong>
        </li>

        <li>
          <span>Saved pieces</span>
          <strong>{wishlistCount}</strong>
        </li>

        <li>
          <span>Member since</span>
          <strong>{new Date(user.createdAt).getFullYear()}</strong>
        </li>
      </ul>

      {/* NEXT STEPS */}

      {shownActions.length > 0 ? (
        <div className="account-overview__block">
          <h2>Your next steps</h2>

          <ul className="account-overview__actions">
            {shownActions.map((action) => {
              const Icon = action.icon;

              return (
                <li
                  key={action.id}
                  className={
                    action.tone === "urgent"
                      ? "account-overview__action account-overview__action--urgent"
                      : "account-overview__action"
                  }
                >
                  <Icon size={18} strokeWidth={1.5} aria-hidden="true" />

                  <div>
                    <p>{action.title}</p>
                    <span>{action.text}</span>
                  </div>

                  {action.custom ? (
                    action.custom
                  ) : action.href ? (
                    <Link href={action.href}>
                      {action.cta} <ArrowRight size={14} />
                    </Link>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}

      {/* PROFILE COMPLETENESS */}

      {todo.length > 0 ? (
        <div className="account-overview__block">
          <div className="account-overview__meter-head">
            <h2>Complete your profile</h2>
            <strong>{percent}%</strong>
          </div>

          <span
            className="account-overview__meter"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={percent}
            aria-label="Profile completeness"
          >
            <span style={{ width: `${percent}%` }} />
          </span>

          <ul className="account-overview__steps">
            {steps.map((step) => (
              <li key={step.id} data-done={step.done}>
                {step.done ? (
                  <CheckCircle2 size={16} strokeWidth={1.6} />
                ) : (
                  <Circle size={16} strokeWidth={1.6} />
                )}

                <div>
                  {!step.done && step.href ? (
                    <Link href={step.href}>{step.label}</Link>
                  ) : (
                    <p>{step.label}</p>
                  )}

                  <span>{step.benefit}</span>
                </div>
              </li>
            ))}
          </ul>

          {!customer.marketingEmails && !customer.marketingWhatsapp ? (
            <div className="account-overview__optin">
              <Bell size={16} strokeWidth={1.5} aria-hidden="true" />

              <p>Want first word on new pieces and offers? Choose how.</p>

              <div>
                <button type="button" disabled={savingPrefs} onClick={() => void optIn("email")}>
                  Email me
                </button>

                <button type="button" disabled={savingPrefs} onClick={() => void optIn("whatsapp")}>
                  WhatsApp me
                </button>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
