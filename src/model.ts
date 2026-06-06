import type { ReactNode } from "react";

/** The kind of legal document. Apps typically ship both. */
export type LegalDocKind = "terms" | "privacy";

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

/** A titled section of a legal document. `content` is app-provided JSX. */
export interface LegalSection {
  title: string;
  content: ReactNode;
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

/** A complete legal document: its identity plus every version (newest first). */
export interface LegalDocMeta {
  kind: LegalDocKind;
  /** Display title, e.g. "이용약관". */
  title: string;
  /** Versions, newest first. */
  versions: LegalVersion[];
}
