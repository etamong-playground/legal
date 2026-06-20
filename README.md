> Canonical: https://github.com/etamong-playground/legal | Mirror: https://git.m.etamong.com/etamong-playground/legal (read-only)

# @etamong-lab/legal

Shared, versioned legal-document toolkit for etamong-lab apps — one model,
renderers, and advance-notice logic for Terms (이용약관) / Privacy (개인정보처리방침),
so each app stops re-implementing its own. Tracked in [planning#158](https://gitlab.com/etamong-lab/planning/-/issues/158).

**Headless & styleless.** Ships a model + helpers + renderers that emit
`legal-*` class names only. Theme via the optional stylesheet's CSS variables,
or style the classes yourself. No router, no bundled content — each app owns its
own version data in its own repo (so the legal audit trail stays in git).

## Install

This package lives in the GitLab npm registry under the `@etamong-lab` scope.
Add to the consuming app's `.npmrc`:

```
@etamong-lab:registry=https://gitlab.com/api/v4/projects/82936501/packages/npm/
```

In CI, authenticate with the job token (the app's pipeline must be allowed to
read this project — Settings → CI/CD → Job token permissions on `legal`):

```
//gitlab.com/api/v4/projects/82936501/packages/npm/:_authToken=${CI_JOB_TOKEN}
```

```sh
pnpm add @etamong-lab/legal
```

## Model

```ts
interface LegalVersion {
  version: string;          // "1.0"
  publishedDate: string;    // 공고일 YYYY-MM-DD
  effectiveDate: string;    // 시행일 YYYY-MM-DD
  summary?: string;
  adverse?: boolean;        // 불리/중대 → 30일 사전공지 (else 7일)
  sections: { title: string; content: ReactNode }[];
  changes?: VersionChange[]; // diff vs previous version
}
interface LegalDocMeta { kind: "terms" | "privacy"; title: string; versions: LegalVersion[] }
```

Newest version first. Publishing a change = append a version with a future
`effectiveDate`. Advance-notice (공시) and the effective-date flip are pure date
functions — no scheduled job.

## Helpers

- `effectiveVersion(versions, today?)` — the version in force.
- `upcomingVersion(versions, today?)` — soonest announced-but-not-yet-effective
  version, or null. Guarded by `publishedDate <= today` so drafts don't trigger
  a public banner.
- `todayISO(timeZone = "Asia/Seoul")` — today as YYYY-MM-DD in the jurisdiction.

## Components

| Component | Purpose |
|---|---|
| `<LegalDocument version>` | Renders a version's titled sections. |
| `<VersionDiff changes fromVersion toVersion>` | 3-column 변경 전/후 table; `==highlight==` markup. |
| `<VersionHistory versions selectedIdx onSelect>` | Controlled version picker. |
| `<UpcomingNotice docTitle version onPreview?>` | Per-doc 변경 예정 card. |
| `<PolicyNotice docs hrefFor renderLink?>` | Site-wide dismissible 사전공시 banner. |

`PolicyNotice` is router-agnostic — pass `renderLink={(href, kids) => <Link to={href}>{kids}</Link>}`
to use your app's Link. Interactive components use state; mount them inside a
client boundary (Next.js `"use client"`).

## Theming

```ts
import "@etamong-lab/legal/styles.css";
```

Override CSS variables for theme / dark mode:

```css
.dark {
  --legal-fg: #d4d4d8;
  --legal-border: #3f3f46;
  --legal-surface: #27272a;
  --legal-notice-bg: #1e3a8a33;
  /* ... see src/styles.css for the full list */
}
```

## Releasing

Bump `version` in `package.json`, commit, then push a matching tag:

```sh
git tag v0.1.0 && git push origin v0.1.0
```

CI publishes to the registry on tags matching `vX.Y.Z`.
