import type { LegalVersion } from "./model";

/**
 * Version picker / 이전 버전 list. Controlled: the parent owns `selectedIdx`
 * and updates it from `onSelect`. Renders nothing for a single-version doc.
 */
export function VersionHistory({
  versions,
  selectedIdx,
  onSelect,
  className,
}: {
  versions: LegalVersion[];
  selectedIdx: number;
  onSelect: (idx: number) => void;
  className?: string;
}) {
  if (versions.length <= 1) return null;

  return (
    <div className={className ? `legal-history ${className}` : "legal-history"}>
      <h3 className="legal-history-title">이전 버전</h3>
      <ul className="legal-history-list">
        {versions.map((v, i) => (
          <li key={v.version}>
            <button
              type="button"
              onClick={() => onSelect(i)}
              aria-current={i === selectedIdx ? "true" : undefined}
              className={
                i === selectedIdx ? "legal-history-item is-selected" : "legal-history-item"
              }
            >
              v{v.version} ({v.effectiveDate})
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
