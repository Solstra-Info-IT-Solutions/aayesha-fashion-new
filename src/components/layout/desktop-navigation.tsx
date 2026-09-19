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
      className="
        flex
        items-center
        gap-7
        xl:gap-10
        2xl:gap-12
      "
    >
      {navigation.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="
            group
            relative
            inline-flex
            items-center
            whitespace-nowrap
            py-3
            font-body
            text-[13px]
            font-medium
            tracking-[0.045em]
            text-[var(--color-text)]
            transition-all
            duration-300
            ease-[var(--ease-luxury)]
            hover:text-[var(--color-accent-dark)]
            xl:text-[14px]
          "
        >
          <span className="relative">
            {item.label}

            {/* Main underline */}
            <span
              aria-hidden="true"
              className="
                absolute
                -bottom-2
                left-0
                h-px
                w-full
                origin-right
                scale-x-0
                bg-[var(--color-accent)]
                transition-transform
                duration-500
                ease-[var(--ease-luxury)]
                group-hover:origin-left
                group-hover:scale-x-100
              "
            />

            {/* Secondary underline accent */}
            <span
              aria-hidden="true"
              className="
                absolute
                -bottom-2
                left-0
                h-px
                w-5
                origin-left
                scale-x-0
                bg-[var(--color-text)]
                transition-transform
                delay-100
                duration-500
                ease-[var(--ease-luxury)]
                group-hover:scale-x-100
              "
            />
          </span>
        </Link>
      ))}
    </nav>
  );
}