"use client";

import type {
  ProductContent,
  ProductContentBlock,
} from "@/types/product";

import "./ProductContentRenderer.css";

interface ProductContentRendererProps {
  content: ProductContent;
}

export function ProductContentRenderer({
  content,
}: ProductContentRendererProps) {
  if (
    content.descriptionFormat === "html" &&
    typeof content.richContent === "string"
  ) {
    return (
      <div className="product-content product-content--html">
        <div
          className="product-content__rich-html"
          dangerouslySetInnerHTML={{
            __html: sanitizeHtml(content.richContent),
          }}
        />
      </div>
    );
  }

  if (
    content.descriptionFormat === "rich" &&
    Array.isArray(content.richContent)
  ) {
    return <RichBlocks blocks={content.richContent} />;
  }

  return (
    <div className="product-content product-content--plain">
      {content.description && (
        <p className="product-content__paragraph">
          {content.description}
        </p>
      )}
    </div>
  );
}

function RichBlocks({
  blocks,
}: {
  blocks: ProductContentBlock[];
}) {
  return (
    <div className="product-content product-content--rich">
      {blocks.map((block, index) => {
        switch (block.type) {
          case "heading":
            return (
              <h3
                key={index}
                className="product-content__heading"
              >
                {block.content}
              </h3>
            );

          case "paragraph":
            return (
              <p
                key={index}
                className="product-content__paragraph"
              >
                {block.content}
              </p>
            );

          case "quote":
            return (
              <blockquote
                key={index}
                className="product-content__quote"
              >
                {block.content}
              </blockquote>
            );

          case "list":
            return (
              <ul
                key={index}
                className="product-content__list"
              >
                {(Array.isArray(block.content)
                  ? block.content
                  : [block.content]
                ).map((item, itemIndex) => (
                  <li
                    key={`${index}-${itemIndex}`}
                    className="product-content__list-item"
                  >
                    <span
                      className="product-content__list-marker"
                      aria-hidden="true"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            );

          case "divider":
            return (
              <div
                key={index}
                className="product-content__divider"
                role="separator"
              />
            );

          default:
            return null;
        }
      })}
    </div>
  );
}

/**
 * Lightweight defensive HTML sanitization.
 * For production-grade CMS HTML, replacing this with DOMPurify
 * is recommended.
 */
function sanitizeHtml(html: string) {
  if (typeof window === "undefined") {
    return html;
  }

  const parser = new DOMParser();
  const document = parser.parseFromString(
    html,
    "text/html",
  );

  document
    .querySelectorAll(
      "script, iframe, object, embed, form, input, textarea, button",
    )
    .forEach((node) => node.remove());

  document.querySelectorAll("*").forEach((element) => {
    Array.from(element.attributes).forEach(
      (attribute) => {
        if (
          attribute.name
            .toLowerCase()
            .startsWith("on") ||
          attribute.value
            .toLowerCase()
            .includes("javascript:")
        ) {
          element.removeAttribute(
            attribute.name,
          );
        }
      },
    );
  });

  return document.body.innerHTML;
}