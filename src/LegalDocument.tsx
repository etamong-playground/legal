import type { LegalVersion } from "./model";

/** Renders the body (titled sections) of a single legal-document version. */
export function LegalDocument({
  version,
  className,
}: {
  version: LegalVersion;
  className?: string;
}) {
  return (
    <div className={className ? `legal-document ${className}` : "legal-document"}>
      {version.sections.map((section) => (
        <section key={section.title} className="legal-section">
          <h2 className="legal-section-title">{section.title}</h2>
          <div className="legal-section-body">{section.content}</div>
        </section>
      ))}
    </div>
  );
}
