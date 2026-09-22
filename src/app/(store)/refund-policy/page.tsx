import type { Metadata } from "next";
import { ContentPage } from "@/components/content/content-page";

export const metadata: Metadata = {
  title: "Refund Policy | Aayesha Fashion",
  description:
    "Understand the refund process at Aayesha Fashion, including refund eligibility, returned product assessment, cancellations, payment reversals, processing timelines and customer support.",
  alternates: {
    canonical: "/refund-policy",
  },
};

export default function RefundPolicyPage() {
  return (
    <ContentPage
      eyebrow="Legal · Customer Care"
      title="Refund Policy"
      description="At Aayesha Fashion, we want the post-purchase experience to feel as considered as the shopping experience itself. This Refund Policy explains when a refund may be available, how returned products may be assessed, how approved refunds are processed, and what customers can expect when a refund request is reviewed."
      updatedAt="September 2026"
      highlights={[
        {
          label: "Eligibility",
          value:
            "Refunds depend on the applicable return conditions and product eligibility",
        },
        {
          label: "Assessment",
          value:
            "Returned products may be reviewed before a refund is approved",
        },
        {
          label: "Processing",
          value:
            "Approved refunds are processed through the applicable payment mechanism",
        },
        {
          label: "Transparency",
          value:
            "Refund outcomes may depend on product condition, timing and transaction circumstances",
        },
      ]}
      sections={[
        /* =====================================================
           01
        ===================================================== */

        {
          title: "1. Understanding this Refund Policy",
          paragraphs: [
            "This Refund Policy explains the general principles that may apply when a customer requests a refund from Aayesha Fashion.",
            "A refund is not automatically available for every order or every return. Eligibility may depend on the product involved, the condition in which it is returned, the timing of the request, the applicable return conditions and the circumstances of the transaction.",
            "This policy should be read together with any applicable Return Policy, Terms & Conditions, product-specific information and instructions communicated to you in connection with your order.",
            "Where a specific product, order or promotion has different conditions, those applicable conditions may affect the availability or amount of a refund.",
          ],
        },

        /* =====================================================
           02
        ===================================================== */

        {
          title: "2. When a refund may be available",
          paragraphs: [
            "A refund may be available where an order or returned product satisfies the applicable return and refund requirements.",
            "Depending on the circumstances, eligibility may be affected by whether the product falls within an eligible return period, whether the product is in an acceptable condition, whether the product belongs to an excluded category and whether the applicable return process has been followed.",
            "Customers should review the relevant return instructions before sending a product back. Returning a product does not by itself guarantee that a refund will be approved.",
            "Where a refund cannot be approved, the customer may be informed of the relevant reason where appropriate.",
          ],
        },

        /* =====================================================
           03
        ===================================================== */

        {
          title: "3. Product condition and return assessment",
          paragraphs: [
            "Where a physical return is required, the returned product may be inspected before a refund is approved.",
            "The assessment may consider whether the product remains unused, unworn, unwashed, unaltered and in a condition consistent with the applicable return requirements.",
            "Where applicable, original tags, labels, packaging, accessories or other components associated with the product may also be considered during the assessment.",
            "Products showing signs of use, washing, alteration, damage, staining, strong odour or other conditions that are inconsistent with the applicable return requirements may not qualify for a refund.",
            "The assessment process exists to help determine whether the returned product satisfies the conditions applicable to the relevant order.",
          ],
        },

        /* =====================================================
           04
        ===================================================== */

        {
          title: "4. Return packaging and completeness",
          paragraphs: [
            "Customers should take reasonable care when preparing an eligible product for return.",
            "Where original packaging, tags, accessories or other components are required under the applicable return conditions, they should be included with the returned product.",
            "Customers should also package the product appropriately to reduce the risk of damage during transportation.",
            "Damage that occurs because a product was inadequately packaged for return may affect the assessment of the returned item where permitted by the applicable policy.",
          ],
        },

        /* =====================================================
           05
        ===================================================== */

        {
          title: "5. Refund after successful assessment",
          paragraphs: [
            "Once a returned product has been received and the applicable assessment has been completed, the refund request may be approved, partially adjusted where permitted, or declined depending on the circumstances.",
            "If the refund is approved, the applicable refund amount will be determined according to the relevant order, payment and return conditions.",
            "The approval of a return and the processing of a refund are related but may involve separate operational steps.",
            "Customers may therefore receive confirmation that a return has been accepted before the refund becomes visible in the original payment account.",
          ],
        },

        /* =====================================================
           06
        ===================================================== */

        {
          title: "6. What amount may be refunded",
          paragraphs: [
            "Where a refund is approved, the amount may depend on the amount actually paid for the eligible product or order and any applicable adjustments.",
            "The refund amount may take into account discounts, promotional benefits, coupon adjustments, shipping charges, non-refundable charges, deductions or other applicable transaction-specific amounts.",
            "The refund amount may therefore differ from the product's displayed MRP or from the total value shown before discounts or other adjustments.",
            "Where an order contains multiple products or components, the refund may be calculated specifically for the item or portion of the order that qualifies for a refund.",
          ],
        },

        /* =====================================================
           07
        ===================================================== */

        {
          title: "7. Partial refunds and applicable deductions",
          paragraphs: [
            "In certain circumstances, an approved refund may be less than the original amount paid.",
            "This may occur where only part of an order qualifies for a refund, where specific charges are non-refundable, where an applicable deduction is permitted, or where the refund needs to account for an adjustment connected with the transaction.",
            "Any applicable deduction should be considered in the context of the relevant return, order and payment conditions.",
            "Where appropriate, customers may contact customer care if they require clarification regarding the calculation of a refund.",
          ],
        },

        /* =====================================================
           08
        ===================================================== */

        {
          title: "8. Refunds for cancelled orders",
          paragraphs: [
            "An order cancellation may be handled differently depending on when the cancellation request is received and whether the order has already entered fulfilment or dispatch.",
            "Where a cancellation is successfully accepted before fulfilment or dispatch, the applicable refund process may be initiated without requiring a physical return.",
            "Once an order has entered fulfilment, been dispatched or otherwise progressed beyond the applicable cancellation stage, a return process may be required instead.",
            "Customers should therefore contact customer care as soon as possible if they wish to request cancellation of an order.",
          ],
        },

        /* =====================================================
           09
        ===================================================== */

        {
          title: "9. Refunds after delivery",
          paragraphs: [
            "Where a product has already been delivered, a refund may generally be considered through the applicable return process rather than as a direct cancellation.",
            "The customer may be required to request a return within the applicable timeframe and follow the instructions provided for the relevant order.",
            "The returned product may then be reviewed before a final refund decision is made.",
            "Customers should retain relevant order information and return-related communication until the return and refund process has been completed.",
          ],
        },

        /* =====================================================
           10
        ===================================================== */

        {
          title: "10. Refund timing",
          paragraphs: [
            "Refund processing involves more than one stage. These stages may include receiving and assessing a returned product, approving the refund, initiating the transaction and waiting for the relevant payment provider or financial institution to complete its processing.",
            "For this reason, the date on which Aayesha Fashion initiates a refund and the date on which the amount becomes visible in the customer's bank or payment account may be different.",
            "The final processing time may depend on the payment method, payment gateway, card network, bank or other financial institution involved.",
            "Customers should allow the relevant processing period to pass before treating a refund as delayed. If the amount remains unavailable after the expected processing period, customer care may be contacted for assistance.",
          ],
        },

        /* =====================================================
           11
        ===================================================== */

        {
          title: "11. Payment methods and refund destination",
          paragraphs: [
            "Where possible and appropriate, an approved refund may be processed through the payment mechanism associated with the original transaction.",
            "The exact refund mechanism may depend on the payment method used, the payment provider involved and the circumstances of the transaction.",
            "Certain payment methods may have their own rules regarding reversals, refunds, settlement periods or transaction adjustments.",
            "Customers may therefore see a refund reference, reversal entry or other transaction description that differs from the original order description.",
          ],
        },

        /* =====================================================
           12
        ===================================================== */

        {
          title: "12. Failed, declined or reversed payments",
          paragraphs: [
            "A payment may occasionally appear to have been deducted even though an order was not successfully completed.",
            "In such circumstances, the amount may be subject to a reversal or refund process controlled partly by the relevant payment provider or banking network.",
            "The timing of such a reversal may therefore differ from the normal refund process for a successfully completed order.",
            "If an amount remains unavailable beyond the expected banking or payment-provider processing period, customers should contact customer care with the relevant transaction or order information.",
          ],
        },

        /* =====================================================
           13
        ===================================================== */

        {
          title: "13. Coupons, discounts and promotional offers",
          paragraphs: [
            "Where an order was placed using a coupon, promotional code, discount or other offer, the refund calculation may take the applicable promotional terms into account.",
            "A discount applied to an order may not necessarily be refundable as a separate amount, and the value of an approved refund may be adjusted to reflect the actual amount paid for the eligible item.",
            "Where a promotion depended on purchasing multiple products or meeting a specific order value, returning part of the order may also affect the benefit originally applied to the transaction.",
            "Customers should review the applicable promotional terms where a refund request involves a discounted or promotional order.",
          ],
        },

        /* =====================================================
           14
        ===================================================== */

        {
          title: "14. Orders containing multiple products",
          paragraphs: [
            "If an order contains multiple products, a refund request may apply to one or more specific products rather than to the entire order.",
            "The refund amount may therefore be calculated according to the individual product or products that qualify for the refund and the applicable order-level adjustments.",
            "Where returning part of an order affects a discount, promotion, shipping benefit or other condition, the refund calculation may reflect that change where permitted.",
            "Customers should contact customer care if they require clarification regarding a refund involving multiple products.",
          ],
        },

        /* =====================================================
           15
        ===================================================== */

        {
          title: "15. Damaged, incorrect or defective products",
          paragraphs: [
            "If a customer receives a product that appears damaged, incorrect or otherwise inconsistent with the order, the customer should contact Aayesha Fashion through the available customer-care channels as soon as reasonably possible.",
            "The issue may require supporting information such as the order number, photographs, product details or other information necessary to understand the concern.",
            "Depending on the circumstances and applicable policy, the resolution may involve a replacement, exchange, return, refund or another appropriate solution.",
            "The handling of such cases may differ from a standard change-of-mind or general return request.",
          ],
        },

        /* =====================================================
           16
        ===================================================== */

        {
          title: "16. Refund verification",
          paragraphs: [
            "For certain refund-related requests, additional information may be required to verify the relevant order or customer account.",
            "This may include an order number, registered contact information, transaction reference or other information reasonably necessary to identify the transaction.",
            "Verification helps protect customers from unauthorised requests and reduces the risk of refund information being disclosed to the wrong person.",
            "Customers should avoid sending unnecessary sensitive payment information through general communication channels.",
          ],
        },

        /* =====================================================
           17
        ===================================================== */

        {
          title: "17. Refund disputes and unresolved requests",
          paragraphs: [
            "If you believe a refund has not been processed correctly, or if the amount received appears inconsistent with the approved refund, please contact customer care with the relevant order number and available transaction details.",
            "We may review the order history, return information, refund status and available payment records to understand the issue.",
            "Where a payment provider, bank or other financial institution controls part of the processing timeline, we may also need to consider information supplied by that provider.",
            "Additional verification may be required before financial information relating to an order is discussed.",
          ],
        },

        /* =====================================================
           18
        ===================================================== */

        {
          title: "18. Changes to this Refund Policy",
          paragraphs: [
            "Our refund practices may change as our products, services, payment methods, return processes and operational requirements evolve.",
            "For this reason, Aayesha Fashion may update this Refund Policy from time to time.",
            "The revised version will be published on the website and the updated revision date may be displayed to help customers identify the current version.",
            "Customers are encouraged to review the policy applicable to their order and to contact customer care if they require clarification regarding a specific transaction.",
          ],
        },

        /* =====================================================
           19
        ===================================================== */

        {
          title: "19. Contacting Aayesha Fashion",
          paragraphs: [
            "If you have questions regarding a refund, return assessment, payment reversal or the status of an approved refund, please contact Aayesha Fashion through the customer-care channels published on the website.",
            "When contacting us, providing your order number, registered email address or other relevant transaction information may help us locate the applicable order and respond more efficiently.",
            "Please keep your order and refund-related communication until the matter has been fully resolved.",
          ],
        },

        /* =====================================================
           20
        ===================================================== */

        {
          title: "20. Our approach to refunds",
          paragraphs: [
            "A good refund experience should be clear, considered and transparent.",
            "We understand that returning a fashion purchase can involve questions about eligibility, product condition, timing and payment processing. Our aim is to provide customers with clear information about the applicable process rather than leave them uncertain about what happens next.",
            "At the same time, refund decisions must take into account the condition of returned products, transaction details, applicable policies and the requirements of payment and delivery partners.",
            "Our objective is to handle eligible refund requests thoughtfully while maintaining a consistent process for customers and protecting the integrity of the shopping experience.",
          ],
        },
      ]}
    />
  );
}