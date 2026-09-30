"use client";

import { useSyncExternalStore } from "react";

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
  /*
   * false on the server and during hydration, true afterwards, so
   * the sanitised HTML (browser-only) never causes a mismatch.
   */
  const isClient = useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false,
  );

  if (
    content.descriptionFormat === "html" &&
    typeof content.richContent === "string"
  ) {
    return (
      <div className="product-content product-content--html">
        <div
          className="product-content__rich-html"
          dangerouslySetInnerHTML={{
            __html: isClient
              ? sanitizeHtml(content.richContent)
              : "",
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
function subscribeNoop() {
  return () => {};
}

const ALLOWED_TAGS = new Set([
  "a","b","blockquote","br","code","div","em","h1","h2","h3","h4",
  "h5","h6","hr","i","img","li","ol","p","pre","small","span",
  "strong","sub","sup","table","tbody","td","th","thead","tr","u",
  "ul",
]);

const ALLOWED_ATTRIBUTES = new Set([
  "alt","href","src","title","target","rel","colspan","rowspan",
]);

function isSafeUrl(value: string) {
  /*
   * Browsers ignore tabs/newlines/control characters inside a URL
   * scheme ("java\tscript:"), so strip them before testing.
   */
  const cleaned = value
    .replace(/[\u0000-\u0020\u007f-\u009f]/g, "")
    .toLowerCase();

  return (
    cleaned === "" ||
    cleaned.startsWith("/") ||
    cleaned.startsWith("#") ||
    cleaned.startsWith("http://") ||
    cleaned.startsWith("https://") ||
    cleaned.startsWith("mailto:") ||
    cleaned.startsWith("tel:")
  );
}

/*
 * Allow-list sanitiser. It only runs in the browser (DOMParser).
 * On the server it returns an empty string instead of the raw
 * markup, so unsanitised HTML is never written into the initial
 * document.
 */
function sanitizeHtml(html: string) {
  if (typeof window === "undefined") {
    return "";
  }

  const parsed = new DOMParser().parseFromString(
    html,
    "text/html",
  );

  Array.from(parsed.body.querySelectorAll("*")).forEach(
    (element) => {
      const tag = element.tagName.toLowerCase();

      if (!ALLOWED_TAGS.has(tag)) {
        /* Drop the element, keep its readable text. */
        if (
          ["script","style","iframe","object","embed","form",
           "input","textarea","button","svg","math","link",
           "meta","base","noscript","template"].includes(tag)
        ) {
          element.remove();
        } else {
          element.replaceWith(
            ...Array.from(element.childNodes),
          );
        }

        return;
      }

      Array.from(element.attributes).forEach((attribute) => {
        const name = attribute.name.toLowerCase();

        if (!ALLOWED_ATTRIBUTES.has(name)) {
          element.removeAttribute(attribute.name);
          return;
        }

        if (
          (name === "href" || name === "src") &&
          !isSafeUrl(attribute.value)
        ) {
          element.removeAttribute(attribute.name);
        }
      });

      if (tag === "a") {
        element.setAttribute("rel", "noopener noreferrer");
      }
    },
  );

  return parsed.body.innerHTML;
}
