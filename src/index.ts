export type {
  LegalDocKind,
  LegalDocMeta,
  LegalSection,
  LegalVersion,
  VersionChange,
} from "./model";
export { todayISO, effectiveVersion, upcomingVersion } from "./helpers";
export { renderHighlighted } from "./highlight";
export { LegalDocument } from "./LegalDocument";
export { VersionDiff } from "./VersionDiff";
export { VersionHistory } from "./VersionHistory";
export { UpcomingNotice } from "./UpcomingNotice";
export { PolicyNotice, type RenderLink } from "./PolicyNotice";
