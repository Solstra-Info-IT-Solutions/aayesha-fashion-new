"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  type CustomerNotification,
} from "@/lib/api/notifications";
import { useAuthStore } from "@/store/auth-store";

import "./AccountNotifications.css";

const formatTime = (value: string) =>
  new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));

export function AccountNotifications() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const isInitialized = useAuthStore((s) => s.isInitialized);

  const [items, setItems] = useState<CustomerNotification[] | null>(null);
  const [unread, setUnread] = useState(0);
  const [failed, setFailed] = useState(false);

  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!accessToken) return;

    let cancelled = false;

    getNotifications(accessToken)
      .then((result) => {
        if (cancelled) return;
        setItems(result.items);
        setUnread(result.unreadCount);
        setFailed(false);
      })
      .catch((error) => {
        console.error("Load notifications error:", error);
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
    };
  }, [accessToken, reloadKey]);

  async function open(item: CustomerNotification) {
    if (!accessToken || item.readAt) return;

    try {
      await markNotificationRead(item._id, accessToken);
      setItems((current) =>
        current
          ? current.map((n) =>
              n._id === item._id ? { ...n, readAt: new Date().toISOString() } : n,
            )
          : current,
      );
      setUnread((count) => Math.max(0, count - 1));
    } catch {
      /* non-blocking */
    }
  }

  async function readAll() {
    if (!accessToken) return;

    try {
      await markAllNotificationsRead(accessToken);
      setReloadKey((key) => key + 1);
    } catch {
      toast.error("Unable to mark notifications as read.");
    }
  }

  return (
    <div className="account-notifications">
      <p className="account-notifications__eyebrow">My Account</p>

      <div className="account-notifications__head">
        <h1 className="account-notifications__title">Notifications</h1>

        {unread > 0 ? (
          <button type="button" onClick={() => void readAll()}>
            Mark all as read ({unread})
          </button>
        ) : null}
      </div>

      {!isInitialized || (items === null && !failed) ? (
        <p className="account-notifications__muted">Loading…</p>
      ) : failed ? (
        <p className="account-notifications__muted">
          We could not load your notifications. Please try again.
        </p>
      ) : items && items.length === 0 ? (
        <p className="account-notifications__muted">
          You are all caught up. Order, payment and review updates will appear
          here.
        </p>
      ) : (
        <ul className="account-notifications__list">
          {items?.map((item) => {
            const content = (
              <>
                <span
                  className={
                    item.readAt
                      ? "account-notifications__dot"
                      : "account-notifications__dot account-notifications__dot--unread"
                  }
                  aria-hidden="true"
                />

                <span className="account-notifications__body">
                  <strong>{item.title}</strong>
                  <span>{item.message}</span>
                  <small>{formatTime(item.createdAt)}</small>
                </span>
              </>
            );

            return (
              <li key={item._id}>
                {item.actionUrl ? (
                  <Link
                    href={item.actionUrl}
                    onClick={() => void open(item)}
                    className="account-notifications__item"
                  >
                    {content}
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => void open(item)}
                    className="account-notifications__item"
                  >
                    {content}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
