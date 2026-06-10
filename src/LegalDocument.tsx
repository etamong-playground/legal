import type { LegalDocMeta, LegalVersion } from "./model";
import { effectiveVersion } from "./helpers";

/**
 * Renders the titled sections of a legal document's effective version, with
 * stable deep-link anchors: `${doc.docAnchor}` on the article and
 * `${doc.docAnchor}-${section.id}` on each heading. Pass `version` to render a
 * specific version instead of the effective one.
 *
 * Each section renders its Markdown `body` as text; the deprecated `content`
 * (app JSX) is used only as a fallback when `body` is empty. Markdown is not
 * parsed here — the public hub renders Markdown server-side; this component is
 * for in-app JSX docs.
 */
export function LegalDocument({
  doc,
  version,
  className,
}: {
  doc: LegalDocMeta;
  version?: LegalVersion;
  className?: string;
}) {
  const v = version ?? effectiveVersion(doc.versions);
  return (
    <article
      id={doc.docAnchor}
      className={className ? `legal-document ${className}` : "legal-document"}
    >
      {v.sections.map((section) => (
        <section key={section.id} className="legal-section">
          <h2 id={`${doc.docAnchor}-${section.id}`} className="legal-section-title">
            {section.title}
          </h2>
          <div className="legal-section-body">{section.content ?? section.body}</div>
        </section>
      ))}
    </article>
  );
}
