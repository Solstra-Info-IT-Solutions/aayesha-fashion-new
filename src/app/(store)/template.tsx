import "./page-transition.css";

/**
 * Re-mounts on every navigation, giving each page a short fade-in
 * instead of a hard cut. Opacity only (no transform) so it never
 * creates a containing block for fixed-position descendants.
 */
export default function StoreTemplate({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="page-enter">{children}</div>;
}
