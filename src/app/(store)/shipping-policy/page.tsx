import type { Metadata } from "next";

import { ContentPage } from "@/components/content/content-page";

export const metadata: Metadata = {
  title: "Shipping Policy | Aayesha Fashion",
  description:
    "Read Aayesha Fashion's detailed Shipping Policy covering order processing, dispatch, delivery timelines, tracking, address accuracy, delivery attempts, damaged shipments and external disruptions.",
  alternates: {
    canonical: "/shipping-policy",
  },
};

export default function ShippingPolicyPage() {
  return (
    <ContentPage
      eyebrow="Legal · Shipping"
      title="Shipping Policy"
      description="At Aayesha Fashion, we believe the experience of receiving an order should be as considered as the experience of discovering it. This Shipping Policy explains how orders move from confirmation to dispatch and delivery, what information customers are responsible for providing, how tracking works and how delivery-related situations are handled."
      updatedAt="September 2026"
      highlights={[
        {
          label: "Preparation",
          value:
            "Orders enter processing after successful confirmation and may require preparation time",
        },
        {
          label: "Dispatch",
          value:
            "Orders are handed to the applicable delivery or logistics partner after preparation",
        },
        {
          label: "Tracking",
          value:
            "Tracking information may be provided where supported by the applicable courier",
        },
        {
          label: "Delivery",
          value:
            "Actual delivery timing depends on destination, courier network and operational conditions",
        },
      ]}
      sections={[
        /* =====================================================
           01
        ===================================================== */

        {
          title: "1. Scope of this Shipping Policy",
          paragraphs: [
            "This Shipping Policy describes the general process followed for online orders placed through Aayesha Fashion.",
            "It explains order processing, preparation, dispatch, tracking, delivery addresses, delivery attempts, shipment issues and circumstances that may affect delivery timelines.",
            "This policy should be read together with the applicable Terms & Conditions, Returns & Exchange Policy, Refund Policy and other information displayed during the shopping and checkout experience.",
            "Specific product, order or promotional conditions may apply depending on the circumstances of a particular purchase.",
          ],
        },

        /* =====================================================
           02
        ===================================================== */

        {
          title: "2. Order confirmation",
          paragraphs: [
            "An order enters the fulfilment process after the order has been successfully placed and the applicable confirmation process has been completed.",
            "Customers should retain their order confirmation and order number until the order has been delivered and any applicable return or exchange period has passed.",
            "Order-related information may be communicated using the email address or mobile number associated with the order.",
            "An order confirmation indicates that the order has been recorded. It does not necessarily mean that the order has already been packed, dispatched or handed to a courier.",
          ],
        },

        /* =====================================================
           03
        ===================================================== */

        {
          title: "3. Order processing",
          paragraphs: [
            "After confirmation, the order may enter an internal processing and preparation stage.",
            "Processing may include reviewing the order, confirming product availability, preparing products, completing applicable checks, packing the shipment and arranging handover to the relevant logistics partner.",
            "Processing time can vary depending on product availability, order volume, operational requirements and the nature of the products included in the order.",
            "During periods of unusually high demand, processing may require additional time.",
          ],
        },

        /* =====================================================
           04
        ===================================================== */

        {
          title: "4. Order verification",
          paragraphs: [
            "Certain orders may be subject to additional verification before fulfilment or dispatch.",
            "Verification may be used to confirm order information or help protect customers and Aayesha Fashion against incorrect, suspicious or potentially fraudulent transactions.",
            "Where additional information is required, the order may remain in processing until the relevant verification step has been completed.",
            "Any delay resulting from required verification may affect the expected processing or dispatch timeline.",
          ],
        },

        /* =====================================================
           05
        ===================================================== */

        {
          title: "5. Product availability",
          paragraphs: [
            "Orders are fulfilled based on the availability of the products included in the order.",
            "While inventory information is intended to reflect available products, operational circumstances may occasionally affect fulfilment.",
            "Where a product availability issue materially affects an order, Aayesha Fashion may contact the customer regarding the available options.",
            "Customers should not assume that placing an order automatically guarantees that every operational fulfilment step will occur without interruption.",
          ],
        },

        /* =====================================================
           06
        ===================================================== */

        {
          title: "6. Packing and shipment preparation",
          paragraphs: [
            "Before dispatch, products may be prepared and packed for transportation.",
            "The packaging process is intended to protect the products during normal handling and transportation through the delivery network.",
            "Customers should retain the original packaging after delivery until they are satisfied that the order is correct and does not need to be returned or exchanged.",
            "Where a product is received damaged or the shipment appears materially compromised, retaining the packaging can assist with the subsequent review.",
          ],
        },

        /* =====================================================
           07
        ===================================================== */

        {
          title: "7. Dispatch",
          paragraphs: [
            "An order is considered dispatched when it has been handed over to the applicable delivery or logistics partner or otherwise enters the courier network.",
            "Dispatch and delivery are separate stages of the order journey.",
            "After dispatch, the shipment may pass through multiple sorting centres, transportation routes, regional facilities and local delivery networks before reaching the final destination.",
            "A dispatch notification therefore does not necessarily mean that the shipment is immediately close to delivery.",
          ],
        },

        /* =====================================================
           08
        ===================================================== */

        {
          title: "8. Delivery timelines",
          paragraphs: [
            "Any delivery estimate displayed during checkout or communicated separately should generally be treated as an estimate rather than an unconditional guarantee unless a specific delivery commitment has been expressly provided for the relevant order.",
            "Actual delivery timing may vary depending on the destination, courier network, processing time, shipment movement, weekends, holidays, weather conditions, regional restrictions and other operational factors.",
            "The estimated timeline may therefore differ from the actual date on which an order reaches the customer.",
            "Customers ordering for a specific occasion are encouraged to allow reasonable additional time for unexpected processing or delivery delays.",
          ],
        },

        /* =====================================================
           09
        ===================================================== */

        {
          title: "9. Tracking information",
          paragraphs: [
            "Where tracking is supported by the applicable delivery partner, a tracking reference may be shared or displayed after dispatch.",
            "Tracking information is generally provided through systems operated by the relevant logistics provider.",
            "A tracking reference may take some time to become active after the shipment has been handed over to the courier.",
            "Tracking updates may also appear with a delay because shipment events can take time to be recorded or synchronised between logistics systems.",
          ],
        },

        /* =====================================================
           10
        ===================================================== */

        {
          title: "10. Tracking status and shipment movement",
          paragraphs: [
            "Courier systems may display different tracking statuses depending on the logistics provider and stage of the shipment.",
            "A shipment may move through stages such as processing, packed, shipped, in transit, out for delivery and delivered, although individual shipments may not display every stage.",
            "A period without a visible tracking update does not necessarily mean that the shipment has stopped moving.",
            "Where a courier's tracking system contains more recent information than the Aayesha Fashion order page, the courier's operational tracking information may reflect the latest shipment event.",
          ],
        },

        /* =====================================================
           11
        ===================================================== */

        {
          title: "11. Delivery address responsibility",
          paragraphs: [
            "Customers are responsible for providing complete and accurate delivery information during checkout.",
            "The information should include the recipient's name, contact number, address details, locality, city, state and postal code, together with any additional information reasonably required to identify the destination.",
            "Where available, landmarks or useful delivery instructions may help the delivery partner locate the destination.",
            "Customers should carefully review the delivery information before completing the order because errors can lead to delays, failed delivery attempts or other shipment complications.",
          ],
        },

        /* =====================================================
           12
        ===================================================== */

        {
          title: "12. Changes to delivery information",
          paragraphs: [
            "If you discover an error in your delivery information after placing an order, please contact customer care as soon as reasonably possible.",
            "An address change may not always be possible once the order has entered fulfilment or has been dispatched.",
            "After dispatch, any address correction may also depend on the procedures and capabilities of the relevant courier partner.",
            "Aayesha Fashion cannot guarantee that a requested address change can be completed after shipment handover.",
          ],
        },

        /* =====================================================
           13
        ===================================================== */

        {
          title: "13. Failed delivery attempts",
          paragraphs: [
            "A delivery attempt may fail if the recipient is unavailable, the delivery address cannot be located, the contact number cannot be reached or another operational issue prevents successful handover.",
            "The courier may attempt re-delivery or follow its standard exception process depending on the circumstances.",
            "Customers should ensure that the contact details associated with the order remain accessible during the expected delivery period.",
            "Repeated unsuccessful delivery attempts may result in additional handling or return-to-origin movement according to the courier's applicable procedures.",
          ],
        },

        /* =====================================================
           14
        ===================================================== */

        {
          title: "14. Incorrect or incomplete addresses",
          paragraphs: [
            "An incorrect or incomplete delivery address can prevent a courier from completing delivery successfully.",
            "Examples may include an incorrect postal code, missing house or building information, incomplete locality details, incorrect city or state information or an unreachable phone number.",
            "Where delivery cannot be completed because of information supplied incorrectly during checkout, additional delay, handling or return-to-origin movement may occur.",
            "Customers are therefore encouraged to verify the complete address before submitting an order.",
          ],
        },

        /* =====================================================
           15
        ===================================================== */

        {
          title: "15. Receiving a shipment",
          paragraphs: [
            "Customers are encouraged to inspect the outer package when receiving the shipment where reasonably possible.",
            "If the package appears visibly damaged, opened, wet, heavily compressed or otherwise tampered with, customers should document the condition and contact customer care promptly.",
            "Where possible, photographs of the package condition can help document the issue.",
            "Customers should retain the packaging and product until the matter has been reviewed if a delivery-related concern is discovered.",
          ],
        },

        /* =====================================================
           16
        ===================================================== */

        {
          title: "16. Damaged or tampered shipments",
          paragraphs: [
            "If a shipment appears materially damaged or tampered with at the time of delivery, customers should preserve the relevant packaging and contact customer care as soon as reasonably possible.",
            "The order number, photographs and a description of the issue may be requested to help assess the situation.",
            "If the product inside the package is also damaged, the issue may be reviewed under the applicable customer-care, return or refund process.",
            "Customers should avoid discarding damaged packaging until the relevant matter has been reviewed where the packaging may be relevant to the assessment.",
          ],
        },

        /* =====================================================
           17
        ===================================================== */

        {
          title: "17. Missing, incorrect or incomplete shipments",
          paragraphs: [
            "If a customer receives an order that appears to contain a missing or incorrect product, customer care should be contacted with the relevant order details.",
            "Customers should retain the package, packaging materials and all products received until the matter has been reviewed.",
            "Photographs or additional information may be requested to help compare the delivered shipment with the original order.",
            "Depending on the circumstances, the issue may be handled through an applicable replacement, return, exchange, refund or other resolution.",
          ],
        },

        /* =====================================================
           18
        ===================================================== */

        {
          title: "18. Delivery delays",
          paragraphs: [
            "Delivery estimates are subject to the normal movement of the courier network and circumstances affecting the shipment.",
            "Delays may occur because of courier congestion, unusually high shipment volumes, weather conditions, public holidays, transportation issues, regional restrictions, infrastructure problems or other operational circumstances.",
            "A delay does not necessarily indicate that a shipment has been lost or cancelled.",
            "Customers should review the latest available tracking information before contacting customer care regarding a shipment that appears to be delayed.",
          ],
        },

        /* =====================================================
           19
        ===================================================== */

        {
          title: "19. Lost or potentially undelivered shipments",
          paragraphs: [
            "In unusual circumstances, a shipment may appear to be lost, significantly delayed or otherwise unable to complete delivery.",
            "If tracking information indicates an unusual issue or a shipment has remained inactive beyond a reasonable period, customers may contact customer care with the order number and tracking reference.",
            "The shipment may need to be reviewed with the applicable logistics provider before the appropriate next step can be determined.",
            "Additional time may therefore be required where a courier investigation is necessary.",
          ],
        },

        /* =====================================================
           20
        ===================================================== */

        {
          title: "20. External disruptions",
          paragraphs: [
            "Aayesha Fashion is not responsible for delivery delays caused by circumstances outside reasonable operational control.",
            "Such circumstances may include severe weather, natural events, public emergencies, regional restrictions, transportation disruption, courier network interruptions, infrastructure failures or other events that materially affect normal logistics operations.",
            "Where such circumstances occur, delivery may take longer than the original estimate.",
            "Where relevant information becomes available, customers may receive updated information through the available order or delivery communication channels.",
          ],
        },

        /* =====================================================
           21
        ===================================================== */

        {
          title: "21. Multiple-product orders",
          paragraphs: [
            "Orders containing multiple products may be processed and fulfilled together or through different stages depending on product availability and operational circumstances.",
            "Where an order is shipped in multiple consignments, individual shipments may have separate tracking information and different delivery dates.",
            "Customers should review the relevant order or tracking information to understand the status of each shipment.",
            "The delivery of one part of an order does not necessarily mean that every product included in the order has been delivered.",
          ],
        },

        /* =====================================================
           22
        ===================================================== */

        {
          title: "22. Delivery for special occasions",
          paragraphs: [
            "Customers purchasing an outfit or fashion piece for a festival, celebration, wedding, event or other important occasion should allow sufficient time for order processing and delivery.",
            "Estimated delivery dates should not automatically be treated as guaranteed arrival dates unless a specific commitment has been expressly provided.",
            "Unexpected operational or courier delays may affect the final delivery date.",
            "Planning with reasonable additional time can help reduce the impact of unforeseen delivery circumstances.",
          ],
        },

        /* =====================================================
           23
        ===================================================== */

        {
          title: "23. Courier partners and third-party logistics",
          paragraphs: [
            "Aayesha Fashion may use third-party logistics and courier providers to transport customer orders.",
            "Once a shipment has been handed over to a logistics partner, certain aspects of its movement are managed through that provider's network and operational procedures.",
            "These may include sorting, routing, transportation, delivery attempts and local delivery practices.",
            "Tracking information may therefore originate directly from the applicable courier system and may not always update simultaneously across all systems.",
          ],
        },

        /* =====================================================
           24
        ===================================================== */

        {
          title: "24. Delivery communication",
          paragraphs: [
            "Important service-related information may be communicated using the email address or mobile number associated with the order.",
            "Such communication may include order confirmation, dispatch information, tracking information, delivery updates or information relating to an unexpected delivery issue.",
            "Customers should ensure that the contact information supplied during checkout is accurate and accessible throughout the delivery process.",
            "Service-related communications may be necessary to fulfil the order and are separate from optional promotional communications.",
          ],
        },

        /* =====================================================
           25
        ===================================================== */

        {
          title: "25. Delivery information and customer privacy",
          paragraphs: [
            "Certain customer information must be used to process and deliver an online order.",
            "This may include the recipient's name, mobile number, email address, delivery address and information required to identify the relevant order.",
            "Where third-party logistics providers are used, relevant delivery information may be shared to the extent reasonably necessary to fulfil the shipment.",
            "For further information about the handling and protection of personal information, customers should review the Aayesha Fashion Privacy Policy.",
          ],
        },

        /* =====================================================
           26
        ===================================================== */

        {
          title: "26. Shipping and returns",
          paragraphs: [
            "Shipping and returns are separate stages of the customer journey.",
            "The successful delivery of an order does not automatically determine whether the product qualifies for a return or exchange.",
            "Return eligibility, product condition requirements and exchange procedures are governed by the applicable Returns & Exchange Policy.",
            "Customers should review the relevant policy before sending a product back.",
          ],
        },

        /* =====================================================
           27
        ===================================================== */

        {
          title: "27. Customer responsibilities",
          items: [
            "Provide a complete and accurate delivery address during checkout.",
            "Provide an active and reachable mobile number and email address.",
            "Review order information before completing the purchase.",
            "Monitor available tracking information after dispatch where tracking is provided.",
            "Remain reasonably available to receive the shipment or arrange an appropriate recipient where required.",
            "Preserve relevant packaging and order information when reporting a delivery issue.",
            "Contact customer care promptly when a significant delivery problem is identified.",
          ],
        },

        /* =====================================================
           28
        ===================================================== */

        {
          title: "28. Aayesha Fashion's approach to delivery",
          paragraphs: [
            "We believe the experience of receiving an order should reflect the same sense of care and consideration that goes into selecting the product itself.",
            "Our objective is to provide customers with clear information throughout the order journey, from confirmation and preparation to dispatch and delivery.",
            "Some elements of shipping depend on independent logistics networks and circumstances outside reasonable operational control. Nevertheless, we aim to communicate relevant information clearly and provide appropriate customer-care support when an order requires attention.",
            "A considered shopping experience does not end at checkout. It continues through the journey of the package and, ultimately, to the moment it arrives with you.",
          ],
        },

        /* =====================================================
           29
        ===================================================== */

        {
          title: "29. Policy updates",
          paragraphs: [
            "Our shipping operations may evolve as our products, fulfilment processes, logistics relationships and customer-care systems develop.",
            "Aayesha Fashion may therefore update this Shipping Policy from time to time.",
            "The current version will be published on the website and may include an updated revision date.",
            "Customers should review the applicable policy when placing an order and contact customer care if they have questions about a specific shipment.",
          ],
        },

        /* =====================================================
           30
        ===================================================== */

        {
          title: "30. Contacting customer care",
          paragraphs: [
            "If you have a question about order processing, dispatch, tracking, delivery delays, an incorrect address, a damaged shipment or another delivery-related matter, please contact Aayesha Fashion through the customer-care channels published on the website.",
            "Please include your order number and, where available, the tracking reference when contacting us.",
            "Providing complete information helps us identify the shipment and understand the relevant stage of the delivery process more efficiently.",
            "Where a matter requires coordination with a courier or logistics provider, additional time may be required to obtain and review the relevant information.",
          ],
        },
      ]}
    />
  );
}