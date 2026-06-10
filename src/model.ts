import type { ReactNode } from "react";

/**
 * The kind of legal document. Apps typically ship terms + privacy; `identity`
 * is the app-agnostic SSO/identity statement (L1) used as the single privacy URL
 * on a Google OAuth consent screen — it never enumerates downstream apps.
 */
export type LegalDocKind = "terms" | "privacy" | "identity";

/**
 * Whether a document is exposed on the public hub. Anything not explicitly
 * `public` stays off the hub; create flows default to `internal`.
 */
export type LegalVisibility = "public" | "internal";

/**
 * One row of a version-to-version diff table (변경 전 / 변경 후).
 * `before`/`after` support `==highlight==` markup — the renderer wraps the
 * delimited span in a <mark>.
 */
export interface VersionChange {
  /** Section label this change belongs to (e.g. "제4조 (보존)"). */
  section: string;
  type: "added" | "removed" | "changed";
  /** Prior text. Omit for `added`. May contain `==highlight==` spans. */
  before?: string;
  /** New text. Omit for `removed`. May contain `==highlight==` spans. */
  after?: string;
}

/**
 * A titled section of a legal document.
 *
 * `id` is a stable deep-link slug — the public hub renders the anchor
 * `#${docAnchor}-${id}`; assign it once and never rename or reuse it (app
 * footers link to it). `body` is serializable Markdown, which the server-side
 * hub renders (it has no app bundle). `content` (app JSX) is a deprecated
 * fallback the React `LegalDocument` uses only when `body` is empty.
 */
export interface LegalSection {
  /** Stable slug for deep-linking. Hub anchor is `${docAnchor}-${id}`. */
  id: string;
  title: string;
  /** Serializable Markdown — rendered by the hub and as the LegalDocument default. */
  body: string;
  /** @deprecated In-app JSX. Ignored by the hub; LegalDocument falls back to it when `body` is empty. */
  content?: ReactNode;
}

/**
 * A single dated version of a legal document. Newest first in the array.
 *
 * Publish a change by appending a new entry with a future `effectiveDate`.
 * While `publishedDate <= today < effectiveDate` the version is "announced"
 * (공시) — `upcomingVersion()` returns it and the notice/banner show it. On
 * `effectiveDate` it silently becomes the one `effectiveVersion()` returns; no
 * second commit or scheduled job is needed (both are pure date functions).
 *
 * Korean law: 이용약관 개정은 시행 7일 전(이용자에게 불리하면 30일 전) 공지,
 * 개인정보처리방침은 변경 내용 공개 + 이전 버전 열람. `adverse` marks the 30-day case.
 */
export interface LegalVersion {
  /** e.g. "1.0". Must be unique within a document. */
  version: string;
  /** 공고일 (YYYY-MM-DD). A version only counts as announced once this is reached. */
  publishedDate: string;
  /** 시행일 (YYYY-MM-DD). The version takes force on this date. */
  effectiveDate: string;
  /** 변경 요약 — shown in the advance-notice card. */
  summary?: string;
  /** 이용자에게 불리/중대한 변경 → 30일 사전공지(아니면 7일). */
  adverse?: boolean;
  sections: LegalSection[];
  /** Diff vs the immediately-previous version, for the 3-column table. */
  changes?: VersionChange[];
}

/**
 * The data controller (개인정보처리자) surfaced to users, plus the privacy
 * officer (개인정보 보호책임자) contact. For an L2 doc this is the service; for
 * the L1 identity doc it is the identity broker (authentik).
 */
export interface DataController {
  /** 개인정보처리자 명 (e.g. service or operator name). */
  name: string;
  /** 개인정보 보호책임자 연락처 (reachable email). */
  contactEmail: string;
}

/** A complete legal document: its identity plus every version (newest first). */
export interface LegalDocMeta {
  kind: LegalDocKind;
  /** Display title, e.g. "이용약관". */
  title: string;
  /** Versions, newest first. */
  versions: LegalVersion[];

  /**
   * Standalone slug owned by the legal store (key `legal:doc:${serviceId}:${kind}`).
   * NOT a hostname — it does not join the host-keyed maintenance registry.
   * Use "_identity" for the L1 document.
   */
  serviceId: string;
  /** Stable per-document hub anchor. Section anchors are `${docAnchor}-${section.id}`. */
  docAnchor: string;
  /** Gates hub rendering and PolicyNotice. Defaults to "internal" when authored. */
  visibility: LegalVisibility;
  /** Controller surfaced to users (L2 = the service; L1 = the identity broker). */
  controller: DataController;
}
