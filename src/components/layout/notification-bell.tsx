"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Bell } from "lucide-react";

import { getUnreadNotificationCount } from "@/lib/api/notifications";
import { useAuthStore } from "@/store/auth-store";

export const NOTIFICATIONS_CHANGED_EVENT = "aayesha:notifications-changed";

const POLL_INTERVAL_MS = 60_000;

/** Bell with unread badge; renders only for signed-in customers. */
export function NotificationBell({
  onNavigate,
}: {
  onNavigate?: () => void;
}) {
  const accessToken = useAuthStore((s) => s.accessToken);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isInitialized = useAuthStore((s) => s.isInitialized);

  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInitialized || !isAuthenticated || !accessToken) {
      return;
    }

    let cancelled = false;

    const refresh = () => {
      getUnreadNotificationCount(accessToken)
        .then((result) => {
          if (!cancelled) setCount(result.count);
        })
        .catch(() => {
          /* keep the last known count */
        });
    };

    refresh();

    const timer = window.setInterval(refresh, POLL_INTERVAL_MS);
    const onVisible = () => {
      if (document.visibilityState === "visible") refresh();
    };

    window.addEventListener(NOTIFICATIONS_CHANGED_EVENT, refresh);
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      cancelled = true;
      window.clearInterval(timer);
      window.removeEventListener(NOTIFICATIONS_CHANGED_EVENT, refresh);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [isInitialized, isAuthenticated, accessToken]);

  if (!isInitialized || !isAuthenticated) {
    return null;
  }

  const visibleCount = accessToken ? count : 0;

  return (
    <Link
      href="/account/notifications"
      aria-label={
        visibleCount > 0
          ? `Notifications, ${visibleCount} unread`
          : "Notifications"
      }
      onClick={onNavigate}
      className="header-action-link header-action--notifications"
    >
      <span className="header-action-link__icon">
        <Bell size={20} strokeWidth={1.6} />
      </span>

      {visibleCount > 0 ? (
        <span className="notification-count">
          {visibleCount > 99 ? "99+" : visibleCount}
        </span>
      ) : null}

      <span aria-hidden="true" className="header-action-link__underline" />
    </Link>
  );
}
