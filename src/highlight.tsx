import type { ReactNode } from "react";

/**
 * Render text with `==highlight==` spans wrapped in <mark class="legal-mark">,
 * and bare "\n" turned into <br/>. Used by the diff table to call out the exact
 * words that changed between two versions.
 */
export function renderHighlighted(text: string): ReactNode {
  return text.split(/(==.*?==)/g).map((part, i) => {
    if (part.startsWith("==") && part.endsWith("==") && part.length >= 4) {
      return (
        <mark key={i} className="legal-mark">
          {part.slice(2, -2)}
        </mark>
      );
    }
    if (part.includes("\n")) {
      const lines = part.split("\n");
      return lines.map((line, j) => (
        <span key={`${i}-${j}`}>
          {line}
          {j < lines.length - 1 && <br />}
        </span>
      ));
    }
    return part;
  });
}
