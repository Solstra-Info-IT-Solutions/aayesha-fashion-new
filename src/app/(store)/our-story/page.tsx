import type { Metadata } from "next";
import { ContentPage } from "@/components/content/content-page";

import "./OurStoryPage.css";

export const metadata: Metadata = {
  title: "Our Story | Aayesha Fashion",
  description:
    "Discover the story, philosophy and design approach behind Aayesha Fashion — a contemporary Indian fashion house creating elegant, refined and wearable styles for the modern woman.",
  alternates: {
    canonical: "/our-story",
  },
};

export default function OurStoryPage() {
  return (
    <main className="our-story-page">
      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="our-story-page__intro">
        <div className="our-story-page__intro-inner">
          <div className="our-story-page__intro-mark">
            <span>AA</span>
          </div>

          <p className="our-story-page__intro-eyebrow">
            The House · Aayesha Fashion
          </p>

          <h1 className="our-story-page__intro-title">
            Rooted in India.
            <br />
            Refined for today.
          </h1>

          <div className="our-story-page__intro-bottom">
            <span className="our-story-page__intro-rule" />

            <p>
              A contemporary expression of
              Indian fashion, created around
              elegance, individuality and
              everyday life.
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          BRAND STORY
      ===================================================== */}

      <div className="our-story-page__content">
        <ContentPage
          eyebrow="The House"
          title="Our Story"
          description="Aayesha Fashion is built around a simple belief: Indian fashion can feel deeply rooted and distinctly modern at the same time. Our approach brings together the familiarity of Indian silhouettes with a contemporary understanding of colour, proportion, styling and the way women dress today."
          highlights={[
            {
              label: "Our perspective",
              value:
                "Modern Indian elegance",
            },
            {
              label: "Our design language",
              value:
                "Graceful, refined and wearable",
            },
            {
              label: "Our promise",
              value:
                "Thoughtful fashion without unnecessary excess",
            },
            {
              label: "Our focus",
              value:
                "Pieces that become part of your wardrobe",
            },
          ]}
          sections={[
            /* =================================================
               01
            ================================================= */

            {
              title:
                "Aayesha Fashion — a contemporary Indian fashion house",
              paragraphs: [
                "Aayesha Fashion is an expression of contemporary Indian femininity. At the heart of the brand is a desire to bring together the cultural richness of Indian dressing with the simplicity and versatility expected from modern wardrobes.",
                "Indian fashion has always had an extraordinary visual vocabulary. Silhouettes, textiles, colours, embroidery, draping and craftsmanship have evolved over generations, creating an identity that is instantly recognisable while remaining remarkably diverse.",
                "We see that heritage not as something fixed in the past, but as a foundation from which new expressions can be created. Aayesha Fashion approaches Indian dressing with respect for its familiar language while allowing room for modern proportions, styling choices and contemporary sensibilities.",
                "The result is fashion that feels connected to its roots without being limited by them.",
              ],
            },

            /* =================================================
               02
            ================================================= */

            {
              title:
                "Where tradition meets modern life",
              paragraphs: [
                "The way women dress today is different from the way wardrobes were built in the past. One garment may be styled in several different ways. An outfit purchased for a celebration may later become part of a festive wardrobe. A traditional silhouette may be paired with contemporary accessories. A familiar colour may take on an entirely different character through styling.",
                "This changing relationship with clothing is central to our perspective.",
                "We believe Indian fashion can remain recognisably Indian while fitting naturally into contemporary life. Tradition can exist alongside experimentation. Familiar silhouettes can be refined through proportion. Classic colours can be interpreted through new combinations. Occasion dressing can become more versatile.",
                "Aayesha Fashion therefore looks at clothing not only as an individual product, but as part of the wider context in which a woman actually lives, moves, celebrates and expresses herself.",
              ],
            },

            /* =================================================
               03
            ================================================= */

            {
              title:
                "The idea behind Aayesha",
              paragraphs: [
                "The idea behind Aayesha is intentionally simple: create fashion that allows elegance to feel natural.",
                "We are interested in the moments when clothing does not overpower the person wearing it. Instead, the garment complements her presence. It gives her confidence without requiring constant attention. It becomes part of the way she presents herself rather than becoming the entire statement.",
                "That philosophy influences everything from the silhouettes we highlight to the way collections are presented. We are drawn towards pieces that have character, but we also value balance, versatility and ease.",
                "Aayesha is therefore not built around the idea of dressing for one particular kind of woman. It is about creating a fashion environment where different personalities can find their own interpretation of Indian elegance.",
              ],
            },

            /* =================================================
               04
            ================================================= */

            {
              title:
                "Designed around the woman wearing it",
              paragraphs: [
                "A garment exists differently on a hanger, in a photograph and on the woman who actually wears it. We believe the last of these is the most important.",
                "A beautiful piece should feel natural once it becomes part of a real wardrobe. It should allow movement, offer styling possibilities and work with the confidence and personality of the person wearing it.",
                "That is why our perspective goes beyond visual appeal. We consider how silhouettes are perceived, how colours interact with different styling choices, how a piece can transition between occasions and how easily it can become part of a woman's existing wardrobe.",
                "The objective is not to dictate one way of wearing something. Instead, we want each garment to provide a starting point from which the wearer can create her own interpretation.",
                "Because personal style begins where instructions end.",
              ],
            },

            /* =================================================
               05
            ================================================= */

            {
              title:
                "Our design philosophy",
              paragraphs: [
                "Our design philosophy begins with balance.",
                "Balance between traditional and contemporary. Balance between detail and simplicity. Balance between statement and restraint. Balance between occasion dressing and everyday wearability.",
                "We are drawn towards silhouettes that have a clear sense of proportion and details that feel intentional rather than added simply for decoration.",
                "A neckline can influence the entire character of an outfit. A sleeve can change its sense of movement. A colour can make a familiar silhouette feel entirely new. Embroidery can create depth without overwhelming the garment.",
                "These details matter because they contribute to the overall experience of the piece.",
                "Rather than designing around every passing trend, we aim for a visual language that can remain relevant beyond a single season. Trends can influence the environment of fashion, but personal style needs something more lasting to build upon.",
              ],
            },

            /* =================================================
               06
            ================================================= */

            {
              title:
                "The Aayesha aesthetic",
              paragraphs: [
                "The visual language of Aayesha Fashion is deliberately warm, feminine and understated.",
                "Soft rose tones, earthy neutrals, deeper browns and carefully balanced accents create a world where the clothing remains central. The palette is intended to feel sophisticated without becoming distant and feminine without becoming overly delicate.",
                "The same philosophy extends to our visual presentation.",
                "We believe fashion photography should give clothing room to breathe. Composition, light, proportion, negative space and styling all influence how a garment is perceived.",
                "Instead of filling every frame with decoration, we prefer imagery that allows the details of the clothing to communicate naturally.",
                "This creates an editorial environment where the product remains the focus while the overall experience still feels distinctive and considered.",
              ],
            },

            /* =================================================
               07
            ================================================= */

            {
              title:
                "A quieter kind of luxury",
              paragraphs: [
                "Luxury does not always need to be loud.",
                "Sometimes it exists in the way a fabric falls. Sometimes it is visible in the balance of a silhouette, the placement of a detail or the relationship between colours. Sometimes it is something that becomes noticeable only after looking at a garment more closely.",
                "For us, restraint is not the absence of design. It is a form of design in itself.",
                "A quieter approach gives the garment space to communicate. It also gives the woman wearing it space to be seen.",
                "This idea influences the way we think about fashion, photography, typography, colour and digital experience. We want the entire Aayesha environment to feel considered rather than crowded.",
                "The intention is to create an experience that feels premium because of its attention to detail, not because of unnecessary decoration.",
              ],
            },

            /* =================================================
               08
            ================================================= */

            {
              title:
                "Indian fashion, interpreted for today",
              paragraphs: [
                "Indian fashion is incredibly diverse. There is no single definition of what contemporary Indian dressing should look like.",
                "For some women, it may mean a familiar traditional silhouette. For another, it may mean a modern interpretation of an ethnic garment. For someone else, it may simply be a colour, fabric, motif or styling detail that connects an outfit to Indian culture.",
                "We embrace that diversity.",
                "Our approach is not about replacing traditional dressing with contemporary fashion. It is about allowing both to exist together.",
                "A modern wardrobe can contain heritage-inspired pieces, contemporary silhouettes, festive garments, versatile separates and expressive statement looks.",
                "That freedom is important because fashion becomes meaningful when it reflects the individuality of the person wearing it.",
              ],
            },

            /* =================================================
               09
            ================================================= */

            {
              title:
                "From occasion dressing to everyday expression",
              paragraphs: [
                "Occasions have always played an important role in Indian fashion. Festivals, weddings, family gatherings, celebrations and cultural moments naturally create opportunities to dress differently.",
                "But modern wardrobes are becoming more fluid.",
                "Women increasingly want clothing that can move between different moments. A piece may be purchased for an occasion but later styled in a more understated way. A garment initially considered festive may become part of a personal wardrobe rotation.",
                "We believe this versatility adds value to fashion.",
                "Instead of thinking about clothing only in terms of where it can be worn, we also consider how it can be styled, restyled and experienced over time.",
                "The most meaningful pieces are often not the ones worn once. They are the ones that continue to find their way back into our lives.",
              ],
            },

            /* =================================================
               10
            ================================================= */

            {
              title:
                "Building a wardrobe, not just a collection",
              paragraphs: [
                "A collection can be viewed as a group of products. A wardrobe is something much more personal.",
                "A wardrobe reflects routines, celebrations, preferences, memories and changing versions of ourselves. Some pieces become dependable favourites. Others are reserved for special moments. Some are discovered unexpectedly and become much more important than originally imagined.",
                "Our intention is to create pieces that can participate in that journey.",
                "This means thinking beyond the immediate visual impact of a garment and considering whether it has enough character to feel special and enough versatility to remain useful.",
                "A considered wardrobe does not necessarily need more clothing. It needs pieces that feel right.",
              ],
            },

            /* =================================================
               11
            ================================================= */

            {
              title:
                "The importance of colour",
              paragraphs: [
                "Colour is one of the most powerful ways fashion communicates emotion.",
                "Indian fashion has a particularly rich relationship with colour, from deep jewel tones and festive reds to soft neutrals, earthy shades and contemporary pastels.",
                "At Aayesha, colour is considered not only for visual impact but also for versatility and mood.",
                "A softer tone can create an understated expression. A deeper shade can introduce drama. A muted palette can create sophistication, while a more expressive colour can make a familiar silhouette feel celebratory.",
                "We see colour as part of styling rather than simply a product characteristic. The same garment can feel entirely different depending on the colours and accessories around it.",
              ],
            },

            /* =================================================
               12
            ================================================= */

            {
              title:
                "The role of detail",
              paragraphs: [
                "Details often determine whether a garment feels ordinary or distinctive.",
                "We are interested in the details that contribute to the identity of a piece without overwhelming it. Embroidery, trims, textures, silhouettes, sleeves, necklines and finishing elements all have the ability to change how a garment is experienced.",
                "The most effective details are not necessarily the largest ones.",
                "A subtle texture can create depth. A carefully placed embellishment can draw attention. A balanced neckline can change the proportions of an outfit. A refined finish can elevate the entire piece.",
                "Our approach is therefore based on intention. Every visible element should contribute to the character of the garment.",
              ],
            },

            /* =================================================
               13
            ================================================= */

            {
              title:
                "Our approach to quality",
              paragraphs: [
                "Quality begins with attention.",
                "It is visible in the way a garment is presented, the clarity of its product information, the details that complete the design and the confidence a customer feels when making a purchase.",
                "We believe customers deserve enough information to make informed choices.",
                "That is why product presentation is an important part of the Aayesha experience. Product imagery, descriptions, sizing information and garment details should work together rather than leave the customer guessing.",
                "A premium shopping experience is not only about beautiful visuals. It is also about clarity, consistency and trust.",
                "Our goal is to make the experience feel considered from the first product discovery through the moment the garment becomes part of the customer's wardrobe.",
              ],
            },

            /* =================================================
               14
            ================================================= */

            {
              title:
                "A thoughtful digital experience",
              paragraphs: [
                "Today, the relationship between fashion and technology is inseparable. For many customers, the first interaction with a fashion brand happens through a screen.",
                "That means the digital experience becomes part of the brand itself.",
                "At Aayesha Fashion, the website is designed to feel like an extension of the fashion house: editorial, warm, intuitive and focused on the clothing.",
                "Every interaction should support discovery rather than create unnecessary friction. Product images should be easy to understand. Information should be accessible. Navigation should feel natural. Checkout should be clear. Account and order information should remain easy to access.",
                "We believe technology should quietly support the fashion experience rather than compete with it.",
              ],
            },

            /* =================================================
               15
            ================================================= */

            {
              title:
                "The experience beyond the garment",
              paragraphs: [
                "A fashion brand is not defined only by what it sells.",
                "It is also defined by how it communicates, how it presents information and how it responds when customers need assistance.",
                "For us, customer experience is an important part of the brand promise.",
                "Questions about sizing, product details, orders, delivery or returns are part of the natural journey of shopping online. Clear information and helpful communication can make that journey significantly more comfortable.",
                "We want Aayesha Fashion to feel approachable while maintaining the attention to detail expected from a premium fashion brand.",
                "Elegance should exist in the experience as much as it exists in the clothing.",
              ],
            },

            /* =================================================
               16
            ================================================= */

            {
              title:
                "Fashion and personal expression",
              paragraphs: [
                "Fashion is deeply personal because clothing is one of the most visible ways we communicate who we are.",
                "The same garment can tell completely different stories depending on the person wearing it.",
                "One woman may style a piece minimally. Another may layer it with jewellery, accessories and colour. Someone may choose it for a celebration, while someone else may find a way to incorporate it into everyday dressing.",
                "There is no single correct interpretation.",
                "Aayesha Fashion is designed with that freedom in mind. We provide the garment; the woman gives it meaning.",
                "That is why personal style remains at the centre of our philosophy.",
              ],
            },

            /* =================================================
               17
            ================================================= */

            {
              title:
                "The memories we wear",
              paragraphs: [
                "Clothing often becomes part of memory without us realising it.",
                "A particular outfit may become associated with a festival. A colour may remind us of a celebration. A garment may become connected to a family gathering, an important evening or a new chapter in life.",
                "These associations are one of the reasons fashion can feel so personal.",
                "We want Aayesha pieces to have the opportunity to become part of those moments.",
                "Not because every garment needs to be dramatic, but because even simple pieces can become meaningful when they accompany us through experiences that matter.",
                "A wardrobe is ultimately a record of life as much as it is a collection of clothing.",
              ],
            },

            /* =================================================
               18
            ================================================= */

            {
              title:
                "Our belief in versatility",
              paragraphs: [
                "Versatility is one of the most valuable qualities a garment can have.",
                "A versatile piece does not have to look the same every time it is worn. Its character can change through styling, accessories, footwear, layering and occasion.",
                "This creates more possibilities within the wardrobe.",
                "We are interested in fashion that allows experimentation while maintaining a strong sense of identity.",
                "A piece can be dressed up, simplified, styled differently or combined with garments already owned.",
                "The goal is not simply to encourage more purchases. It is to help customers see more possibilities in the pieces they choose.",
              ],
            },

            /* =================================================
               19
            ================================================= */

            {
              title:
                "What modern Indian femininity means to us",
              paragraphs: [
                "Modern Indian femininity cannot be reduced to one silhouette, one colour palette or one style of dressing.",
                "It can be traditional or contemporary. Soft or expressive. Minimal or richly detailed. It can change from one day to another.",
                "What connects these different expressions is confidence and individuality.",
                "For Aayesha, modern femininity means having the freedom to choose how tradition becomes part of your personal style.",
                "It means being able to celebrate heritage without feeling restricted by expectations. It means being able to explore modern fashion without losing the cultural references that feel meaningful.",
                "Most importantly, it means allowing the woman herself to remain at the centre.",
              ],
            },

            /* =================================================
               20
            ================================================= */

            {
              title:
                "What Aayesha stands for",
              paragraphs: [
                "At its heart, Aayesha Fashion stands for a modern interpretation of Indian elegance.",
                "We stand for clothing that respects its cultural roots while remaining relevant to contemporary wardrobes.",
                "We stand for thoughtful design rather than unnecessary excess.",
                "We stand for femininity that is confident rather than performative.",
                "We stand for fashion that can feel special while remaining wearable.",
                "We stand for an experience where beautiful presentation is supported by clear information and considered service.",
                "And above all, we stand for the idea that personal style should belong to the woman wearing it.",
              ],
            },

            /* =================================================
               21
            ================================================= */

            {
              title:
                "Looking ahead",
              paragraphs: [
                "Aayesha Fashion is ultimately an evolving idea.",
                "Fashion changes. Women change. The way we shop, style and experience clothing changes with them.",
                "What should remain constant is the underlying philosophy: respect the richness of Indian fashion, approach it with a contemporary perspective and create pieces that allow individuality to remain at the centre.",
                "As the brand continues to grow, the intention is to keep building an environment where clothing feels considered, imagery feels inspiring, information feels clear and the overall experience feels unmistakably Aayesha.",
                "The future of the brand is not about becoming louder. It is about becoming more refined, more thoughtful and more connected to the women who choose to wear it.",
              ],
            },
          ]}
        />
      </div>

      {/* =====================================================
          BRAND PRINCIPLES
      ===================================================== */}

      <section className="our-story-page__principles">
        <div className="our-story-page__principles-inner">
          <div className="our-story-page__principles-heading">
            <div>
              <p className="our-story-page__section-eyebrow">
                The Aayesha Perspective
              </p>

              <p className="our-story-page__principles-small">
                A philosophy of dressing,
                design and individuality.
              </p>
            </div>

            <h2 className="our-story-page__principles-title">
              What guides
              <br />
              everything we create.
            </h2>
          </div>

          <div className="our-story-page__principles-grid">
            <article className="our-story-page__principle">
              <span>01</span>

              <h3>Rooted</h3>

              <p>
                Inspired by the richness of
                Indian fashion, cultural
                references and the beauty of
                familiar silhouettes.
              </p>
            </article>

            <article className="our-story-page__principle">
              <span>02</span>

              <h3>Refined</h3>

              <p>
                Guided by balance, proportion,
                thoughtful details and a
                preference for considered
                design.
              </p>
            </article>

            <article className="our-story-page__principle">
              <span>03</span>

              <h3>Wearable</h3>

              <p>
                Created with real wardrobes,
                real occasions and the
                possibility of repeat wear in
                mind.
              </p>
            </article>

            <article className="our-story-page__principle">
              <span>04</span>

              <h3>Personal</h3>

              <p>
                Designed to leave space for
                every woman to interpret,
                style and make each piece her
                own.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* =====================================================
          CLOSING
      ===================================================== */}

      <section className="our-story-page__closing">
        <div className="our-story-page__closing-inner">
          <p className="our-story-page__closing-eyebrow">
            The Aayesha Philosophy
          </p>

          <h2 className="our-story-page__closing-title">
            Elegance does not need
            <br />
            to ask for attention.
          </h2>

          <div className="our-story-page__closing-line" />

          <p className="our-story-page__closing-copy">
            It lives in the details, the
            proportions and the way a
            piece makes you feel.
          </p>
        </div>
      </section>
    </main>
  );
}