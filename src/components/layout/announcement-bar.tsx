import {
  ArrowRight,
  Truck,
} from "lucide-react";

export function AnnouncementBar() {
  return (
    <div
      className="
        relative
        z-[var(--z-header)]
        overflow-hidden
        border-b
        border-white/10
        bg-[var(--color-charcoal)]
        text-white
      "
    >
      {/* =====================================================
          AMBIENT LIGHT
      ===================================================== */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          left-1/2
          top-1/2
          h-20
          w-56
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-[var(--color-accent)]
          opacity-[0.08]
          blur-[45px]
        "
      />

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div
        className="
          container-premium
          relative
          flex
          min-h-9
          items-center
          justify-center
          gap-2.5
          py-2
          text-center
          sm:min-h-10
          sm:gap-3
        "
      >
        {/* Shipping icon */}

        <span
          className="
            flex
            h-5
            w-5
            shrink-0
            items-center
            justify-center
            rounded-full
            border
            border-white/15
            bg-white/[0.04]
            text-[var(--color-accent-soft)]
            transition-transform
            duration-500
            hover:scale-110
          "
        >
          <Truck
            size={12}
            strokeWidth={1.5}
            aria-hidden="true"
          />
        </span>

        {/* Message */}

        <p
          className="
            font-body
            text-[8px]
            font-medium
            uppercase
            leading-none
            tracking-[0.14em]
            text-white/75
            sm:text-[9px]
            sm:tracking-[0.18em]
            md:text-[10px]
          "
        >
          Complimentary shipping on orders above ₹2,999
        </p>

        {/* Decorative arrow */}

        <ArrowRight
          size={12}
          strokeWidth={1.2}
          aria-hidden="true"
          className="
            shrink-0
            text-[var(--color-accent-soft)]
            opacity-70
            transition-transform
            duration-500
            hover:translate-x-1
          "
        />
      </div>

      {/* =====================================================
          BOTTOM ACCENT LINE
      ===================================================== */}

      <span
        aria-hidden="true"
        className="
          absolute
          bottom-0
          left-1/2
          h-px
          w-16
          -translate-x-1/2
          bg-[var(--color-accent)]
          opacity-60
        "
      />
    </div>
  );
}