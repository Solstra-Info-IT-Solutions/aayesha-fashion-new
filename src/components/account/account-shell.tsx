"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import {
  Gift,
  Heart,
  LogOut,
  MapPin,
  ShoppingBag,
  User,
  UserCog,
} from "lucide-react";

import { useAuthStore } from "@/store/auth-store";

import "./AccountShell.css";

const navigation = [
  { label: "Profile", href: "/account", icon: User, exact: true },
  { label: "Orders", href: "/account/orders", icon: ShoppingBag },
  { label: "Addresses", href: "/account/addresses", icon: MapPin },
  { label: "Coupons", href: "/account/coupons", icon: Gift },
  { label: "Wishlist", href: "/wishlist", icon: Heart },
  { label: "Edit account", href: "/account/edit", icon: UserCog },
] as const;

function isActive(
  pathname: string,
  href: string,
  exact?: boolean,
) {
  return exact
    ? pathname === href
    : pathname === href || pathname.startsWith(`${href}/`);
}

export function AccountShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const [signingOut, setSigningOut] = useState(false);

  const initials =
    user?.name
      ?.trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("") || "A";

  const handleLogout = async () => {
    if (signingOut) {
      return;
    }

    setSigningOut(true);

    try {
      await logout();

      toast.success("You have been signed out.");

      router.push("/");
      router.refresh();
    } catch {
      toast.error("Unable to sign out. Please try again.");
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <div className="account-shell">
      <div className="account-shell__container">
        {/* Sidebar on desktop, tab bar on phones */}

        <aside className="account-shell__side">
          <div className="account-shell__me">
            <span
              className="account-shell__avatar"
              aria-hidden="true"
            >
              {initials}
            </span>

            <div className="account-shell__identity">
              <p className="account-shell__eyebrow">My account</p>

              <p className="account-shell__name">
                {user?.name ?? "Welcome"}
              </p>

              {user?.email ? (
                <p className="account-shell__email">
                  {user.email}
                </p>
              ) : null}
            </div>
          </div>

          <nav
            aria-label="Account"
            className="account-shell__nav"
          >
            {navigation.map((item) => {
              const Icon = item.icon;

              const active = isActive(
                pathname,
                item.href,
                "exact" in item ? item.exact : false,
              );

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className="account-shell__link"
                >
                  <Icon
                    size={17}
                    strokeWidth={1.6}
                    aria-hidden="true"
                  />

                  {item.label}
                </Link>
              );
            })}

            <button
              type="button"
              onClick={() => void handleLogout()}
              disabled={signingOut}
              className="account-shell__link account-shell__link--signout"
            >
              <LogOut
                size={17}
                strokeWidth={1.6}
                aria-hidden="true"
              />

              {signingOut ? "Signing out…" : "Sign out"}
            </button>
          </nav>
        </aside>

        <section className="account-shell__content">
          {children}
        </section>
      </div>
    </div>
  );
}
