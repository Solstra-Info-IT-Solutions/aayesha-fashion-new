/* =========================================================
   CONTENT PAGE GROUPS
   Drives the page switcher shown at the top of every policy
   and information page.
========================================================= */

export type ContentGroup = "policies" | "information";

export interface ContentPageLink {
  label: string;
  href: string;
}

export const contentGroups: Record<
  ContentGroup,
  { label: string; links: ContentPageLink[] }
> = {
  policies: {
    label: "Policies",
    links: [
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms & Conditions", href: "/terms" },
      { label: "Shipping Policy", href: "/shipping-policy" },
      { label: "Refund Policy", href: "/refund-policy" },
    ],
  },
  information: {
    label: "Information",
    links: [
      { label: "Our Story", href: "/our-story" },
      { label: "Shipping & Delivery", href: "/shipping" },
      { label: "Returns & Exchange", href: "/returns" },
      { label: "Contact Us", href: "/contact" },
    ],
  },
};
