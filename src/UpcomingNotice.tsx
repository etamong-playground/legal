import type { LegalVersion } from "./model";

/**
 * Per-document advance-notice card (공시): "v2.0이 YYYY-MM-DD부터 시행됩니다".
 * Render it on a document page when `upcomingVersion(doc.versions)` is non-null.
 * `onPreview` (optional) lets the page switch the shown version to the upcoming one.
 */
export function UpcomingNotice({
  docTitle,
  version,
  onPreview,
  className,
}: {
  docTitle: string;
  version: LegalVersion;
  onPreview?: () => void;
  className?: string;
}) {
  return (
    <div className={className ? `legal-notice ${className}` : "legal-notice"}>
      <p className="legal-notice-text">
        📢 <b>{docTitle}</b> 변경 예정 — <b>{version.effectiveDate}</b> 시행 (v{version.version}).
        {version.summary ? ` ${version.summary}` : ""}
        {version.adverse
          ? " 이용자에게 불리/중대한 변경으로 시행 30일 전부터 공지합니다."
          : ` (공고일 ${version.publishedDate})`}
        {onPreview && (
          <>
            {" "}
            <button type="button" className="legal-notice-preview" onClick={onPreview}>
              변경 예정본 보기
            </button>
          </>
        )}
      </p>
    </div>
  );
}
