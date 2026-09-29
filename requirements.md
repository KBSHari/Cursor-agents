# Requirements: US-LOGO-1 — Application logo identity and integration

**Status:** draft
**Source:** pasted User Story (no Jira key / Confluence URL)
**Date:** 2026-09-29
**Analyst session:** collaborative Q&A (user elected “draft with assumptions”)

## User Story

Create and integrate a recognizable application logo that represents the product identity and is usable across the application interface, browser metadata, and supported display sizes.

## Problem and goals

- BUS-1: Users and operators should recognize the product from a consistent visual mark rather than a generic placeholder or missing icon.
- BUS-2: The same identity should appear in the application chrome and in browser/OS surfaces that display site or app icons.
- BUS-3: The mark must remain legible at every size the product actually uses (favicon through large header).

**Success looks like:** A single approved logo system (master vector plus derived rasters) is shipped in-product and in browser metadata; tab/bookmark/PWA icons and in-app header use the same identity; missing-asset fallbacks do not leave a broken-image hole.

## Users

| ID | User / role | Job to be done |
|----|-------------|----------------|
| U-1 | End user | Identify the product in the header, tab, and home-screen/bookmark icon. |
| U-2 | Brand / product owner | Own a recognizable mark that matches product identity. |
| U-3 | Implementer (frontend) | Drop assets into standard metadata and UI slots without ad-hoc sizes. |

## Scope

**In scope**

- Create (or adapt) a recognizable application logo representing product identity. (A-1, A-2)
- Integrate the logo in primary application UI chrome (header/nav).
- Integrate browser metadata: favicon, Apple touch icon, web app manifest icons, and HTML `og:image` / Twitter card image where a public web surface exists. (A-4)
- Provide assets for supported display sizes listed under Data and integrations.
- Accessible text alternative and contrast-safe variants for light and dark UI. (A-6)
- Document asset location and usage rules in this requirements file only (no separate brand book unless already present).

**Out of scope**

- Print, merchandise, and paid advertising creative. (A-3)
- Email header logos, app-store listing screenshots, and OS installer/exe icons unless the product already ships those channels. (A-3)
- Full brand redesign (palette, type, illustration system) beyond what the logo requires.
- Animated or 3D logo variants.
- Product implementation in this Cursor config workspace (requirements capture only). (A-8)

## Functional requirements

- FR-1: The system shall display an approved application logo in the primary application header (or equivalent persistent chrome) on authenticated and unauthenticated shells that already show product chrome. (BUS-1, BUS-2)
- FR-2: The system shall expose a favicon (and equivalent shortcut icon links) so supported browsers show the product mark in the tab and bookmarks. (BUS-2)
- FR-3: The system shall include Apple touch icon and web app manifest icon entries for the sizes listed in Data and integrations when the product is a web (or PWA-capable) application. (BUS-2, BUS-3)
- FR-4: The system shall provide a social/preview image (`og:image` and Twitter `summary_large_image`) using the same identity for publicly crawlable pages. (BUS-2)
- FR-5: The system shall use a single master vector source of truth and derived raster files; in-app UI shall prefer SVG (or equivalent vector) except where a platform requires raster. (BUS-3)
- FR-6: The system shall ship light-background and dark-background logo variants (or a mark that remains legible on both) and select the variant from the active theme. (BUS-1)
- FR-7: The system shall provide a non-image textual product name as fallback if the logo asset fails to load. (BUS-1)
- FR-8: Decorative logo instances (header mark duplicated with visible product name) shall be hidden from assistive technology or given empty alt; the sole identifying image shall have a concise accessible name. (A-6)
- FR-9: Clicking the header logo shall navigate to the application home/landing route already defined by the product. (A-7)

## Acceptance criteria

- AC-FR-1.1: Given a user opens a page that includes application chrome, when the page renders, then the approved logo is visible in the header at a size that remains recognizable (not cropped or pixelated at 1x/2x).
- AC-FR-1.2: Given light and dark themes, when the user switches theme, then the logo remains legible against the header background without a white/black box artifact unless that box is part of the approved mark.
- AC-FR-2.1: Given a supported desktop browser, when the user opens the application, then the tab icon is the product favicon rather than the browser default.
- AC-FR-2.2: Given the HTML head, when inspected, then `rel="icon"` (SVG and/or ICO/PNG as specified in Data) is present and returns HTTP 200.
- AC-FR-3.1: Given a mobile Safari / Chromium “Add to Home Screen” flow where PWA/manifest is in scope, when the user adds the app, then the home-screen icon uses the 180 and 192/512 assets rather than a screenshot of the page.
- AC-FR-3.2: Given `manifest.webmanifest` (or equivalent), when validated, then `icons` includes 192×192 and 512×512 PNG (or SVG if the target platforms allow).
- AC-FR-4.1: Given a public URL, when a link unfurler fetches Open Graph tags, then `og:image` points to an image of at least 1200×630 that contains the product mark.
- AC-FR-5.1: Given the repository (or design handoff), when assets are reviewed, then a master SVG exists and all listed raster sizes are derived from it without redrawing at each size.
- AC-FR-6.1: Given dark mode, when the header is shown, then contrast of the mark against the header meets the NFR-A11Y-1 rule for graphical objects or a solid-safe variant is used.
- AC-FR-7.1: Given the logo URL 404s or the image errors, when the header renders, then the visible product name (or equivalent text) remains and no broken-image icon is the only identifier.
- AC-FR-8.1: Given a screen reader, when focus/reading order reaches the header, then the logo is not announced twice (image + adjacent wordmark) unless the image is the only identifier.
- AC-FR-9.1: Given the user activates the header logo (click or keyboard), when the current route is not home, then the application navigates to the home/landing route.

## Non-functional requirements

- NFR-PERF-1: Combined logo + favicon + manifest icons requested on first paint of a typical page shall add no more than 50 KB gzipped over the wire for the above-the-fold UI mark (SVG preferred); raster OG image may be larger and is not on the critical path. (A-9)
- NFR-SEC-1: Logo assets shall be first-party static files (same origin or approved CDN). No remote logo URL that can be swapped by an untrusted third party. SVG shall not embed scripts or external entity payloads.
- NFR-PRIV-1: N/A — not discussed (logo is not personal data). Do not encode user-identifying information in the mark.
- NFR-AVAIL-1: Favicon and header SVG shall be cacheable with long-lived cache headers plus content-hashed filenames (or equivalent cache-busting) so a logo update propagates. OG image may be cached by third parties independently.
- NFR-A11Y-1: Graphical logo that conveys identity shall meet WCAG 2.2 non-text contrast 3:1 against adjacent background, or a high-contrast variant shall be used. `alt` (or `aria-label` on a linked control) shall name the product, not “logo”.
- NFR-OBS-1: Failed logo image loads shall be visible in existing front-end error reporting if the product already has it; otherwise no new observability stack is required. (A-10)

## Data and integrations

- **Master:** `logo.svg` (and `logo-on-dark.svg` if two variants). Optional `logo-mark.svg` (icon-only) for favicon/PWA.
- **Favicon:** `favicon.ico` (16, 32, 48) and/or `favicon.svg`; PNG 32×32 as fallback.
- **Apple:** `apple-touch-icon.png` 180×180.
- **PWA / manifest:** 192×192 and 512×512 PNG, maskable-safe padding where Android is in scope. (A-4)
- **Social:** `og-image.png` (or JPG) 1200×630.
- **In-app header:** SVG, typical display height 24–40 CSS px; 2x raster fallback only if SVG is unsupported.
- **HTML:** `<link rel="icon">`, `<link rel="apple-touch-icon">`, `<meta property="og:image">`, Twitter card tags, `manifest` link.
- **No backend API** for the logo; static hosting only. (A-8)

## Assumptions

- A-1: Product name is unspecified; the mark and `alt` text use a placeholder product name to be replaced when known.
- A-2: No approved artwork was provided; this story includes creating a new simple, recognizable mark (icon + optional wordmark) rather than only wiring an existing file.
- A-3: Marketing, email, print, and native store/installer icons are out of scope unless the existing product already requires them.
- A-4: The product is a web application (possibly PWA-capable). Native iOS/Android app icons are out of scope.
- A-5: Target browsers: last two major versions of Chrome, Edge, Firefox, and Safari (desktop and iOS), plus current Android Chrome.
- A-6: One logo system for all authenticated and public chrome; no role-specific marks.
- A-7: Header logo is a home-link control, matching common web app convention.
- A-8: This workspace is not the application repo; requirements are captured here only. Integration targets “the application” once a repo exists.
- A-9: 50 KB gzipped budget for the critical-path UI mark is a planning default, not a measured baseline.
- A-10: No new logging platform is in scope.
- A-11: Legal/trademark clearance is the brand owner’s responsibility before production; requirements do not substitute legal review.
- A-12: Locales: logo is not translated; product name in `alt` follows the active UI language if the product is already i18n.

## Open questions

- Q-1: Official product name, Jira/Confluence ID, and brand palette?
- Q-2: Create-from-scratch vs existing asset path and who signs off?
- Q-3: Is PWA / Add to Home Screen actually required?
- Q-4: Exact header placement (left of product name vs mark-only)?
- Q-5: Maskable Android icon and Windows tile (`browserconfig.xml`) needed?
- Q-6: Which repo and framework will consume these assets?

## Risks and dependencies

- R-1: A mark that is busy will fail at 16×16; icon-only simplification is required for favicon.
- R-2: Dark/light mismatch can make the logo invisible; two variants or a contained badge reduce this risk.
- R-3: Third-party caches of `og:image` delay brand updates.
- R-4: SVG with scripts is a security risk if assets are ever user-supplied (not planned).
- D-1: Brand/legal approval of the artwork.
- D-2: Application repository, static hosting, and existing layout/header component.
- D-3: If a design system already defines spacing for the header, logo height must fit that scale.

## Clarifications captured

- Q1: Product and actor → unanswered; assumed U-1/U-2/U-3 and unnamed web product (A-1, A-4, A-6).
- Q2: Done-when → unanswered; assumed header + favicon + Apple touch + PWA icons + OG image (FR-1–FR-4).
- Q3: In vs out of scope → unanswered; assumed create new mark; marketing/email/store out of scope (A-2, A-3).
- Q4: Look and rules → unanswered; assumed simple recognizable mark, light/dark variants, brand owner sign-off (A-2, A-11).
- Q5: Placement and load failure → unanswered; assumed header + metadata; text fallback on image error (FR-1, FR-7).
- Q6: Metadata and sizes → unanswered; assumed sizes in Data and integrations (A-4, A-5).
- Q7: Auth / accessibility → unanswered; assumed same logo all shells; WCAG alt and contrast (A-6, NFR-A11Y-1, FR-8).
- Q8: Constraints → unanswered; assumed web static assets, 50 KB UI budget, this workspace is requirements-only (A-8, A-9).
- User instruction: draft with assumptions (do not block on Q&A).
