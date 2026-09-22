import type { Metadata } from "next";

import { ContentPage } from "@/components/content/content-page";

export const metadata: Metadata = {
  title: "Terms & Conditions | Aayesha Fashion",
  description:
    "Read the Aayesha Fashion Terms & Conditions governing website access, accounts, products, orders, payments, shipping, returns, intellectual property and responsible use of the website.",
  alternates: {
    canonical: "/terms",
  },
};

export default function TermsPage() {
  return (
    <ContentPage
      eyebrow="Legal · The House"
      title="Terms & Conditions"
      description="These Terms & Conditions establish the framework for using the Aayesha Fashion website and purchasing products through it. They explain how the website may be used, how orders are placed and fulfilled, how customer accounts and information are handled, and the responsibilities that apply throughout the shopping experience."
      updatedAt="September 2026"
      highlights={[
        {
          label: "Website use",
          value:
            "Use Aayesha Fashion lawfully, responsibly and in accordance with these terms",
        },
        {
          label: "Orders",
          value:
            "Orders remain subject to availability, confirmation and applicable fulfilment checks",
        },
        {
          label: "Customer information",
          value:
            "Keep account, contact and delivery information accurate and reasonably current",
        },
        {
          label: "Policies",
          value:
            "Purchases are also subject to applicable shipping, return, refund and privacy policies",
        },
      ]}
      sections={[
        /* =====================================================
           01
        ===================================================== */

        {
          title: "1. Acceptance of these Terms",
          paragraphs: [
            "By accessing, browsing, registering on, or otherwise using the Aayesha Fashion website, you acknowledge that you have read and understood these Terms & Conditions and agree to comply with them.",
            "These terms apply to visitors, registered customers and anyone who otherwise interacts with the website or uses its shopping, account, customer-care or related functionality.",
            "If you do not agree with these terms, you should discontinue use of the website and should not place an order through it.",
            "Additional policies or terms displayed on specific pages of the website may form part of the terms applicable to a particular service, transaction or activity.",
          ],
        },

        /* =====================================================
           02
        ===================================================== */

        {
          title: "2. About the website",
          paragraphs: [
            "Aayesha Fashion operates an online fashion retail experience through which customers may browse products, discover collections, create accounts, place orders and access related customer services.",
            "The website may include product pages, editorial content, collection pages, account functionality, checkout services, order tracking and other digital experiences.",
            "We may update, modify, improve, suspend or discontinue portions of the website from time to time as our products, services, technology or operations evolve.",
          ],
        },

        /* =====================================================
           03
        ===================================================== */

        {
          title: "3. Website availability",
          paragraphs: [
            "We aim to keep the website available and functioning reliably, but continuous or uninterrupted availability cannot be guaranteed.",
            "Temporary interruptions may occur because of maintenance, software updates, infrastructure issues, hosting problems, network failures, security measures, third-party service interruptions or other technical circumstances.",
            "Certain features may also be temporarily unavailable while improvements, maintenance or security work is being carried out.",
            "Where reasonably practical, we may attempt to restore affected functionality as soon as possible.",
          ],
        },

        /* =====================================================
           04
        ===================================================== */

        {
          title: "4. Website content",
          paragraphs: [
            "The website may contain product names, descriptions, images, photographs, editorial material, graphics, illustrations, logos, pricing information, collection information and other content.",
            "We make reasonable efforts to present information accurately and clearly. However, minor differences may occur because of photography, lighting, screen settings, device displays, manufacturing variations, product batches or other circumstances.",
            "Product photographs are intended to provide a visual representation of the product. Colours displayed on individual screens may not perfectly reproduce the physical colour of the product.",
            "The availability, appearance, presentation and arrangement of website content may change without prior notice.",
          ],
        },

        /* =====================================================
           05
        ===================================================== */

        {
          title: "5. Product information",
          paragraphs: [
            "We make reasonable efforts to provide useful information about products, including descriptions, images, pricing, available sizes, colours, materials and other relevant details where applicable.",
            "Customers should review the available product information carefully before placing an order.",
            "Certain product characteristics may vary slightly between individual pieces or production batches, particularly where materials, embroidery, printing, embellishment or handcrafted details are involved.",
            "The presence of a product on the website does not guarantee that the product will remain available until checkout or fulfilment.",
          ],
        },

        /* =====================================================
           06
        ===================================================== */

        {
          title: "6. Product availability",
          paragraphs: [
            "Products displayed on the website are subject to availability.",
            "Inventory can change as customers place orders, products are reserved, stock is updated or operational circumstances change.",
            "We may limit quantities, discontinue products, temporarily remove products, correct availability information or update product listings where necessary.",
            "If a product cannot be fulfilled after an order has been placed, customer care may contact the customer regarding the applicable resolution.",
          ],
        },

        /* =====================================================
           07
        ===================================================== */

        {
          title: "7. Product selection and customer responsibility",
          paragraphs: [
            "Customers are responsible for reviewing the product information available on the website before purchasing.",
            "This may include reviewing product descriptions, available sizing information, images, colour information, care information where provided and other details relevant to the purchase.",
            "If you are uncertain about sizing, product characteristics or suitability, we encourage you to contact customer care before placing the order where appropriate.",
            "A customer placing an order confirms that the selected products and information have been reviewed to the extent reasonably necessary for the purchase.",
          ],
        },

        /* =====================================================
           08
        ===================================================== */

        {
          title: "8. Pricing",
          paragraphs: [
            "Product prices displayed on the website are subject to change without prior notice.",
            "The price applicable to an order is generally the price presented during the applicable checkout process, subject to correction of obvious errors and any applicable terms.",
            "Prices may be updated because of changes in product pricing, taxes, promotional campaigns, operational costs or other commercial considerations.",
            "A price displayed on a product page may therefore differ from a price displayed during a later visit if the product price has been updated.",
          ],
        },

        /* =====================================================
           09
        ===================================================== */

        {
          title: "9. Taxes, delivery charges and other costs",
          paragraphs: [
            "Applicable taxes, delivery charges, discounts, promotional adjustments or other transaction-related costs may be presented during checkout where relevant.",
            "The final amount payable for an order should be reviewed before the customer completes the purchase.",
            "Where a promotional offer applies specific conditions, those conditions may determine how the offer, discount or associated benefit is calculated.",
          ],
        },

        /* =====================================================
           10
        ===================================================== */

        {
          title: "10. Pricing or listing errors",
          paragraphs: [
            "Although we take reasonable care when publishing product information and prices, technical or human errors may occasionally occur.",
            "If an obvious pricing, product, availability or listing error is identified, we reserve the right to investigate the issue and take appropriate action in accordance with applicable law.",
            "Where an error materially affects an order, we may contact the customer and provide information about the available resolution.",
          ],
        },

        /* =====================================================
           11
        ===================================================== */

        {
          title: "11. Promotions and offers",
          paragraphs: [
            "Promotional offers, discounts, campaigns, coupon codes and other benefits may be subject to specific eligibility conditions.",
            "Unless expressly stated otherwise, promotional benefits cannot automatically be combined with other offers.",
            "Promotional periods, eligibility requirements, product exclusions, usage limits and other conditions may vary between campaigns.",
            "We reserve the right to correct obvious promotional errors or withdraw an offer where necessary, subject to applicable law.",
          ],
        },

        /* =====================================================
           12
        ===================================================== */

        {
          title: "12. Customer accounts",
          paragraphs: [
            "Certain website features may require the creation of a customer account.",
            "When creating an account, you agree to provide information that is accurate, complete and reasonably current.",
            "You should update account information when material details change, particularly information relevant to communication, delivery and account security.",
            "Account functionality may include order history, saved addresses, profile information, preferences and other features made available from time to time.",
          ],
        },

        /* =====================================================
           13
        ===================================================== */

        {
          title: "13. Account security",
          paragraphs: [
            "Customers are responsible for taking reasonable steps to protect their account credentials and other account-access information.",
            "You should not intentionally share passwords, verification codes or other authentication information with unauthorised persons.",
            "If you believe that your account has been accessed without permission or that your credentials may have been compromised, you should contact us promptly and take appropriate steps to secure the account.",
            "We are not responsible for account activity resulting solely from credentials being voluntarily or negligently disclosed by the account holder, except where applicable law provides otherwise.",
          ],
        },

        /* =====================================================
           14
        ===================================================== */

        {
          title: "14. Placing an order",
          paragraphs: [
            "Submitting an order through the website constitutes a request to purchase the selected products under the applicable terms.",
            "An order may be subject to product availability, payment processing, inventory checks, verification, fraud-prevention measures and other fulfilment requirements.",
            "The information presented during checkout should be reviewed carefully before the order is submitted.",
            "Customers should retain the order number and confirmation information for future reference.",
          ],
        },

        /* =====================================================
           15
        ===================================================== */

        {
          title: "15. Order acceptance",
          paragraphs: [
            "An order confirmation indicates that the order request has been received and recorded. It does not necessarily mean that every stage of fulfilment has been completed.",
            "An order may remain subject to availability, payment verification, operational checks and other applicable conditions before fulfilment is completed.",
            "If an order cannot be fulfilled, we may contact the customer and provide an appropriate resolution based on the circumstances and applicable policy.",
          ],
        },

        /* =====================================================
           16
        ===================================================== */

        {
          title: "16. Right to decline or cancel an order",
          paragraphs: [
            "Subject to applicable law, we may need to decline, cancel or otherwise modify an order in circumstances such as product unavailability, obvious pricing errors, suspected fraudulent activity, payment problems, materially incorrect order information or other legitimate operational reasons.",
            "Where an order is cancelled after payment has been successfully received, any applicable refund will be handled according to the relevant refund process and payment mechanism.",
            "Where additional information is required to process an order, the order may remain pending until the relevant issue is resolved.",
          ],
        },

        /* =====================================================
           17
        ===================================================== */

        {
          title: "17. Order cancellation by the customer",
          paragraphs: [
            "Customers may request cancellation where cancellation functionality or customer-care support is available for the relevant order.",
            "Cancellation depends on the stage of order processing.",
            "Once an order has entered fulfilment, been packed, dispatched or otherwise progressed beyond a cancellable stage, cancellation may no longer be possible.",
            "Where cancellation is accepted, the applicable refund process will depend on the payment status and relevant circumstances.",
          ],
        },

        /* =====================================================
           18
        ===================================================== */

        {
          title: "18. Payment",
          paragraphs: [
            "Orders must be paid using the payment methods made available during checkout.",
            "Payment transactions may be processed through third-party payment service providers.",
            "A successful payment attempt does not necessarily mean that the order has completed every verification or fulfilment step.",
            "If a payment is declined, reversed, interrupted or otherwise unsuccessful, the order may not be fulfilled until the payment issue has been resolved.",
          ],
        },

        /* =====================================================
           19
        ===================================================== */

        {
          title: "19. Payment security",
          paragraphs: [
            "Payment information may be processed through specialised third-party payment providers depending on the selected payment method.",
            "Customers should review the applicable payment provider's terms and privacy information where relevant.",
            "Customers should never share card passwords, one-time passwords, authentication codes or other confidential payment credentials with unauthorised persons.",
            "Aayesha Fashion will not intentionally request confidential authentication information through an insecure or unrelated communication channel.",
          ],
        },

        /* =====================================================
           20
        ===================================================== */

        {
          title: "20. Shipping and delivery",
          paragraphs: [
            "Orders are prepared and delivered according to the applicable Shipping & Delivery and Shipping Policy information published on the website.",
            "Delivery timelines are generally estimates and may vary according to destination, processing time, courier network conditions, public holidays, weather, regional restrictions and other operational circumstances.",
            "Customers are responsible for providing complete and accurate delivery information.",
            "Once an order has been handed to a third-party logistics provider, certain aspects of the shipment are governed by that provider's operational procedures.",
          ],
        },

        /* =====================================================
           21
        ===================================================== */

        {
          title: "21. Delivery addresses",
          paragraphs: [
            "Customers must provide an accurate delivery address, recipient name and reachable contact information.",
            "Incorrect or incomplete delivery information can result in failed delivery attempts, delays, additional handling or return-to-origin movement.",
            "Customers should contact customer care promptly if an error is discovered after an order has been placed, although an address change may not be possible after fulfilment or dispatch has begun.",
          ],
        },

        /* =====================================================
           22
        ===================================================== */

        {
          title: "22. Returns and exchanges",
          paragraphs: [
            "Products may be eligible for return or exchange only where the applicable Returns & Exchange Policy permits it.",
            "Eligibility may depend on product condition, timing, applicable exclusions, original tags, packaging and other requirements.",
            "Customers should review the applicable return or exchange policy before sending a product back.",
            "Receipt of a product does not automatically create an unconditional right to return or exchange it outside the applicable policy.",
          ],
        },

        /* =====================================================
           23
        ===================================================== */

        {
          title: "23. Refunds",
          paragraphs: [
            "Where a refund is applicable, it will be processed according to the relevant Refund Policy and the circumstances of the transaction.",
            "Refund timing can vary depending on the payment method, payment provider, banking network and other financial processing systems.",
            "The date on which Aayesha Fashion initiates a refund and the date on which the amount becomes visible in the customer's account may therefore differ.",
          ],
        },

        /* =====================================================
           24
        ===================================================== */

        {
          title: "24. Customer communications",
          paragraphs: [
            "By placing an order or creating an account, customers may receive service-related communications necessary to operate the account or fulfil the transaction.",
            "These may include order confirmations, payment information, dispatch updates, delivery notifications, security communications and other important service messages.",
            "Marketing communications, where applicable, may be governed by separate preferences and available unsubscribe mechanisms.",
            "Customers should ensure that their registered email address and mobile number remain accessible.",
          ],
        },

        /* =====================================================
           25
        ===================================================== */

        {
          title: "25. Prohibited use",
          items: [
            "Using the website for unlawful, fraudulent, deceptive or misleading activity.",
            "Attempting to gain unauthorised access to customer accounts, administrative systems, APIs, databases or other restricted areas.",
            "Attempting to interfere with website security, infrastructure, availability or normal operation.",
            "Introducing malicious code, harmful software or other material intended to compromise the website or its users.",
            "Using automated systems, bots, crawlers or scripts in a manner that places unreasonable load on the website or interferes with normal operation.",
            "Using the website to collect personal information about other customers without lawful authorisation.",
            "Impersonating Aayesha Fashion, its employees, representatives, service providers or other persons.",
            "Using website content, images, branding or other materials for unauthorised commercial purposes.",
          ],
        },

        /* =====================================================
           26
        ===================================================== */

        {
          title: "26. Intellectual property",
          paragraphs: [
            "Unless otherwise stated, the Aayesha Fashion name, brand identity, logos, website design, visual language, product photography, editorial photography, written content, graphics, illustrations, icons and other original materials made available through the website are protected by applicable intellectual-property laws.",
            "Access to the website does not transfer ownership of any intellectual property to the customer.",
            "Customers may view and use website content for personal, non-commercial shopping purposes, subject to these terms.",
            "Reproduction, redistribution, commercial exploitation, modification or public use of protected content without appropriate permission is not permitted.",
          ],
        },

        /* =====================================================
           27
        ===================================================== */

        {
          title: "27. Product photography and brand imagery",
          paragraphs: [
            "Aayesha Fashion's product and editorial imagery forms part of the visual identity of the brand.",
            "Images may be used to present products, collections, campaigns and editorial stories across the website and associated customer experiences.",
            "Customers may not reproduce, scrape, commercially reuse or redistribute such imagery without appropriate permission.",
            "Minor visual differences between online imagery and physical products may occur due to lighting, photography, display settings and other factors.",
          ],
        },

        /* =====================================================
           28
        ===================================================== */

        {
          title: "28. User communications and submissions",
          paragraphs: [
            "If customers voluntarily submit feedback, reviews, photographs, suggestions or other material to Aayesha Fashion through permitted website or customer-care channels, the customer remains responsible for ensuring that the submission is lawful and does not infringe the rights of another person.",
            "Customers should not submit confidential, unlawful, defamatory, infringing or malicious material.",
            "Where a specific feature allows customer-generated content, additional terms may apply to that feature.",
          ],
        },

        /* =====================================================
           29
        ===================================================== */

        {
          title: "29. Third-party services",
          paragraphs: [
            "The website may rely on third-party providers for services such as payment processing, hosting, cloud infrastructure, analytics, communications, security, delivery, authentication and other technical functions.",
            "Third-party providers may operate under their own terms, privacy policies and service conditions.",
            "Aayesha Fashion may not control every aspect of a third-party service and cannot guarantee the continuous availability or performance of external services.",
          ],
        },

        /* =====================================================
           30
        ===================================================== */

        {
          title: "30. External links",
          paragraphs: [
            "The website may occasionally reference or link to third-party websites or services.",
            "Such links may be provided for convenience or informational purposes.",
            "A link to a third-party website does not necessarily mean that Aayesha Fashion endorses, controls or accepts responsibility for that website, its content, security or practices.",
            "Customers should review the applicable terms and privacy policies of external websites before using them.",
          ],
        },

        /* =====================================================
           31
        ===================================================== */

        {
          title: "31. Privacy and personal information",
          paragraphs: [
            "Personal information collected through the website is handled in accordance with the applicable Aayesha Fashion Privacy Policy.",
            "Information may be required to create accounts, process orders, arrange delivery, provide customer support, maintain security and improve the website and services.",
            "Customers should review the Privacy Policy for information about data collection, use, retention, security and applicable customer choices.",
          ],
        },

        /* =====================================================
           32
        ===================================================== */

        {
          title: "32. Website security",
          paragraphs: [
            "We use reasonable measures intended to protect the website and associated systems against unauthorised access, misuse and other security risks.",
            "However, no internet service, transmission or digital storage system can be guaranteed to be completely secure.",
            "Customers should use appropriate security practices, including protecting account credentials, using secure devices and avoiding disclosure of confidential authentication information.",
          ],
        },

        /* =====================================================
           33
        ===================================================== */

        {
          title: "33. Errors and corrections",
          paragraphs: [
            "The website may occasionally contain typographical errors, inaccurate information, technical errors, outdated information or other unintended inaccuracies.",
            "We may correct or update such information when identified.",
            "Where an error materially affects a transaction, we may take appropriate action consistent with applicable law and the circumstances of the order.",
          ],
        },

        /* =====================================================
           34
        ===================================================== */

        {
          title: "34. Limitation of responsibility",
          paragraphs: [
            "To the extent permitted by applicable law, Aayesha Fashion will not be responsible for losses arising solely from circumstances outside reasonable operational control.",
            "Such circumstances may include certain technology failures, network interruptions, third-party service failures, courier disruptions, public infrastructure issues, natural events, regional restrictions or other unforeseen circumstances.",
            "Nothing in these terms is intended to exclude or limit any responsibility that cannot lawfully be excluded or limited under applicable law.",
          ],
        },

        /* =====================================================
           35
        ===================================================== */

        {
          title: "35. Indemnity and misuse",
          paragraphs: [
            "Where permitted by applicable law, customers may be responsible for losses, claims, liabilities or reasonable costs arising from their unlawful or unauthorised use of the website, violation of these terms or infringement of another person's rights.",
            "This provision does not limit any rights or remedies that may be available to either party under applicable law.",
          ],
        },

        /* =====================================================
           36
        ===================================================== */

        {
          title: "36. Account suspension or termination",
          paragraphs: [
            "Where reasonably necessary and subject to applicable law, access to an account or certain website functionality may be suspended or terminated if there is suspected misuse, fraudulent activity, security risk, violation of these terms or another legitimate operational reason.",
            "Account closure does not automatically remove obligations that arose before closure or affect transaction records that we are required or permitted to retain.",
            "Customers may contact customer care if they believe an account-related action requires clarification.",
          ],
        },

        /* =====================================================
           37
        ===================================================== */

        {
          title: "37. Changes to these Terms",
          paragraphs: [
            "Aayesha Fashion may update these Terms & Conditions from time to time to reflect changes in our products, services, technology, operations, legal requirements or business practices.",
            "The updated version will be published on the website and may include a revised update date.",
            "Unless a different effective date is expressly stated, the updated terms generally apply from the time they are published.",
            "Customers should review the applicable terms periodically, particularly before placing a new order.",
          ],
        },

        /* =====================================================
           38
        ===================================================== */

        {
          title: "38. Applicable legal framework",
          paragraphs: [
            "These terms are intended to operate subject to the applicable laws and regulations governing the relevant transaction, customer relationship and use of the website.",
            "Nothing in these terms is intended to remove or restrict rights that cannot legally be excluded under applicable consumer-protection or other mandatory laws.",
            "Where a provision is found to be unenforceable, the remaining provisions may continue to operate to the extent permitted by law.",
          ],
        },

        /* =====================================================
           39
        ===================================================== */

        {
          title: "39. Entire understanding",
          paragraphs: [
            "These Terms & Conditions, together with the policies and specific terms referenced on the website, describe the general framework governing use of the Aayesha Fashion website and purchases made through it.",
            "Specific product, promotional, shipping, return, refund or service terms may apply where expressly communicated and may supplement these general terms.",
          ],
        },

        /* =====================================================
           40
        ===================================================== */

        {
          title: "40. Contacting Aayesha Fashion",
          paragraphs: [
            "If you have questions about these Terms & Conditions, an order, account functionality, payment, shipping, returns or another aspect of your experience, please contact Aayesha Fashion through the customer-care channels published on the website.",
            "When contacting customer care regarding an order, including the order number and relevant contact information can help us identify the transaction and respond more efficiently.",
            "We encourage customers to contact us whenever clarification is required before taking an action that may affect an order or account.",
          ],
        },

        /* =====================================================
           41
        ===================================================== */

        {
          title: "41. A considered relationship with our customers",
          paragraphs: [
            "Aayesha Fashion is built around the idea that fashion should feel personal, considered and easy to experience.",
            "These terms exist to create clarity around that relationship — how the website may be used, how orders are processed, what customers can expect from the shopping journey and what responsibilities apply to everyone involved.",
            "Our intention is not simply to establish rules, but to provide a transparent framework for a digital fashion experience where customers can discover, purchase and enjoy products with confidence.",
          ],
        },
      ]}
    />
  );
}