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
    "tracking-[0.14em]",
    "transition-[background-color,border-color,color,opacity]",
    "duration-200",
    "focus-visible:outline-none",
    "focus-visible:ring-2",
    "focus-visible:ring-[#b79a6a]",
    "focus-visible:ring-offset-2",
    "focus-visible:ring-offset-[#111111]",
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
          "border-[#b79a6a]",
          "bg-[#b79a6a]",
          "text-[#111111]",

          "hover:border-[#c8ad7f]",
          "hover:bg-[#c8ad7f]",
          "hover:text-[#111111]",

          "active:border-[#a38756]",
          "active:bg-[#a38756]",
          "active:text-[#111111]",

          "disabled:border-[#b79a6a]",
          "disabled:bg-[#b79a6a]",
          "disabled:text-[#111111]",
          "disabled:opacity-60",
        ],

        /* =================================================
           SECONDARY
        ================================================= */

        secondary: [
          "border",
          "border-[#4a443d]",
          "bg-transparent",
          "text-[#f8f3f1]",

          "hover:border-[#b79a6a]",
          "hover:bg-[#b79a6a]",
          "hover:text-[#111111]",

          "active:bg-[#a38756]",
          "active:border-[#a38756]",
          "active:text-[#111111]",

          "disabled:opacity-60",
        ],

        /* =================================================
           ROSE
        ================================================= */

        rose: [
          "border",
          "border-[#b79a6a]",
          "bg-[#b79a6a]",
          "text-[#111111]",

          "hover:border-[#a58859]",
          "hover:bg-[#a58859]",
          "hover:text-[#111111]",

          "active:border-[#8a7142]",
          "active:bg-[#8a7142]",
          "active:text-[#111111]",

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

          "hover:border-[#b79a6a]",
          "hover:bg-[#b79a6a]",
          "hover:text-[#111111]",

          "active:border-[#b79a6a]",
          "active:bg-[#b79a6a]",
          "active:text-[#111111]",

          "disabled:opacity-60",
        ],
      },

      size: {
        sm: "min-h-10 px-4 text-[10px]",
        md: "min-h-11 px-5 text-[10px]",
        lg: "min-h-12 px-7 text-[11px]",
        xl: "min-h-[50px] px-8 text-[11px]",
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