import type { Metadata } from "next";
import { ContentPage } from "@/components/content/content-page";

export const metadata: Metadata = {
  title: "Privacy Policy | Aayesha Fashion",
  description:
    "Learn how Aayesha Fashion may collect, use, protect and manage personal information across our website, account, shopping, checkout and customer-care experiences.",
  alternates: {
    canonical: "/privacy-policy",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <ContentPage
      eyebrow="Legal · Privacy"
      title="Privacy Policy"
      description="At Aayesha Fashion, privacy is part of a thoughtful customer experience. This policy explains what information may be collected when you browse, shop, create an account or communicate with us, how that information may be used, the circumstances in which it may be shared, and the choices that may be available to you."
      updatedAt="September 2026"
      highlights={[
        {
          label: "Our approach",
          value:
            "Collect information with a clear business purpose",
        },
        {
          label: "Your information",
          value:
            "Used to provide, operate and improve your experience",
        },
        {
          label: "Your choices",
          value:
            "Access, update and manage certain information and communications",
        },
        {
          label: "Our commitment",
          value:
            "Reasonable safeguards and responsible information handling",
        },
      ]}
      sections={[
        /* =====================================================
           01
        ===================================================== */

        {
          title: "1. About this Privacy Policy",
          paragraphs: [
            "This Privacy Policy explains how information may be collected, used, stored and handled when you visit or interact with the Aayesha Fashion website, create an account, browse products, place an order, communicate with customer care or use other digital experiences made available through the website.",
            "The purpose of this policy is to provide a clear understanding of the types of information that may be involved in your relationship with Aayesha Fashion and the purposes for which that information may be used.",
            "This policy should be read together with any other terms, notices or policies that may apply to particular services, transactions or features of the website.",
            "By using the website or voluntarily providing information to us, you acknowledge that your information may be handled as described in this policy, subject to applicable law and the specific circumstances of your interaction with Aayesha Fashion.",
          ],
        },

        /* =====================================================
           02
        ===================================================== */

        {
          title: "2. Information you choose to provide",
          paragraphs: [
            "The information we receive depends on how you interact with the website.",
            "For example, when you create an account, place an order, request assistance or communicate with us, you may choose to provide information such as your name, email address, mobile number, shipping address, billing details, account information, order information and other information necessary to complete your request.",
            "You may also provide information voluntarily when you contact customer care, submit a question, communicate regarding an order, provide feedback or otherwise interact with us.",
            "We aim to collect information that is reasonably relevant to the purpose for which it is being requested rather than asking for information without a clear operational reason.",
          ],
        },

        /* =====================================================
           03
        ===================================================== */

        {
          title: "3. Account information",
          paragraphs: [
            "If you create an Aayesha Fashion account, information associated with your account may be used to provide account functionality and make your shopping experience more convenient.",
            "Depending on the features available to you, account information may include your name, email address, mobile number, saved addresses, order history, preferences and other information that you choose to maintain within your account.",
            "Your account may allow you to review previous orders, manage saved information, access order-related details and use other customer features made available through the website.",
            "You are responsible for taking reasonable care of your account credentials and should avoid sharing passwords, verification information or other account-access details with other people.",
          ],
        },

        /* =====================================================
           04
        ===================================================== */

        {
          title: "4. Information related to shopping and orders",
          paragraphs: [
            "When you browse products, add items to your shopping bag, proceed through checkout or place an order, information may be generated or provided that helps us operate the shopping experience.",
            "Order-related information may include products purchased, quantities, prices, discounts, shipping information, payment status, delivery information, order identifiers and communications associated with the transaction.",
            "This information may be used to process and fulfil your order, communicate important updates, provide customer support, manage returns or exchanges where applicable, maintain transaction records and help us understand the performance of our products and services.",
            "Order information may also be necessary for resolving transaction-related questions or disputes and for meeting applicable business, accounting, tax or legal obligations.",
          ],
        },

        /* =====================================================
           05
        ===================================================== */

        {
          title: "5. Shipping and delivery information",
          paragraphs: [
            "To deliver an order, we may need information such as your name, mobile number, shipping address, city, state, postal code and other delivery-related information that you provide during checkout.",
            "This information may be shared with relevant delivery, logistics or fulfilment providers when necessary to complete the requested service.",
            "Delivery information should be accurate and complete. Incorrect or incomplete information may affect our ability to deliver an order or communicate with you regarding its delivery.",
            "Where delivery partners or logistics providers process information independently, their own privacy terms and practices may also apply.",
          ],
        },

        /* =====================================================
           06
        ===================================================== */

        {
          title: "6. Payment information",
          paragraphs: [
            "Payments made through the website may be processed through third-party payment service providers.",
            "Depending on the payment method and the provider involved, sensitive payment information may be collected and processed directly by the relevant payment provider rather than being stored by Aayesha Fashion in full.",
            "We may receive transaction-related information such as payment status, transaction references, payment method information or other details necessary to confirm and reconcile an order.",
            "Customers should review the privacy and security practices of the relevant payment provider where applicable, particularly when payment information is entered directly into a third-party payment environment.",
          ],
        },

        /* =====================================================
           07
        ===================================================== */

        {
          title: "7. Information collected automatically",
          paragraphs: [
            "Some information may be collected automatically when you visit or interact with the website.",
            "This may include information relating to your device, browser type, operating environment, approximate network-derived location, pages visited, referring pages, interaction patterns, technical logs and information relating to website performance.",
            "Automatically collected information can help us understand how the website is being used, identify technical problems, maintain security, investigate errors and improve the overall digital shopping experience.",
            "This information may not always identify you directly. However, certain technical information may potentially be associated with other information depending on the circumstances and the technology being used.",
          ],
        },

        /* =====================================================
           08
        ===================================================== */

        {
          title: "8. How we use personal information",
          paragraphs: [
            "Personal information may be used for the purposes for which you provide it and for other purposes reasonably connected with operating Aayesha Fashion.",
            "These purposes may include creating and managing customer accounts, processing orders, arranging delivery, responding to customer enquiries, supporting returns and exchanges, communicating service information, improving website functionality, analysing product and website performance, preventing misuse and maintaining platform security.",
            "Information may also be used to understand general customer preferences and improve the way products, collections and content are presented on the website.",
            "Where marketing communications are available, information may be used to send relevant promotional communications in accordance with applicable requirements and your available communication preferences.",
          ],
        },

        /* =====================================================
           09
        ===================================================== */

        {
          title: "9. Product preferences and personalisation",
          paragraphs: [
            "Certain features of the website may allow you to save preferences or interact with products in ways that help create a more convenient shopping experience.",
            "Where such information is available, it may be used to improve product discovery, remember preferences, support account functionality or make the website more relevant to your interests.",
            "Personalisation does not necessarily mean that every product or communication you see is individually selected for you. Some recommendations or content may be based on broader product, collection, website or customer behaviour patterns.",
            "You may have options to manage certain preferences through your account, browser settings or available communication controls.",
          ],
        },

        /* =====================================================
           10
        ===================================================== */

        {
          title: "10. Cookies and similar technologies",
          paragraphs: [
            "Aayesha Fashion may use cookies and similar technologies to support essential website functionality and improve the digital shopping experience.",
            "Cookies may help the website remember information between pages, maintain sessions, support account functionality, preserve shopping-bag activity, remember preferences and understand how visitors interact with different areas of the website.",
            "Some cookies or similar technologies may also be used for analytics, performance measurement, security or other functionality provided through the website.",
            "Depending on your browser and the technologies in use, you may be able to control or restrict certain cookies through browser settings or other available controls.",
            "Disabling certain cookies may affect website functionality, including account features, shopping-bag behaviour or other parts of the customer journey.",
          ],
        },

        /* =====================================================
           11
        ===================================================== */

        {
          title: "11. Website analytics and performance",
          paragraphs: [
            "We may use technical and usage information to understand how the website performs and how customers interact with different pages, features and shopping journeys.",
            "This information can help identify pages that are difficult to use, technical problems, performance issues, broken experiences and opportunities to improve navigation and presentation.",
            "Analytics information may be aggregated or otherwise analysed to identify general patterns rather than to understand every individual customer in isolation.",
            "Where third-party analytics or technology providers are used, those providers may process information according to their own applicable terms and privacy practices.",
          ],
        },

        /* =====================================================
           12
        ===================================================== */

        {
          title: "12. Customer care and communications",
          paragraphs: [
            "When you contact Aayesha Fashion, we may retain information contained in your communication so that we can understand your request and provide appropriate assistance.",
            "Customer-care information may include your name, contact information, order number, product information, screenshots, questions, feedback or other information that you choose to provide.",
            "We may use previous communication history where reasonably necessary to understand an ongoing enquiry, avoid asking you to repeatedly provide the same information and resolve support matters efficiently.",
            "Please avoid sending unnecessary sensitive personal information through customer-care channels unless it is specifically requested and appropriate for the matter being handled.",
          ],
        },

        /* =====================================================
           13
        ===================================================== */

        {
          title: "13. Transactional communications",
          paragraphs: [
            "When you place an order or use certain account features, we may need to send transactional or service-related communications.",
            "These communications may relate to order confirmation, payment status, delivery, account verification, password or security events, returns, exchanges, service changes or other information necessary to provide the requested service.",
            "Because these communications can be important to the operation of your account or order, some service communications may continue even if you have chosen not to receive promotional communications.",
          ],
        },

        /* =====================================================
           14
        ===================================================== */

        {
          title: "14. Marketing communications",
          paragraphs: [
            "Where marketing communications are offered and permitted by applicable law, Aayesha Fashion may communicate information about collections, products, launches, offers, editorial content or other brand updates.",
            "Marketing communications are intended to provide information about Aayesha Fashion and are separate from essential transactional messages required to operate an account or fulfil an order.",
            "Where available, you may unsubscribe from promotional email communications through the unsubscribe mechanism included in the relevant message or through other preference controls made available by us.",
            "Even after opting out of marketing communications, you may continue to receive necessary service-related messages connected to your account, orders or transactions.",
          ],
        },

        /* =====================================================
           15
        ===================================================== */

        {
          title: "15. When information may be shared",
          paragraphs: [
            "Aayesha Fashion may share information with third parties where reasonably necessary to operate the website, provide requested services, complete transactions, maintain infrastructure or comply with applicable obligations.",
            "Examples may include payment providers, hosting and infrastructure providers, delivery and logistics partners, communication providers, analytics or technology providers, customer-support services and security or fraud-prevention providers.",
            "Information shared with a service provider should generally be limited to what is reasonably necessary for that provider to perform the relevant service.",
            "Information may also be disclosed where required or permitted by applicable law, regulation, legal process, governmental request or other legitimate legal requirement.",
          ],
        },

        /* =====================================================
           16
        ===================================================== */

        {
          title: "16. Business and legal requirements",
          paragraphs: [
            "Information may need to be retained or disclosed to meet legal, regulatory, accounting, tax, security or operational requirements.",
            "We may also use or disclose information where reasonably necessary to investigate suspected fraud, misuse, unauthorised activity, security incidents, violations of applicable terms or other activity that may affect customers, the website or the business.",
            "Where permitted by applicable law, information may also be used in connection with establishing, exercising or defending legal rights or resolving disputes.",
          ],
        },

        /* =====================================================
           17
        ===================================================== */

        {
          title: "17. Data security",
          paragraphs: [
            "Protecting customer information is an important part of maintaining trust in the Aayesha Fashion experience.",
            "We use reasonable administrative, technical and organisational safeguards designed to reduce the risk of unauthorised access, misuse, alteration, disclosure or destruction of personal information.",
            "Security practices may include access controls, appropriate system protections, monitoring, operational procedures and other measures relevant to the nature of the information and the services being provided.",
            "However, no website, internet transmission, cloud environment or electronic storage system can be guaranteed to be completely secure.",
            "Customers should also take reasonable precautions, including using strong passwords, keeping account credentials private, signing out of shared devices and avoiding sending account information through unsecured or inappropriate channels.",
          ],
        },

        /* =====================================================
           18
        ===================================================== */

        {
          title: "18. Account security",
          paragraphs: [
            "If you maintain an account with Aayesha Fashion, you are responsible for protecting the credentials used to access that account.",
            "You should not share your password, verification codes or other authentication information with another person.",
            "If you believe that your account credentials have been compromised or that someone has accessed your account without permission, you should contact us and take appropriate steps to secure the account as soon as reasonably possible.",
            "We may take additional steps where necessary to verify account ownership before providing access to certain information or making account-related changes.",
          ],
        },

        /* =====================================================
           19
        ===================================================== */

        {
          title: "19. Data retention",
          paragraphs: [
            "Personal information may be retained for as long as reasonably necessary for the purpose for which it was collected and for related legitimate business, operational or legal purposes.",
            "This may include maintaining account records, processing and documenting transactions, responding to disputes, preventing fraud or misuse, maintaining financial and business records, enforcing applicable agreements and meeting legal or regulatory obligations.",
            "Different categories of information may have different retention periods depending on their purpose and the circumstances in which they were collected.",
            "When information is no longer reasonably required for an applicable purpose, it may be deleted, anonymised or otherwise handled in accordance with applicable requirements and operational practices.",
          ],
        },

        /* =====================================================
           20
        ===================================================== */

        {
          title: "20. Your privacy choices",
          paragraphs: [
            "Depending on applicable law and the circumstances, you may have choices or rights relating to certain personal information held by Aayesha Fashion.",
            "These may include requesting access to certain information, asking for inaccurate information to be corrected or updated, requesting deletion where applicable, managing certain marketing communications and asking questions about how information is being used.",
            "Not every request can necessarily be fulfilled in every circumstance. Certain information may need to be retained to meet legal, security, accounting, transaction or other legitimate requirements.",
            "Where appropriate, requests may require reasonable verification of identity before information is disclosed or changes are made.",
          ],
        },

        /* =====================================================
           21
        ===================================================== */

        {
          title: "21. Account deletion",
          paragraphs: [
            "If account deletion functionality is available through the website, you may use the relevant account controls to request deletion of your customer account.",
            "Deleting an account does not necessarily mean that every record associated with previous transactions can be immediately removed. Certain information may need to be retained for legal, accounting, fraud-prevention, dispute-resolution, transaction-record or other legitimate purposes.",
            "Where information must be retained, it may continue to be protected and used only for the purposes for which retention is necessary or otherwise permitted.",
          ],
        },

        /* =====================================================
           22
        ===================================================== */

        {
          title: "22. Third-party websites and services",
          paragraphs: [
            "The Aayesha Fashion website may contain links, integrations or references to third-party websites, payment services, social platforms, delivery services or other external providers.",
            "When you choose to interact directly with a third-party service, that service may collect and process information according to its own privacy policy, terms and practices.",
            "Aayesha Fashion does not control the privacy practices of independent third parties and customers should review the applicable policies before providing information directly to those services.",
          ],
        },

        /* =====================================================
           23
        ===================================================== */

        {
          title: "23. Children's privacy",
          paragraphs: [
            "The Aayesha Fashion website is intended for general ecommerce and fashion use and is not designed to knowingly collect personal information from children without appropriate lawful involvement or consent.",
            "If you believe that a child has provided personal information through the website in circumstances where this was not appropriate, please contact us through the customer-care channels published on the website so that the matter can be reviewed.",
          ],
        },

        /* =====================================================
           24
        ===================================================== */

        {
          title: "24. Changes to this Privacy Policy",
          paragraphs: [
            "Privacy practices may evolve as Aayesha Fashion introduces new services, changes website functionality, works with different service providers, adopts new technologies or responds to changes in applicable requirements.",
            "For this reason, this Privacy Policy may be updated from time to time.",
            "When changes are made, the revised policy will be published on the website and the revision date may be updated to help customers identify the current version.",
            "We encourage customers to review this page periodically, particularly when using new features or services on the website.",
          ],
        },

        /* =====================================================
           25
        ===================================================== */

        {
          title: "25. Questions about privacy",
          paragraphs: [
            "If you have a question about this Privacy Policy, want to understand how your information is handled, or wish to make a privacy-related request, please contact Aayesha Fashion through the customer-care contact details published on the website.",
            "When contacting us about a specific account, order or privacy request, providing relevant information such as your registered email address or order number may help us identify the appropriate records and respond more efficiently.",
          ],
        },

        /* =====================================================
           26
        ===================================================== */

        {
          title: "26. Our approach to privacy",
          paragraphs: [
            "Privacy is ultimately about trust.",
            "We want customers to feel comfortable understanding what information may be involved when they browse, shop and interact with Aayesha Fashion.",
            "Our approach is therefore based on clarity, reasonable data practices, appropriate safeguards and respect for customer choices.",
            "As Aayesha Fashion continues to develop, we intend for the privacy experience to evolve alongside the wider customer experience: considered, transparent and designed with the person behind every order in mind.",
          ],
        },
      ]}
    />
  );
}