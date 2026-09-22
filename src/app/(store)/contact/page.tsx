import { ContentPage } from "@/components/content/content-page";
import { siteConfig } from "@/config/site";

import type { Metadata } from "next";
import "./ContactPage.css";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Aayesha Fashion for product, order, shipping, returns, and general enquiries.",
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
  return (
    <>
      <ContentPage
        eyebrow="Customer Care"
        title="Contact Us"
        description="Whether you need help with an order, sizing, delivery, returns or finding the right piece, our customer care team is here to assist."
        highlights={[
          {
            label: "Order support",
            value: "Keep your order number ready",
          },
          {
            label: "Product help",
            value: "Ask us about sizing and details",
          },
          {
            label: "General enquiries",
            value: "We're happy to guide you",
          },
        ]}
        sections={[
          {
            title: "A considered customer experience",
            paragraphs: [
              "Good service begins with clear information. We aim to make every stage of your shopping experience easy to understand, from product discovery and checkout through dispatch, delivery and after-sales support.",
              "When contacting us, sharing your order number, registered email address and a clear description of your question helps us respond more efficiently.",
            ],
          },
          {
            title: "Order enquiries",
            paragraphs: [
              "For questions about order confirmation, dispatch, tracking, delivery status, product availability or an issue with an order, please contact customer care with the relevant order details.",
            ],
          },
          {
            title: "Product and sizing assistance",
            paragraphs: [
              "Before placing an order, you may contact us about product measurements, fit, styling or general product information. Where a product-specific size chart is available, we recommend checking those measurements before ordering.",
            ],
          },
          {
            title: "Returns and exchanges",
            paragraphs: [
              "For return or exchange assistance, please review the relevant policy first and contact customer care with your order number and request details. Our team will guide you through the applicable process.",
            ],
          },
        ]}
      />

      <section className="contact-page__care">
  <div className="contact-page__care-container">
    <div className="contact-page__care-intro">
      <div className="contact-page__care-eyebrow-row">
        <span className="contact-page__care-line" />

        <p className="contact-page__care-eyebrow">
          Customer Care
        </p>
      </div>

      <h2 className="contact-page__care-title">
        We&apos;re here to help.
      </h2>

      <p className="contact-page__care-description">
        Have a question about an order, product or delivery?
        Reach our customer care team directly.
      </p>
    </div>

    <div className="contact-page__care-grid">
      {siteConfig.contact.phone && (
        <a
          href={`tel:+${siteConfig.contact.phone}`}
          className="contact-page__care-card"
        >
          <div className="contact-page__care-card-top">
            <span className="contact-page__care-index">
              01
            </span>

            <span className="contact-page__care-action">
              Call
            </span>
          </div>

          <div className="contact-page__care-card-body">
            <p className="contact-page__care-label">
              Phone
            </p>

            <p className="contact-page__care-value">
              +{siteConfig.contact.phone}
            </p>

            <span className="contact-page__care-link">
              Call customer care
              <span aria-hidden="true">↗</span>
            </span>
          </div>
        </a>
      )}

      {siteConfig.contact.email && (
        <a
          href={`mailto:${siteConfig.contact.email}`}
          className="contact-page__care-card"
        >
          <div className="contact-page__care-card-top">
            <span className="contact-page__care-index">
              02
            </span>

            <span className="contact-page__care-action">
              Email
            </span>
          </div>

          <div className="contact-page__care-card-body">
            <p className="contact-page__care-label">
              Email
            </p>

            <p className="contact-page__care-value contact-page__care-value--email">
              {siteConfig.contact.email}
            </p>

            <span className="contact-page__care-link">
              Send an enquiry
              <span aria-hidden="true">↗</span>
            </span>
          </div>
        </a>
      )}
    </div>

    <div className="contact-page__care-note">
      <span className="contact-page__care-note-mark" />

      <p>
        For order-related enquiries, please keep your
        order number and registered email address ready.
      </p>
    </div>
  </div>
</section>
    </>
  );
}