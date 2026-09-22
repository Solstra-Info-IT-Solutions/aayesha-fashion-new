import type { Metadata } from "next";

import { ContentPage } from "@/components/content/content-page";

export const metadata: Metadata = {
  title: "Shipping & Delivery | Aayesha Fashion",
  description:
    "Learn how Aayesha Fashion processes, dispatches and delivers online orders, including delivery addresses, tracking, delays, failed deliveries, damaged packages and customer-care support.",
  alternates: {
    canonical: "/shipping",
  },
};

export default function ShippingPage() {
  return (
    <ContentPage
      eyebrow="Customer Care · Shipping"
      title="Shipping & Delivery"
      description="From the moment your order is confirmed to the moment it reaches your doorstep, every delivery is part of the Aayesha Fashion experience. This guide explains order processing, dispatch, tracking, delivery addresses, delays, delivery attempts, package handling and what to do when something does not go as expected."
      updatedAt="September 2026"
      highlights={[
        {
          label: "Order preparation",
          value:
            "Orders are prepared after successful confirmation and may require processing time",
        },
        {
          label: "Dispatch",
          value:
            "Tracking information may become available after the shipment is handed to the delivery partner",
        },
        {
          label: "Delivery",
          value:
            "Delivery timing can vary according to destination, courier network and operational conditions",
        },
        {
          label: "Customer care",
          value:
            "Our team can assist with order and delivery-related questions",
        },
      ]}
      sections={[
        /* =====================================================
           01
        ===================================================== */

        {
          title: "1. Understanding our delivery process",
          paragraphs: [
            "Once an order is successfully placed and confirmed, it begins its journey through order processing, preparation, dispatch and delivery.",
            "The time required for each stage can vary depending on product availability, order volume, operational requirements, destination and the delivery network serving the address.",
            "An order may therefore move through several status stages before it reaches the customer.",
            "Our aim is to keep the process clear and provide relevant order or tracking information wherever such information is available.",
          ],
        },

        /* =====================================================
           02
        ===================================================== */

        {
          title: "2. Order confirmation",
          paragraphs: [
            "After an order has been successfully placed, the order information is recorded and the order may enter the confirmation and preparation process.",
            "Customers should retain their order confirmation and order number until the order has been delivered and any applicable return or exchange period has passed.",
            "Order-related communication may be sent to the email address or mobile number associated with the purchase.",
            "In certain circumstances, additional verification may be required before an order can proceed further.",
          ],
        },

        /* =====================================================
           03
        ===================================================== */

        {
          title: "3. Order processing and preparation",
          paragraphs: [
            "Before dispatch, products may need to be reviewed, prepared, packed and processed for shipment.",
            "Preparation time can vary depending on product availability, order volume, the nature of the product and operational requirements at the time the order is placed.",
            "Certain orders may require additional checks before fulfilment. These checks may be carried out to help protect customers and the business against incorrect, suspicious or potentially fraudulent transactions.",
            "An order being confirmed does not necessarily mean that it has already been handed over to the delivery partner.",
          ],
        },

        /* =====================================================
           04
        ===================================================== */

        {
          title: "4. Product availability and order preparation",
          paragraphs: [
            "Orders are prepared based on the availability of the products included in the order.",
            "Where an order contains multiple products, different products may require different preparation stages depending on their availability and fulfilment requirements.",
            "In unusual circumstances, an availability or operational issue may affect the expected processing of an order.",
            "If an issue materially affects the fulfilment of an order, customer care may communicate the relevant information and available next steps.",
          ],
        },

        /* =====================================================
           05
        ===================================================== */

        {
          title: "5. Dispatch",
          paragraphs: [
            "Once an order has been prepared and is ready to leave the applicable fulfilment process, it may be handed over to a delivery or logistics partner.",
            "The order status may then be updated to indicate that the shipment has been dispatched or is progressing through the delivery network.",
            "Dispatch marks an important transition in the order journey, but it does not necessarily mean that the shipment is immediately close to delivery.",
            "After handover, the shipment may pass through sorting facilities, transit locations and local delivery networks before reaching the destination.",
          ],
        },

        /* =====================================================
           06
        ===================================================== */

        {
          title: "6. Tracking information",
          paragraphs: [
            "Where shipment tracking is supported, tracking information may be made available after the order has been handed over to the relevant delivery partner.",
            "Tracking information may include a shipment reference, current delivery status, movement updates or other information supplied by the delivery network.",
            "A tracking reference may take some time to become active after the courier receives the shipment.",
            "The absence of an immediate tracking update does not necessarily mean that the shipment has not been dispatched.",
          ],
        },

        /* =====================================================
           07
        ===================================================== */

        {
          title: "7. Understanding tracking updates",
          paragraphs: [
            "Courier tracking systems may use different status descriptions depending on the delivery network.",
            "An order may move through stages such as confirmed, processing, packed, shipped, in transit, out for delivery and delivered, although not every shipment will necessarily display every status.",
            "Tracking information is provided to help customers understand the general movement of a shipment. Individual updates may not always appear immediately after an event occurs.",
            "Where a courier's tracking information differs from the status displayed on the Aayesha Fashion website, the courier's operational tracking system may contain more recent movement information.",
          ],
        },

        /* =====================================================
           08
        ===================================================== */

        {
          title: "8. Delivery address",
          paragraphs: [
            "Customers are responsible for providing a complete and accurate delivery address at checkout.",
            "The delivery information should generally include the recipient's name, mobile number, address details, locality or area, city, state and postal code.",
            "Where available, additional information such as a landmark or other useful delivery instruction may help the courier locate the destination.",
            "Customers should carefully review their delivery information before completing an order because an incorrect address can result in delays, failed delivery attempts, return-to-origin movement or other complications.",
          ],
        },

        /* =====================================================
           09
        ===================================================== */

        {
          title: "9. Changing a delivery address",
          paragraphs: [
            "If you notice an error in your delivery address after placing an order, contact customer care as soon as possible.",
            "An address change may not always be possible once an order has entered fulfilment or has been handed to a delivery partner.",
            "If the shipment has already been dispatched, any available address correction may depend on the capabilities and procedures of the delivery partner.",
            "Customers should therefore review address information carefully before placing an order.",
          ],
        },

        /* =====================================================
           10
        ===================================================== */

        {
          title: "10. Delivery timelines",
          paragraphs: [
            "Delivery timelines can vary according to destination, order preparation time, courier capacity, regional conditions and other operational factors.",
            "Any delivery estimate displayed during the shopping or checkout process should generally be understood as an indication rather than an absolute guarantee unless a specific delivery commitment has been expressly communicated for the order.",
            "The actual delivery date may therefore be earlier or later than an initial estimate.",
            "Customers should consider the complete journey from order processing through dispatch and final delivery when planning around a particular occasion.",
          ],
        },

        /* =====================================================
           11
        ===================================================== */

        {
          title: "11. Factors that may affect delivery",
          paragraphs: [
            "Delivery can be influenced by circumstances both within and outside the ordinary fulfilment process.",
            "Possible factors include courier congestion, high order volumes, public holidays, weather conditions, regional restrictions, transportation disruptions, operational issues, incorrect address information and circumstances affecting a particular delivery route.",
            "During periods of unusually high demand, the preparation and delivery network may also experience increased volumes.",
            "Where a delay occurs because of circumstances outside reasonable operational control, the actual delivery date may differ from the initial estimate.",
          ],
        },

        /* =====================================================
           12
        ===================================================== */

        {
          title: "12. Delivery attempts",
          paragraphs: [
            "A delivery partner may make one or more attempts to deliver a shipment depending on its procedures and the circumstances of the destination.",
            "Customers should ensure that the recipient or another authorised person is reasonably available to receive the shipment when required.",
            "A failed delivery attempt may occur because the recipient is unavailable, the address cannot be located, the contact number is unreachable or another delivery-related issue prevents successful handover.",
            "Repeated unsuccessful attempts may result in additional delivery action or movement of the shipment according to the courier's applicable process.",
          ],
        },

        /* =====================================================
           13
        ===================================================== */

        {
          title: "13. Incorrect or incomplete address",
          paragraphs: [
            "An incorrect or incomplete address can prevent a delivery partner from completing delivery successfully.",
            "Examples may include an incorrect postal code, missing locality information, incomplete building or house details, incorrect city or state information, or an unreachable contact number.",
            "Where a shipment cannot be delivered because of incorrect information provided during checkout, additional handling, delay or return-to-origin movement may occur depending on the courier process.",
            "Customers should therefore review all delivery details carefully before submitting an order.",
          ],
        },

        /* =====================================================
           14
        ===================================================== */

        {
          title: "14. Delivery to the provided address",
          paragraphs: [
            "Orders are generally delivered to the address provided during checkout and confirmed with the order.",
            "Customers should ensure that the delivery address is a location where the shipment can reasonably be received.",
            "Depending on the delivery partner and location, the courier may follow local delivery procedures regarding building access, reception desks, security gates, neighbourhood restrictions or authorised recipients.",
            "Aayesha Fashion may not be able to control the exact delivery procedure used by an independent courier partner.",
          ],
        },

        /* =====================================================
           15
        ===================================================== */

        {
          title: "15. Receiving your order",
          paragraphs: [
            "Customers are encouraged to inspect the outer condition of the package at the time of delivery where reasonably possible.",
            "If the package appears visibly damaged, opened, heavily compressed, wet or otherwise tampered with, customers should document the condition where possible and contact customer care promptly.",
            "Where an issue with the product itself is discovered after opening the package, customers should preserve the product, packaging, tags and other relevant materials and contact customer care as soon as reasonably possible.",
            "Photographs or other information may be requested to help understand the condition of the shipment.",
          ],
        },

        /* =====================================================
           16
        ===================================================== */

        {
          title: "16. Damaged packages",
          paragraphs: [
            "A package may occasionally experience external damage during transportation.",
            "If you receive a package that appears significantly damaged or tampered with, please document the condition before discarding any packaging materials.",
            "Where the product inside is also affected, contact customer care with the order number and relevant photographs or information.",
            "The matter may then be reviewed based on the order, delivery information and circumstances reported by the customer.",
          ],
        },

        /* =====================================================
           17
        ===================================================== */

        {
          title: "17. Missing or incorrect items",
          paragraphs: [
            "If an order appears to contain a missing, incorrect or unexpected product, please contact customer care with the order number and details of the issue.",
            "Customers should retain the packaging and all products received until the matter has been reviewed.",
            "Additional information or photographs may be requested to help compare the shipment with the original order information.",
            "Depending on the circumstances, the issue may be handled through an appropriate replacement, return, exchange, refund or other customer-care resolution.",
          ],
        },

        /* =====================================================
           18
        ===================================================== */

        {
          title: "18. Delayed shipments",
          paragraphs: [
            "If a shipment appears to be delayed, customers should first review the latest available tracking information.",
            "A delay can occur at different stages of the delivery network and a tracking status may not always change immediately after a shipment moves between facilities.",
            "If the shipment remains unusually inactive or appears to have exceeded the expected delivery timeframe by a significant margin, customer care may be contacted for assistance.",
            "Where the delivery partner controls the relevant shipment movement, additional information may need to be obtained from the courier before a final update can be provided.",
          ],
        },

        /* =====================================================
           19
        ===================================================== */

        {
          title: "19. Lost or potentially undelivered shipments",
          paragraphs: [
            "In rare circumstances, a shipment may appear to be lost, significantly delayed or otherwise unable to complete delivery.",
            "If tracking information indicates an unusual issue, or if a shipment has not arrived despite an expected delivery timeframe, customers should contact customer care with the order and tracking details.",
            "The shipment may need to be reviewed with the relevant delivery partner before an appropriate resolution can be determined.",
            "Customers should retain all order and tracking information while such an investigation is in progress.",
          ],
        },

        /* =====================================================
           20
        ===================================================== */

        {
          title: "20. Delivery to restricted or difficult locations",
          paragraphs: [
            "Certain locations may have delivery restrictions or operational limitations depending on the courier network serving the destination.",
            "These may include restricted-access buildings, remote areas, specific regional restrictions, security-controlled premises or locations that are difficult for the delivery partner to access.",
            "Where delivery to a particular location cannot be completed through the available courier network, customer care may communicate the available options where applicable.",
          ],
        },

        /* =====================================================
           21
        ===================================================== */

        {
          title: "21. Orders containing multiple products",
          paragraphs: [
            "When an order contains multiple products, the products may be prepared and processed together or through different fulfilment stages depending on availability and operational circumstances.",
            "This can occasionally affect the way the order is packed, dispatched or delivered.",
            "If an order is split into separate shipments, the associated tracking information or delivery timing may differ between the shipments where applicable.",
            "Customers should review the order and tracking information available for the specific shipment.",
          ],
        },

        /* =====================================================
           22
        ===================================================== */

        {
          title: "22. Orders for special occasions",
          paragraphs: [
            "If you are ordering an outfit or fashion piece for a specific event, celebration, festival or important occasion, we recommend placing the order with reasonable time for processing and delivery.",
            "Delivery estimates can change due to operational or courier circumstances, and an estimated delivery date should not automatically be treated as a guaranteed arrival date.",
            "Where a particular date is important, customers should consider the possibility of unexpected delays when planning their purchase.",
          ],
        },

        /* =====================================================
           23
        ===================================================== */

        {
          title: "23. Communication during delivery",
          paragraphs: [
            "Important order and delivery-related communication may be sent using the contact information associated with the order.",
            "This may include order confirmation, dispatch information, tracking details, delivery-related updates or other service communications.",
            "Customers should ensure that their email address and mobile number are entered correctly during checkout and remain accessible during the delivery period.",
            "Service-related communication is separate from promotional marketing communication and may be necessary to provide the requested service.",
          ],
        },

        /* =====================================================
           24
        ===================================================== */

        {
          title: "24. Courier and delivery partners",
          paragraphs: [
            "Aayesha Fashion may work with third-party delivery, logistics or courier providers to fulfil online orders.",
            "Once an order is handed over to a delivery partner, certain operational aspects of the shipment are controlled by that partner's network and procedures.",
            "These may include routing, sorting, delivery attempts, local delivery practices and tracking updates.",
            "Customers may therefore receive information directly from a courier partner in addition to communication provided through Aayesha Fashion.",
          ],
        },

        /* =====================================================
           25
        ===================================================== */

        {
          title: "25. Delivery information and privacy",
          paragraphs: [
            "Delivery requires certain customer information to be provided to the relevant fulfilment and logistics partners.",
            "This may include the recipient's name, contact number and delivery address together with information necessary to identify and complete the shipment.",
            "Such information is shared only to the extent reasonably necessary for the applicable fulfilment or delivery process, subject to the relevant operational and legal requirements.",
            "For more information about how customer information is handled, please review the Aayesha Fashion Privacy Policy.",
          ],
        },

        /* =====================================================
           26
        ===================================================== */

        {
          title: "26. Delivery and returns",
          paragraphs: [
            "Delivery and returns are separate stages of the customer journey.",
            "Receiving a product does not automatically determine whether it is eligible for a return or exchange. Return eligibility is governed by the applicable Returns & Exchange policy.",
            "If a product needs to be returned after delivery, customers should review the applicable return conditions and contact customer care before sending the product back where required.",
            "For detailed information about return eligibility, product condition and exchange requests, please refer to the Returns & Exchange page.",
          ],
        },

        /* =====================================================
           27
        ===================================================== */

        {
          title: "27. Delivery delays outside reasonable control",
          paragraphs: [
            "Certain events can affect delivery even when an order has been correctly prepared and dispatched.",
            "These may include extreme weather, natural events, public holidays, transportation disruption, regional restrictions, unexpected courier congestion, infrastructure issues or other circumstances outside reasonable operational control.",
            "In such situations, delivery may take longer than the original estimate.",
            "Where relevant information becomes available, customers may receive an updated status through the available order or delivery channels.",
          ],
        },

        /* =====================================================
           28
        ===================================================== */

        {
          title: "28. What to do if you need delivery assistance",
          paragraphs: [
            "If you have a question about your order, delivery address, dispatch status, tracking information or an unexpected delivery issue, contact Aayesha Fashion through the customer-care channels published on the website.",
            "Please include your order number and relevant tracking information when contacting us.",
            "Providing complete information helps the customer-care team identify the order and understand the delivery stage more efficiently.",
            "Where a courier investigation is required, additional time may be necessary before a complete update can be provided.",
          ],
        },

        /* =====================================================
           29
        ===================================================== */

        {
          title: "29. Keeping your delivery information safe",
          paragraphs: [
            "Customers should keep order numbers, tracking references and delivery-related communication available until the order has been successfully received and any applicable return or exchange period has passed.",
            "Please avoid publicly sharing order numbers, personal delivery information or tracking details where they could expose private customer information.",
            "If you believe that your account or order information has been accessed without permission, contact customer care as soon as reasonably possible.",
          ],
        },

        /* =====================================================
           30
        ===================================================== */

        {
          title: "30. Our approach to delivery",
          paragraphs: [
            "A fashion purchase should feel considered from the moment it is discovered until it arrives at your door.",
            "For us, delivery is not simply the final logistical step of an order. It is part of the overall customer experience.",
            "Our goal is to provide clear order information, useful tracking where available and appropriate support when a delivery requires attention.",
            "While certain parts of the delivery journey depend on independent logistics networks and circumstances outside reasonable control, we aim to make the process as transparent and straightforward as possible.",
            "Because the Aayesha experience should feel thoughtful beyond the product itself — from discovery, to purchase, to delivery, and finally to the moment you wear it.",
          ],
        },
      ]}
    />
  );
}