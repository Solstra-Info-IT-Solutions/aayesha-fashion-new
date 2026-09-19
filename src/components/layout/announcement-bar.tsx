import { ArrowRight, Truck } from "lucide-react";

export function AnnouncementBar() {
  return (
    <div className="announcement-bar">
      {/* Ambient light */}
      <div
        aria-hidden="true"
        className="announcement-bar__glow"
      />

      {/* Side glow */}
      <div
        aria-hidden="true"
        className="announcement-bar__side-glow"
      />

      <div className="announcement-bar__container">
        {/* Truck icon */}
        <span
          aria-hidden="true"
          className="announcement-bar__icon"
        >
          <Truck
            size={13}
            strokeWidth={1.35}
          />
        </span>

        {/* Message */}
        <p className="announcement-bar__text">
          Complimentary shipping on orders above ₹2,999
        </p>

        {/* Arrow */}
        <span
          aria-hidden="true"
          className="announcement-bar__arrow"
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
        className="announcement-bar__accent"
      />
    </div>
  );
}