import {
  ShieldCheck,
  Sparkles,
  Truck,
  RotateCcw,
} from "lucide-react";

const trustItems = [
  {
    icon: Truck,
    title: "Reliable Delivery",
    text: "Secure delivery across India",
  },
  {
    icon: RotateCcw,
    title: "Easy Exchange",
    text: "Simple support for eligible orders",
  },
  {
    icon: ShieldCheck,
    title: "Secure Shopping",
    text: "Protected checkout experience",
  },
  {
    icon: Sparkles,
    title: "Curated Quality",
    text: "Thoughtfully selected designs",
  },
];

export function ProductTrustBadges() {
  return (
    <section
      aria-label="Shopping assurances"
      className="product-trust"
    >
      {trustItems.map((item, index) => {
        const Icon = item.icon;

        return (
          <div
            key={item.title}
            className={[
              "product-trust__item",
              index % 2 === 0
                ? "product-trust__item--right-border"
                : "",
              index < 2
                ? "product-trust__item--bottom-border"
                : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <span
              aria-hidden="true"
              className="product-trust__icon"
            >
              <Icon
                size={17}
                strokeWidth={1.5}
              />
            </span>

            <div className="product-trust__content">
              <p className="product-trust__title">
                {item.title}
              </p>

              <p className="product-trust__text">
                {item.text}
              </p>
            </div>
          </div>
        );
      })}
    </section>
  );
}