/*
 * JSON inside <script> must not contain a literal "<": a product
 * name like "</script><img onerror=...>" would otherwise close the
 * tag early and inject markup. \u003c is identical JSON.
 */
export function serializeJsonLd(value: unknown) {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}
