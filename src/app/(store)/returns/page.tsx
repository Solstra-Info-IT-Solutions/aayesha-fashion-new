import type { Metadata } from "next";

import { ContentPage } from "@/components/content/content-page";

export const metadata: Metadata = {
  title: "Returns & Exchange | Aayesha Fashion",
  description:
    "Explore Aayesha Fashion's detailed returns and exchange process, including eligibility, product condition, packaging, exchange requests, quality assessment and customer-care support.",
  alternates: {
    canonical: "/returns",
  },
};

export default function ReturnsPage() {
  return (
    <ContentPage
      eyebrow="Customer Care · Returns"
      title="Returns & Exchange"
      description="We want every Aayesha Fashion purchase to feel considered from discovery to delivery. This guide explains how returns and exchanges work, what condition a product should be in, how to raise a request, what happens after we receive a returned item and the information you may need throughout the process."
      updatedAt="September 2026"
      highlights={[
        {
          label: "Eligibility",
          value:
            "Returns and exchanges are subject to the applicable product and order conditions",
        },
        {
          label: "Condition",
          value:
            "Products should remain unused, unworn, unwashed and unaltered",
        },
        {
          label: "Packaging",
          value:
            "Original tags, packaging and applicable components should be retained",
        },
        {
          label: "Support",
          value:
            "Customer care can guide you through the applicable request process",
        },
      ]}
      sections={[
        /* =====================================================
           01
        ===================================================== */

        {
          title: "1. About our Returns & Exchange process",
          paragraphs: [
            "At Aayesha Fashion, we understand that shopping for clothing online can involve questions about fit, styling, product expectations and the way a garment feels once it arrives.",
            "Our returns and exchange process is designed to provide a clear path for customers who need assistance after receiving an order.",
            "A return or exchange is subject to the conditions applicable to the relevant product and order. Eligibility may depend on product category, product condition, timing of the request, availability and other circumstances connected with the transaction.",
            "Please review this page before sending any product back. If you are unsure whether your order qualifies, contacting customer care before dispatching the product can help avoid unnecessary delays.",
          ],
        },

        /* =====================================================
           02
        ===================================================== */

        {
          title: "2. Before requesting a return or exchange",
          paragraphs: [
            "Before initiating a request, please check the product and order information available to you and make sure the item remains in the condition required for a return or exchange.",
            "The product should generally remain unused, unworn, unwashed and unaltered unless the issue being reported specifically concerns a defect, incorrect item or another circumstance covered by the applicable policy.",
            "Please also retain the original tags, labels, packaging and other applicable components associated with the product.",
            "If you have identified a problem with the product, please avoid washing, altering, repairing or otherwise modifying the item before contacting customer care, as doing so may affect the assessment of the request.",
          ],
        },

        /* =====================================================
           03
        ===================================================== */

        {
          title: "3. Who can request a return or exchange",
          paragraphs: [
            "A return or exchange request should normally be raised by the customer associated with the relevant order or by a person authorised to act on the customer's behalf.",
            "We may request information necessary to verify the order before providing instructions or processing a request.",
            "This may include the order number, registered email address, mobile number, product information or other transaction-related details.",
            "Verification helps us protect customers and ensures that return, exchange and refund information is provided only to the appropriate person.",
          ],
        },

        /* =====================================================
           04
        ===================================================== */

        {
          title: "4. How to initiate a return request",
          paragraphs: [
            "To request a return, contact Aayesha Fashion through the customer-care channels published on the website and provide your order number together with the relevant product details.",
            "Please clearly explain the reason for your request. If the request relates to damage, a wrong product, a product issue or another condition that may not be immediately visible from the order information, photographs may be requested.",
            "Our customer-care team may review the request and provide the next steps based on the applicable return conditions.",
            "Please wait for the relevant return instructions before sending a product back if the process requires prior approval or specific handling.",
          ],
        },

        /* =====================================================
           05
        ===================================================== */

        {
          title: "5. Information that may be required",
          paragraphs: [
            "Providing complete information at the beginning of a request can help the customer-care team review it more efficiently.",
            "Depending on the situation, you may be asked for your order number, registered contact information, product name, description of the issue, photographs of the product, photographs of packaging or other information relevant to the request.",
            "For a size or exchange-related request, information about the requested replacement may also be required.",
            "Additional information may be requested if the initial details are not sufficient to determine the applicable next step.",
          ],
        },

        /* =====================================================
           06
        ===================================================== */

        {
          title: "6. Product condition requirements",
          paragraphs: [
            "Fashion products can be affected by wear, washing, fragrance, makeup, alterations and other forms of handling. For this reason, product condition is an important part of the return and exchange assessment.",
            "Unless the applicable policy provides otherwise, products should remain unused, unworn, unwashed and unaltered.",
            "The product should not have been modified by tailoring, repair, dyeing, embroidery changes or other alterations after delivery.",
            "Products should also be free from avoidable stains, makeup marks, perfume or fragrance, excessive handling or other indications that the product has been used.",
            "These requirements help ensure that returned products remain in a condition appropriate for assessment and, where applicable, further handling.",
          ],
        },

        /* =====================================================
           07
        ===================================================== */

        {
          title: "7. Original tags and packaging",
          paragraphs: [
            "Where original tags, labels, packaging or accessories are provided with a product, customers should retain them until they are certain that the product will be kept.",
            "A return or exchange may require the relevant tags and packaging to remain attached or included, depending on the applicable product conditions.",
            "Removing tags, discarding packaging or separating product components before deciding whether to keep the item may affect eligibility where those components form part of the applicable return requirements.",
            "Customers should therefore keep the complete product presentation safely until the return or exchange decision has been finalised.",
          ],
        },

        /* =====================================================
           08
        ===================================================== */

        {
          title: "8. Return packaging and safe handling",
          paragraphs: [
            "When returning a product, please package it carefully so that it remains protected during transportation.",
            "The product should be packed in a manner that reduces the possibility of damage, staining, moisture exposure or other avoidable issues during transit.",
            "Where return instructions specify a particular packaging method or documentation, those instructions should be followed.",
            "Customers should retain any relevant return confirmation or shipping information until the returned product has been received and the request has been resolved.",
          ],
        },

        /* =====================================================
           09
        ===================================================== */

        {
          title: "9. Product inspection after return",
          paragraphs: [
            "Once a returned product is received, it may be inspected before the return, exchange or refund is approved.",
            "The assessment may consider the product's physical condition, tags, packaging, visible signs of use, alterations, damage and other requirements applicable to the order.",
            "Receiving a returned parcel does not automatically mean that the return has been approved.",
            "If the product does not satisfy the applicable eligibility requirements, the requested return, exchange or refund may not be approved.",
          ],
        },

        /* =====================================================
           10
        ===================================================== */

        {
          title: "10. Items that may not qualify",
          items: [
            "Products that have been worn, washed, altered, repaired or otherwise modified after delivery, except where the issue is specifically covered by an applicable product or quality claim.",
            "Products returned with missing tags, labels, packaging or other components required under the applicable return conditions.",
            "Products showing stains, makeup marks, perfume, fragrance, odour or other signs of use.",
            "Products that have been damaged after delivery through handling, washing, storage or use.",
            "Products specifically identified as non-returnable or excluded under the applicable product or order policy.",
            "Products returned outside the applicable return or exchange conditions.",
          ],
        },

        /* =====================================================
           11
        ===================================================== */

        {
          title: "11. Exchange requests",
          paragraphs: [
            "An exchange allows an eligible product to be considered for replacement with another applicable product, subject to the conditions of the order and availability.",
            "Exchange availability may depend on the requested product, size, colour, stock position, product condition and other applicable conditions.",
            "An exchange request does not guarantee that the requested replacement will be available.",
            "If the requested replacement cannot be fulfilled, customer care may communicate the available alternatives according to the applicable policy.",
          ],
        },

        /* =====================================================
           12
        ===================================================== */

        {
          title: "12. Size-related exchange requests",
          paragraphs: [
            "If an exchange is requested because of size or fit, the product should remain in the required original condition and satisfy the applicable exchange requirements.",
            "Customers should avoid wearing, washing or altering a product while deciding whether the size is suitable.",
            "Availability of another size may change between the time a request is submitted and the time the exchange is processed.",
            "Where the preferred replacement size is unavailable, the available resolution may depend on the applicable exchange and refund conditions.",
          ],
        },

        /* =====================================================
           13
        ===================================================== */

        {
          title: "13. Colour and product appearance",
          paragraphs: [
            "Fashion products may appear slightly different depending on lighting conditions, photography, screen settings and the environment in which an image is viewed.",
            "A minor difference in colour representation between a product photograph and the physical product does not necessarily indicate that the wrong product has been delivered.",
            "If you believe that the product received is materially different from what was ordered, please contact customer care with the order details and, where requested, supporting photographs.",
            "The matter may then be reviewed based on the product information associated with the order.",
          ],
        },

        /* =====================================================
           14
        ===================================================== */

        {
          title: "14. Damaged or incorrect products",
          paragraphs: [
            "If your order arrives with a product that appears damaged, incorrect or materially inconsistent with the order, please contact customer care as soon as reasonably possible.",
            "Please preserve the product, packaging and relevant tags until the issue has been reviewed.",
            "Photographs may be requested to help understand the condition of the item and the nature of the issue.",
            "Depending on the circumstances and applicable policy, the resolution may involve an exchange, replacement, return, refund or another appropriate solution.",
          ],
        },

        /* =====================================================
           15
        ===================================================== */

        {
          title: "15. Products with a quality concern",
          paragraphs: [
            "If you believe that a product has a quality issue, please contact customer care and provide the order details together with a clear description of the concern.",
            "Where necessary, photographs or additional information may be requested to help understand the issue.",
            "A quality-related request may be assessed differently from a general change-of-mind, size or styling-related return.",
            "The final resolution will depend on the circumstances of the product and the applicable customer-care and return conditions.",
          ],
        },

        /* =====================================================
           16
        ===================================================== */

        {
          title: "16. Return and exchange assessment",
          paragraphs: [
            "Every return or exchange request may be reviewed against the conditions applicable to the relevant order.",
            "The review may consider the product category, condition, timing of the request, reason for return, availability of replacement products and any specific conditions communicated at the time of purchase.",
            "The purpose of the assessment is to apply the applicable conditions consistently while also allowing genuine product or order issues to be reviewed appropriately.",
            "If additional information is required, customer care may contact you before a final decision is made.",
          ],
        },

        /* =====================================================
           17
        ===================================================== */

        {
          title: "17. Refunds after an approved return",
          paragraphs: [
            "Where an eligible return results in a refund rather than an exchange, the refund will be handled according to the applicable Refund Policy and the payment method associated with the order.",
            "The amount refunded may depend on the amount actually paid, applicable discounts, promotional adjustments, shipping or other charges and the specific circumstances of the return.",
            "A return being accepted and the refund appearing in the customer's account may occur at different times because payment providers and financial institutions may have their own processing cycles.",
            "For detailed information about refund processing, customers should also review the Refund Policy published on the website.",
          ],
        },

        /* =====================================================
           18
        ===================================================== */

        {
          title: "18. Cancellations and returns are different",
          paragraphs: [
            "A cancellation request made before an order has progressed to fulfilment or dispatch may be handled differently from a return requested after delivery.",
            "Once an order has been dispatched or delivered, the applicable return or exchange process may need to be followed instead of a cancellation process.",
            "Customers who wish to cancel an order should contact customer care as soon as possible so that the order status can be reviewed.",
          ],
        },

        /* =====================================================
           19
        ===================================================== */

        {
          title: "19. Orders containing multiple products",
          paragraphs: [
            "If an order contains more than one product, a return or exchange request may apply to one product or multiple products depending on the circumstances.",
            "Returning one item from an order does not necessarily mean that the entire order will be cancelled or refunded.",
            "Where an order-level promotion, discount or other benefit was applied, returning part of the order may affect the calculation of the applicable refund or other transaction adjustment.",
            "Customer care may provide additional information where the return of individual products affects the original order conditions.",
          ],
        },

        /* =====================================================
           20
        ===================================================== */

        {
          title: "20. Promotions and discounted purchases",
          paragraphs: [
            "Products purchased using promotional codes, discounts, special offers or other promotional benefits may be subject to additional conditions.",
            "A return or exchange may affect the promotional benefit originally applied to the order where the conditions of that promotion depend on the number, value or combination of products purchased.",
            "The final refund or exchange outcome may therefore differ from a simple calculation based only on the individual product's displayed price.",
            "Customers should review any applicable promotional terms associated with the order.",
          ],
        },

        /* =====================================================
           21
        ===================================================== */

        {
          title: "21. Return shipping and logistics",
          paragraphs: [
            "The logistics involved in returning a product may vary depending on the order, location, product and applicable return process.",
            "Where return instructions are provided by customer care, customers should follow those instructions carefully.",
            "Responsibility for arranging or handing over a return shipment may depend on the applicable process communicated for the order.",
            "Customers should retain relevant shipping, pickup or handover information until the return has been confirmed as received.",
          ],
        },

        /* =====================================================
           22
        ===================================================== */

        {
          title: "22. What happens after we receive your return",
          paragraphs: [
            "Once a returned product reaches the applicable processing location, it may go through an assessment before the request is finalised.",
            "The product may be checked against the relevant order details and return conditions.",
            "If the request is approved, the next step may be an exchange, refund or other applicable resolution.",
            "If additional information is required, customer care may contact you before the request can be completed.",
            "Customers should therefore retain return-related communication until the process has been fully resolved.",
          ],
        },

        /* =====================================================
           23
        ===================================================== */

        {
          title: "23. Request status and communication",
          paragraphs: [
            "Where return or exchange updates are available, Aayesha Fashion may communicate important information through the contact details associated with the order.",
            "Customers should ensure that their registered email address and mobile number are accurate so that important communication can reach them.",
            "Some service-related communications may be necessary to complete a return, exchange or refund and may therefore be sent even if promotional communication preferences have been changed.",
          ],
        },

        /* =====================================================
           24
        ===================================================== */

        {
          title: "24. If your request cannot be approved",
          paragraphs: [
            "A return or exchange request may not be approved where the product or request does not satisfy the applicable conditions.",
            "Examples may include products that show signs of use, products missing required components, products returned outside the applicable conditions or products specifically excluded from returns or exchanges.",
            "Where appropriate, customer care may communicate the reason for the outcome and any available next steps.",
            "If you believe that a decision has been made incorrectly, you may contact customer care with the relevant order details so that the request can be reviewed.",
          ],
        },

        /* =====================================================
           25
        ===================================================== */

        {
          title: "25. Keeping your order information",
          paragraphs: [
            "We recommend retaining your order confirmation, invoice, order number and return-related communication until the purchase has been fully resolved.",
            "These details can help customer care locate the relevant transaction and understand the history of a return, exchange or refund request.",
            "When contacting us about an existing request, including the order number in your communication can help reduce unnecessary delays.",
          ],
        },

        /* =====================================================
           26
        ===================================================== */

        {
          title: "26. Changes to this Returns & Exchange policy",
          paragraphs: [
            "Our return and exchange practices may change as products, services, fulfilment processes and customer-care operations evolve.",
            "Aayesha Fashion may therefore update this policy from time to time.",
            "The latest version will be published on the website and may include an updated revision date.",
            "Customers should review the policy applicable to their order and contact customer care if they have questions about a specific return or exchange.",
          ],
        },

        /* =====================================================
           27
        ===================================================== */

        {
          title: "27. Contacting customer care",
          paragraphs: [
            "If you have questions about whether a product qualifies for a return or exchange, please contact Aayesha Fashion through the customer-care channels published on the website.",
            "Please include your order number, registered contact information and a clear description of the request.",
            "For product issues, photographs may help the team understand the concern more efficiently when requested.",
            "Our aim is to make the process as clear and straightforward as possible while applying the conditions relevant to each order consistently.",
          ],
        },

        /* =====================================================
           28
        ===================================================== */

        {
          title: "28. A more considered way to shop",
          paragraphs: [
            "We believe the relationship with a customer does not end when an order is delivered.",
            "A thoughtful fashion experience also means making it clear what happens when a product does not work as expected, when a size needs to be reconsidered or when an order requires additional assistance.",
            "Our returns and exchange process is therefore designed around clarity, product care and communication.",
            "We encourage customers to take time to review product information, sizing details and applicable policies before placing an order. And when support is needed afterwards, we want the next steps to be easy to understand.",
            "Because the Aayesha experience should feel considered at every stage — from discovering a piece to making it part of your wardrobe.",
          ],
        },
      ]}
    />
  );
}