import Link from "next/link";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/* =========================================================
   AAYESHA — BUTTON SYSTEM
========================================================= */

const buttonVariants = cva(
  [
    "group",
    "inline-flex",
    "items-center",
    "justify-center",
    "gap-3",
    "whitespace-nowrap",
    "font-sans",
    "font-semibold",
    "uppercase",
    "tracking-[0.16em]",
    "transition-all",
    "duration-300",
    "focus-visible:outline-none",
    "focus-visible:ring-2",
    "focus-visible:ring-[#9b7069]",
    "focus-visible:ring-offset-2",
    "disabled:pointer-events-none",
  ],
  {
    variants: {
      variant: {
        /* =================================================
           PRIMARY
        ================================================= */

        primary: [
          "border",
          "border-[#6f4b47]",
          "bg-[#6f4b47]",
          "text-white",

          "hover:border-[#3f2d2a]",
          "hover:bg-[#3f2d2a]",
          "hover:text-white",

          "active:border-[#7f5953]",
          "active:bg-[#7f5953]",
          "active:text-white",

          "disabled:border-[#6f4b47]",
          "disabled:bg-[#6f4b47]",
          "disabled:text-white",
          "disabled:opacity-60",
        ],

        /* =================================================
           SECONDARY
        ================================================= */

        secondary: [
          "border",
          "border-[#6f4b47]",
          "bg-transparent",
          "text-[#6f4b47]",

          "hover:border-[#6f4b47]",
          "hover:bg-[#6f4b47]",
          "hover:text-white",

          "active:bg-[#7f5953]",
          "active:border-[#7f5953]",
          "active:text-white",

          "disabled:opacity-60",
        ],

        /* =================================================
           ROSE
        ================================================= */

        rose: [
          "border",
          "border-[#b98279]",
          "bg-[#b98279]",
          "text-white",

          "hover:border-[#95645e]",
          "hover:bg-[#95645e]",
          "hover:text-white",

          "active:border-[#7f5953]",
          "active:bg-[#7f5953]",
          "active:text-white",

          "disabled:opacity-60",
        ],

        /* =================================================
           DARK OUTLINE
        ================================================= */

        darkOutline: [
          "border",
          "border-white/45",
          "bg-transparent",
          "text-white",

          "hover:border-white",
          "hover:bg-white",
          "hover:text-[#3f2d2a]",

          "active:border-white",
          "active:bg-white",
          "active:text-[#3f2d2a]",

          "disabled:opacity-60",
        ],
      },

      size: {
        sm: "min-h-10 px-4 text-[8px]",
        md: "min-h-12 px-5 text-[9px]",
        lg: "min-h-14 px-7 text-[9px]",
        xl: "min-h-16 px-8 text-[10px]",
      },

      rounded: {
        none: "rounded-none",
        soft: "rounded-sm",
        pill: "rounded-full",
      },
    },

    defaultVariants: {
      variant: "primary",
      size: "md",
      rounded: "none",
    },
  }
);

/* =========================================================
   TYPES
========================================================= */

type BaseProps = {
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
};

type ButtonProps = BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

type LinkButtonProps = BaseProps &
  AnchorHTMLAttributes<HTMLAnchorElement> &
  VariantProps<typeof buttonVariants> & {
    href: string;
  };

/* =========================================================
   BUTTON
========================================================= */

export function Button({
  children,
  className,
  variant,
  size,
  rounded,
  icon,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        buttonVariants({
          variant,
          size,
          rounded,
        }),
        className,
      )}
      {...props}
    >
      <span>{children}</span>

      {icon ? (
        <span className="transition-transform duration-300 group-hover:translate-x-0.5">
          {icon}
        </span>
      ) : null}
    </button>
  );
}

/* =========================================================
   LINK BUTTON
========================================================= */

export function LinkButton({
  href,
  children,
  className,
  variant,
  size,
  rounded,
  icon,
  ...props
}: LinkButtonProps) {
  return (
    <Link
      href={href}
      className={cn(
        buttonVariants({
          variant,
          size,
          rounded,
        }),
        className,
      )}
      {...props}
    >
      <span>{children}</span>

      {icon ? (
        <span className="transition-transform duration-300 group-hover:translate-x-0.5">
          {icon}
        </span>
      ) : null}
    </Link>
  );
}

/* =========================================================
   EXPORT
========================================================= */

export { buttonVariants };