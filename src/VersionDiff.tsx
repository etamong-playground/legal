import type { VersionChange } from "./model";
import { renderHighlighted } from "./highlight";

const badgeLabel: Record<VersionChange["type"], string> = {
  added: "추가",
  removed: "삭제",
  changed: "변경",
};

/**
 * 3-column "변경 전 / 변경 후" table for the diff between two versions.
 * `==highlight==` spans in before/after text are marked. Styleless — themed via
 * the `legal-*` classes / CSS variables in the shipped stylesheet.
 */
export function VersionDiff({
  changes,
  fromVersion,
  toVersion,
  className,
}: {
  changes: VersionChange[];
  fromVersion: string;
  toVersion: string;
  className?: string;
}) {
  return (
    <div className={className ? `legal-diff ${className}` : "legal-diff"}>
      <h3 className="legal-diff-title">
        주요 변경 사항 (v{fromVersion} → v{toVersion})
      </h3>
      <div className="legal-diff-scroll">
        <table className="legal-diff-table">
          <thead>
            <tr>
              <th>구분</th>
              <th>변경 전</th>
              <th>변경 후</th>
            </tr>
          </thead>
          <tbody>
            {changes.map((c, i) => (
              <tr key={i}>
                <td className="legal-diff-section">
                  <span>{c.section}</span>
                  <span className={`legal-badge legal-badge--${c.type}`}>{badgeLabel[c.type]}</span>
                </td>
                <td>
                  {c.type === "added" ? (
                    <span className="legal-diff-empty">—</span>
                  ) : (
                    renderHighlighted(c.before ?? "")
                  )}
                </td>
                <td>
                  {c.type === "removed" ? (
                    <span className="legal-diff-empty">—</span>
                  ) : (
                    renderHighlighted(c.after ?? "")
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
