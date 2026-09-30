import type { ReactNode } from "react";

import "./StatusPage.css";

interface StatusPageProps {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
}

/*
 * Presentation only. Used by the 404 and error boundaries so
 * unexpected failures look like the rest of the storefront
 * instead of the framework's default page.
 */
export function StatusPage({
  eyebrow,
  title,
  description,
  children,
}: StatusPageProps) {
  return (
    <main className="status-page">
      <div className="status-page__inner">
        <p className="status-page__eyebrow">
          {eyebrow}
        </p>

        <h1 className="status-page__title">
          {title}
        </h1>

        <p className="status-page__description">
          {description}
        </p>

        {children ? (
          <div className="status-page__actions">
            {children}
          </div>
        ) : null}
      </div>
    </main>
  );
}
