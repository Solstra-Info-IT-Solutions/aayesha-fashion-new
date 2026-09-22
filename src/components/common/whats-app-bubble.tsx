"use client";

import { MessageCircle } from "lucide-react";

import "./WhatsAppBubble.css";

const WHATSAPP_NUMBER = "919999999999";

const WHATSAPP_MESSAGE =
  "Hello Aayesha Fashion, I need help with a product.";

export function WhatsAppBubble() {
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    WHATSAPP_MESSAGE,
  )}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Aayesha Fashion on WhatsApp"
      className="whatsapp-bubble"
    >
      <span className="whatsapp-bubble__label">
        Need Help?
      </span>

      <span
        aria-hidden="true"
        className="whatsapp-bubble__icon"
      >
        <MessageCircle
          size={20}
          strokeWidth={1.7}
        />
      </span>
    </a>
  );
}