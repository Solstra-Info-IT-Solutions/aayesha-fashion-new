import Link from "next/link";

const navigation = [
  {
    label: "New Arrivals",
    href: "/collections/new-arrivals",
  },
  {
    label: "Shop",
    href: "/shop",
  },
  {
    label: "Collections",
    href: "/collections",
  },
  {
    label: "Best Sellers",
    href: "/collections/best-sellers",
  },
];

export function DesktopNavigation() {
  return (
    <nav
      aria-label="Primary navigation"
      className="desktop-navigation"
    >
      {navigation.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="desktop-navigation__link"
        >
          <span className="desktop-navigation__label">
            {item.label}

            <span
              aria-hidden="true"
              className="desktop-navigation__underline"
            />

            <span
              aria-hidden="true"
              className="desktop-navigation__underline-accent"
            />
          </span>
        </Link>
      ))}
    </nav>
  );
} 