import { RotateCcw, ShieldCheck, Smartphone, Truck } from "lucide-react";

import { Container } from "@/components/shared/container";

import "./HomeSales.css";

/** Standing store promises, shown right under the hero. */
const items = [
  {
    icon: Truck,
    title: "Free shipping",
    text: "On orders above ₹2,999",
  },
  {
    icon: Smartphone,
    title: "Pay by UPI",
    text: "Bill sent to your WhatsApp",
  },
  {
    icon: RotateCcw,
    title: "Easy returns",
    text: "On eligible orders",
  },
  {
    icon: ShieldCheck,
    title: "Delivered across India",
    text: "Packed with care",
  },
] as const;

export function HomeTrustStrip() {
  return (
    <section className="home-trust" aria-label="Why shop with us">
      <Container>
        <ul className="home-trust__list">
          {items.map((item) => {
            const Icon = item.icon;

            return (
              <li key={item.title}>
                <Icon size={20} strokeWidth={1.4} aria-hidden="true" />

                <div>
                  <p>{item.title}</p>
                  <span>{item.text}</span>
                </div>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
