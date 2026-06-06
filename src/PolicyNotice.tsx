import { useState, type ReactNode } from "react";
import type { LegalDocMeta } from "./model";
import { upcomingVersion } from "./helpers";

/** Router-agnostic link renderer. Defaults to a plain anchor. */
export type RenderLink = (href: string, children: ReactNode) => ReactNode;

const defaultRenderLink: RenderLink = (href, children) => <a href={href}>{children}</a>;

/**
 * Site-wide advance-notice banner (사이트 공통 사전공시 배너): shows when any
 * document has an announced-but-not-yet-effective version. Dismissible per
 * pending-version-set (so a new announcement re-shows it). Renders nothing when
 * nothing is pending.
 *
 * Router-agnostic: pass `renderLink` to use the app's Link (next/link,
 * react-router) instead of a plain <a>.
 *
 * Interactive (uses state) — mount inside a client boundary (Next.js "use client").
 */
export function PolicyNotice({
  docs,
  hrefFor,
  today,
  renderLink = defaultRenderLink,
  storage,
  className,
}: {
  docs: LegalDocMeta[];
  /** Maps a document to its route, e.g. (doc) => `/${doc.kind}`. */
  hrefFor: (doc: LegalDocMeta) => string;
  today?: string;
  renderLink?: RenderLink;
  /** Persistence for the dismissed flag. Defaults to localStorage when available. */
  storage?: Pick<Storage, "getItem" | "setItem">;
  className?: string;
}) {
  const store =
    storage ?? (typeof localStorage !== "undefined" ? localStorage : undefined);

  const pending = docs
    .map((doc) => ({ doc, up: upcomingVersion(doc.versions, today) }))
    .filter((x): x is { doc: LegalDocMeta; up: NonNullable<typeof x.up> } => x.up != null);

  const dismissKey = "legal-policy-notice:" + pending.map((x) => `${x.doc.kind}@${x.up.version}`).join(",");
  const [dismissed, setDismissed] = useState(() => store?.getItem(dismissKey) === "1");

  if (pending.length === 0 || dismissed) return null;

  return (
    <div className={className ? `legal-policy-notice ${className}` : "legal-policy-notice"}>
      <span className="legal-policy-notice-text">
        📢{" "}
        {pending.map((x, i) => (
          <span key={x.doc.kind}>
            {i > 0 ? " · " : ""}
            {renderLink(hrefFor(x.doc), x.doc.title)} {x.up.effectiveDate}부터 변경 예정
          </span>
        ))}
      </span>
      <button
        type="button"
        className="legal-policy-notice-dismiss"
        aria-label="닫기"
        onClick={() => {
          store?.setItem(dismissKey, "1");
          setDismissed(true);
        }}
      >
        ✕
      </button>
    </div>
  );
}
