import { ArrowRight, Truck } from "lucide-react";

export function AnnouncementBar() {
  return (
    <div
      className="
        relative
        z-[var(--z-header)]
        overflow-hidden
        border-b
        border-white/[0.08]
        bg-[var(--color-charcoal)]
        text-white
      "
    >
      {/* Ambient light */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          left-1/2
          top-1/2
          h-16
          w-64
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-[var(--color-champagne)]
          opacity-[0.08]
          blur-[50px]
        "
      />

      {/* Subtle side glow */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          left-0
          top-0
          h-full
          w-32
          bg-gradient-to-r
          from-[var(--color-champagne)]/[0.04]
          to-transparent
        "
      />

      <div
        className="
          container-premium
          relative
          flex
          min-h-10
          items-center
          justify-center
          gap-3
          px-4
          py-2
          text-center
          sm:min-h-11
          sm:gap-3.5
          sm:px-6
        "
      >
        {/* Truck icon */}
        <span
          aria-hidden="true"
          className="
            flex
            h-6
            w-6
            shrink-0
            items-center
            justify-center
            rounded-full
            border
            border-[var(--color-champagne)]/25
            bg-white/[0.04]
            text-[var(--color-champagne)]
            transition-all
            duration-500
            hover:border-[var(--color-champagne)]/50
            hover:bg-[var(--color-champagne)]/[0.08]
            hover:scale-105
          "
        >
          <Truck
            size={13}
            strokeWidth={1.35}
          />
        </span>

        {/* Message */}
        <p
          className="
            font-body
            text-[10px]
            font-medium
            uppercase
            leading-none
            tracking-[0.12em]
            text-white/90
            sm:text-[10.5px]
            sm:tracking-[0.15em]
            md:text-[11px]
            md:tracking-[0.17em]
          "
        >
          Complimentary shipping on orders above ₹2,999
        </p>

        {/* Arrow */}
        <span
          aria-hidden="true"
          className="
            flex
            shrink-0
            items-center
            justify-center
            text-[var(--color-champagne)]
            opacity-80
            transition-transform
            duration-500
            hover:translate-x-1
          "
        >
          <ArrowRight
            size={14}
            strokeWidth={1.25}
          />
        </span>
      </div>

      {/* Luxury accent line */}
      <span
        aria-hidden="true"
        className="
          absolute
          bottom-0
          left-1/2
          h-px
          w-20
          -translate-x-1/2
          bg-gradient-to-r
          from-transparent
          via-[var(--color-champagne)]
          to-transparent
          opacity-70
        "
      />
    </div>
  );
}