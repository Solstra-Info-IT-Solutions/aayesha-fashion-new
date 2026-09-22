import { cn } from "@/lib/utils";

import "./SectionHeading.css";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "section-heading",
        align === "center" &&
          "section-heading--center",
        className,
      )}
    >
      {eyebrow && (
        <p className="section-heading__eyebrow">
          {eyebrow}
        </p>
      )}

      <h2 className="section-heading__title">
        {title}
      </h2>

      {description && (
        <p className="section-heading__description">
          {description}
        </p>
      )}
    </div>
  );
}