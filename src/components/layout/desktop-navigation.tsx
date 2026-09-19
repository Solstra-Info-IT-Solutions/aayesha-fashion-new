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
        gap-6
        xl:gap-8
      "
    >
      {navigation.map((item, index) => (
        <Link
          key={item.href}
          href={item.href}
          className="
            group
            relative
            flex
            items-center
            gap-2
            whitespace-nowrap
            py-3
            font-body
            text-[10px]
            font-medium
            uppercase
            tracking-[0.16em]
            text-[var(--color-text)]
            transition-all
            duration-500
            ease-[var(--ease-luxury)]
            hover:-translate-y-px
            hover:text-[var(--color-accent-dark)]
            xl:text-[10.5px]
          "
        >
          {/* Editorial index */}
          <span
            aria-hidden="true"
            className="
              font-body
              text-[7px]
              font-medium
              tracking-[0.08em]
              text-[var(--color-text-muted)]
              opacity-50
              transition-all
              duration-500
              ease-[var(--ease-luxury)]
              group-hover:-translate-y-0.5
              group-hover:text-[var(--color-accent)]
              group-hover:opacity-100
            "
          >
            0{index + 1}
          </span>

          {/* Navigation label */}
          <span
            className="
              relative
              inline-block
              transition-all
              duration-500
              ease-[var(--ease-luxury)]
              group-hover:tracking-[0.19em]
            "
          >
            {item.label}

            {/* Primary underline */}
            <span
              aria-hidden="true"
              className="
                absolute
                -bottom-1.5
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

            {/* Highlight line */}
            <span
              aria-hidden="true"
              className="
                absolute
                -bottom-1.5
                left-0
                h-px
                w-1/3
                origin-left
                scale-x-0
                bg-[var(--color-text)]
                opacity-50
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