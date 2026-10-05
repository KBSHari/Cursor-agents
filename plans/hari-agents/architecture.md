# Architecture: Hari-Agents welcome page

## Document status

- Status: Approved
- Design review: Passed
- Ready for implementation: Yes
- Review date: 2026-10-05

### Allowed status values

| Status | Meaning |
|--------|---------|
| Proposed | Architecture drafted from approved requirements; awaiting Design Review. |
| Needs Review | Material changes were made and require another Design Review pass. |
| Approved | Design Review passed; implementation planning may begin. |
| Blocked | A finding or missing decision prevents safe progress. |
| Superseded | Replaced by a later architecture document. |

This document is **Approved**. Design Review passed on 2026-10-05 with no Critical or High blockers. Medium findings were resolved in this revision. Implementation planning may begin. Production HTML/CSS/tests still wait for `impl-plan.md`.

---

## 1. Architecture overview

### 1.1 Recommended style

**Single-document static presentation.** One HTML document plus one same-folder stylesheet, opened in a browser from the local filesystem (`file://`) or an optional trivial static file server. No application runtime, no SPA framework, no backend, no build step.

### 1.2 Why this style fits

Approved scope is one welcome/landing surface: document title `Hari-Agents`, one semantic `h1`, a greeting, and a personal-workspace branding line. Those needs are markup and CSS. A framework, bundler, or API would add cost without covering any additional functional requirement.

Workspace facts reinforce the choice: there is no existing HTML app, no `package.json`, and no first-class application remote. New files at the Cursor repo root (or a new root `hari-agents/` folder) are ignored by the managed `.gitignore` `*` rule. Delivery under `plans/hari-agents/` is versionable because `plans/` is allowlisted.

### 1.3 Major system boundaries

| Boundary | Inside | Outside |
|----------|--------|---------|
| Product surface | `index.html` + `styles.css` | Auth, APIs, multi-page app, agent execution, Jira-in-page |
| Delivery | Files under `plans/hari-agents/` | Repo-root product code, `US-LOGO-1` logo/PWA/favicon program |
| Runtime | Browser rendering of static files | Node.js except the optional local test runner |
| Trust | First-party `index.html` + `styles.css` only | Third-party scripts, fonts, analytics, remote assets, page JS |

### 1.4 Primary actors and external systems

- **Workspace owner** and **casual visitor** open the page in a browser.
- **Implementer** authors and visually checks the static files.
- **Web browser** is the only runtime that must render welcome content.
- **Node.js** is optional and used only for `node --test` string assertions; it is not a production dependency.
- **No production backend, identity provider, analytics vendor, or issue tracker** participates at runtime.

### 1.5 Important architecture decisions

| ID | Decision | Rationale |
|----|----------|-----------|
| AD-1 | Plain HTML + CSS; no SPA framework | Scope is one static page; NFR-3 leaves stack as an architecture choice. |
| AD-2 | Place the page and SDLC docs under `plans/hari-agents/` | `.gitignore` ignores repo-root and unlisted folders; `plans/` is allowlisted. |
| AD-3 | Separate `styles.css` in the same folder | Keeps presentation testable and avoids a bundler; still static. |
| AD-4 | Text wordmark only; no decorative image required | Satisfies FR-12 and Assumption A-8; avoids image-load identity failure. |
| AD-5 | System font stack; no webfont CDN | Avoids third-party network dependency and tracking surface (FR-8). |
| AD-6 | Open via `file://` as the primary verification path | Meets FR-6 / NFR-2 without a server. A local static server is optional, not required. |
| AD-7 | Zero-dependency `node --test` + `assert` on HTML file text | Workspace constraint; no npm. Tests are not a runtime component. |
| AD-8 | Do not fold `US-LOGO-1` into this design | Confirmed separate draft; favicon/PWA/OG are out of scope. |
| AD-9 | No backend, secrets, cookies, or user input | FR-6, FR-7, FR-8. |
| AD-10 | No JavaScript in the delivered page | FR-7/FR-8 and NFR-3: the welcome surface needs no client script. C-TEST is not linked from HTML. |
| AD-11 | Require a viewport meta tag | FR-11 / AC-FR-11.1: without `width=device-width`, ~375×667 layout width is unreliable. |
| AD-12 | Default light palette `#ffffff` / `#1a1a1a` | Known WCAG 2.2 pass for normal text (well above 4.5:1). Brand colors were not specified; this is a conservative default, not a brand book. |

---

## 2. System context

### 2.1 Users and actors

| ID | Actor | Type | Interaction |
|----|-------|------|-------------|
| A-U1 | Workspace owner | Human | Opens the page to confirm Hari-Agents identity. |
| A-U2 | Casual visitor | Human | Reads title, greeting, and purpose line. |
| A-U3 | Implementer | Human | Edits static files and runs visual / `node --test` checks. |

### 2.2 Internal systems

| ID | System | Ownership | Notes |
|----|--------|-----------|-------|
| C-PAGE | Welcome document (`index.html`) | This delivery | Sole product surface. |
| C-STYLE | Presentation (`styles.css`) | This delivery | Layout, contrast, first-viewport, narrow-viewport wrapping. |
| C-TEST | Structure test (`welcome-page.test.mjs`) | This delivery | Reads HTML as text; never served to visitors. |

### 2.3 External systems

None at runtime. Adjacent, non-runtime artifacts:

- Cursor SDLC command flow (consumes this document).
- Repo-root `requirements.md` (`US-LOGO-1`) — related brand draft only; not a dependency.

### 2.4 Input sources and output destinations

| Direction | What | Source / destination |
|-----------|------|----------------------|
| Input | Static HTML and CSS bytes | Local files under `plans/hari-agents/` |
| Input (test only) | HTML file contents as a string | `welcome-page.test.mjs` via `fs.readFileSync` |
| Output | Painted welcome view + tab title | Browser viewport and document title |
| Output (test only) | Pass/fail assertions | Terminal from `node --test` |

There is no user-generated data, no persistence, and no outbound application traffic.

### 2.5 Trust and ownership boundaries

- **Runtime trust boundary:** `index.html` and `styles.css` only. The browser must not load scripts, fonts, images, or pixels from untrusted origins, and must not execute page JavaScript (AD-10).
- **Verification artifacts:** `welcome-page.test.mjs` is first-party but is not a runtime asset and must not be linked or served to visitors.
- **Ownership boundary:** Hari-Agents welcome files and SDLC docs in `plans/hari-agents/`. The rest of the Cursor config repo (commands, skills, plugins, `US-LOGO-1`) is adjacent configuration, not this product.
- **No secrets** cross any boundary.

### 2.6 Context diagram

```mermaid
flowchart LR
    Owner[Workspace owner]
    Visitor[Casual visitor]
    Implementer[Implementer]
    Browser[Web browser]
    Node[Node test runner]
    subgraph RuntimeTrust["Runtime trust boundary: first-party page files"]
        Page[index.html]
        Style[styles.css]
    end
    subgraph VerifyFiles["Verification artifacts: not served"]
        Test[welcome-page.test.mjs]
    end

    Owner --> Browser
    Visitor --> Browser
    Implementer --> Browser
    Browser -->|open file or optional static serve| Page
    Page -->|same-folder stylesheet| Style
    Implementer --> Node
    Node --> Test
    Test -->|read file text only| Page
```

---

## 3. Architecture principles

1. **Static first.** Required content is in the HTML file. No API, session, or build is needed to greet the visitor.
2. **One page, one `h1`.** Identity is the product name as text, not a routed application.
3. **No third-party runtime and no page JavaScript.** No remote scripts, fonts, analytics, or pixels; `index.html` contains no `<script>` (AD-10).
4. **Text survives decoration.** If a later optional mark is added, the wordmark stays visible text (FR-12). This design does not require a mark.
5. **Keep SDLC artifacts with the page.** Architecture, later impl-plan, page, styles, and tests live together under `plans/hari-agents/`.
6. **Do not expand scope.** Auth, APIs, Jira-in-page, agent execution, PWA/favicon, and SPA stacks stay out.

---

## 4. Components and responsibilities

### 4.1 Component catalog

| ID | Component | Responsibility | Does not do |
|----|-----------|----------------|-------------|
| C-PAGE | `index.html` | Document title exactly `Hari-Agents`; `charset` and viewport meta (AD-11); single `h1` whose accessible name is `Hari-Agents`; greeting containing `Welcome` and `Hari-Agents` (default: `Welcome to Hari-Agents`); branding line that this is a personal agent workspace (default: `A personal agent workspace.`); semantic landmark (`main`); same-folder CSS only; no `form`; no `<script>`; no remote `href`/`src`. | Routing, data fetch, auth, logo system, page JS |
| C-STYLE | `styles.css` | Light readable theme using default tokens `#ffffff` / `#1a1a1a` unless a later approved palette is supplied; WCAG 2.2 contrast (NFR-1); first-viewport composition on ~1280×800; wrapping without clipping heading/greeting at ~375×667; system fonts. | Business copy, tracking |
| C-TEST | `welcome-page.test.mjs` | `node --test` + `node:assert` string checks on HTML: title, `h1`, greeting, viewport meta, absence of `form`, absence of `<script>` and analytics markers. | Browser automation, visual regression, serving the page |
| C-BROWSER | Web browser | Renders C-PAGE + C-STYLE; shows tab title. Not authored. | — |
| C-RUNNER | Node.js test runner | Optional local verification. Not required to view the page. | Production hosting |

### 4.2 Component diagram

```mermaid
flowchart TB
    subgraph Runtime["Visitor runtime — no backend"]
        Browser[Web browser]
        HTML[C-PAGE index.html]
        CSS[C-STYLE styles.css]
        Browser --> HTML
        HTML --> CSS
    end

    subgraph Verification["Implementer verification — not served"]
        Node[C-RUNNER node test]
        Test[C-TEST welcome-page.test.mjs]
        Node --> Test
        Test -->|string assertions| HTML
    end
```

### 4.3 Data ownership

| Data | Owner | Persistence | Notes |
|------|-------|-------------|-------|
| Product name `Hari-Agents` | C-PAGE (`<title>`, `h1`, greeting) | Source files | Canonical identity is text. |
| Greeting and tagline | C-PAGE | Source files | Defaults from Assumptions A-3 and A-4. |
| Colors, spacing, typography | C-STYLE | Source files | Default `#ffffff` / `#1a1a1a` (AD-12); no brand book. |
| Visitor data | None | None | No collection (FR-7, FR-8). |

There are no entities to persist, no write path, and no cache-coherence problem.

### 4.4 Integration points

None. No HTTP APIs, webhooks, Atlassian calls, or environment variables. The HTML-to-CSS relationship is a same-folder relative `link`.

---

## 5. Data flows (static only)

There is one visitor flow and one implementer test flow. Both are local file reads.

### 5.1 Visitor render flow

```mermaid
sequenceDiagram
    actor User
    participant Browser
    participant HTML as index.html
    participant CSS as styles.css

    User->>Browser: Open index.html
    Browser->>HTML: Read local file
    HTML-->>Browser: Markup title h1 greeting tagline
    Browser->>CSS: Read same-folder stylesheet
    CSS-->>Browser: Presentation rules
    Browser-->>User: First-viewport welcome view
```

No application API call occurs. Missing CSS degrades presentation but the HTML wordmark, greeting, and tagline remain readable (FR-12 identity does not depend on CSS or images).

### 5.2 Structure-test flow

```mermaid
sequenceDiagram
    actor Implementer
    participant Node as node test runner
    participant Test as welcome-page.test.mjs
    participant HTML as index.html

    Implementer->>Node: Run test file
    Node->>Test: Execute
    Test->>HTML: fs.readFileSync
    HTML-->>Test: File text
    Test-->>Node: Assert title h1 greeting viewport no form no script
```

C-TEST does not launch a browser and does not prove contrast or viewport layout. Those remain visual/NFR checks during implementation and verify stages.

---

## 6. Technology choices and alternatives

### 6.1 Chosen stack

| Concern | Choice | Why |
|---------|--------|-----|
| Markup | HTML5, single file `index.html` | FR-1, FR-2, FR-3, FR-4, FR-9 map directly to elements. |
| Presentation | CSS3 file `styles.css` | FR-5, FR-10, FR-11 without a preprocessor. |
| Fonts | System UI stack | No CDN; FR-8; works on `file://`. |
| Language | English copy in HTML | Assumption A-6. |
| Theme | Light readable colors; default `#ffffff` / `#1a1a1a` | Assumption A-7; NFR-1; AD-12. |
| Wordmark | Text in `h1` | Assumption A-8; FR-12. |
| Package manager | None | No `package.json`; npm is unnecessary for this scope. |
| Tests | `node:test` + `assert`, ESM `.mjs` | Zero extra dependencies; `node --test`. |
| Hosting | `file://` primary; optional local static server | FR-6; no backend. |

### 6.2 Alternatives considered

| Alternative | Verdict | Reason |
|-------------|---------|--------|
| React / Vue / Svelte SPA | Rejected | Multi-page/runtime complexity; needs npm; not required by any FR. |
| Markdown-only render | Rejected | Document title, single `h1`, and CSS viewport rules are harder to guarantee. |
| Inline CSS only (no `styles.css`) | Acceptable fallback | Slightly simpler file count; harder to scan. Separate CSS is preferred. |
| CSS framework (Bootstrap, Tailwind via CDN) | Rejected | Third-party network/scripts; overkill; FR-8 risk. |
| npm + Playwright/Jest | Rejected | Extra dependencies; workspace asks for `node --test` string assertions. |
| Backend template (Express, etc.) | Rejected | Contradicts FR-6. |
| Separate application repo | Deferred | Q-2; not required if files live under allowlisted `plans/hari-agents/`. |

---

## 7. File layout under `plans/hari-agents/`

Recommended delivery (this folder is allowlisted by `.gitignore`):

```text
plans/hari-agents/
  architecture.md              # this document (SDLC)
  impl-plan.md                 # later Implementation Planning artifact
  index.html                   # welcome page (C-PAGE)
  styles.css                   # presentation (C-STYLE)
  welcome-page.test.mjs        # node --test structure checks (C-TEST)
```

Implementation must not place the page at the Cursor repo root or in a new root `hari-agents/` folder if those files need to be versioned.

`architecture.md` and a future `impl-plan.md` are SDLC documents, not runtime assets. They are not linked from `index.html`.

### 7.1 HTML structure contract (for implementers)

`index.html` shall contain, at minimum:

- `<html lang="en">`
- `<meta charset="utf-8">`
- `<meta name="viewport" content="width=device-width, initial-scale=1">`
- `<title>Hari-Agents</title>` exactly
- `<link rel="stylesheet" href="styles.css">` (relative, same folder; the only linked resource)
- exactly one `<h1>Hari-Agents</h1>`
- greeting text including `Welcome` and `Hari-Agents` (default sentence: `Welcome to Hari-Agents`)
- branding line identifying a personal agent workspace (default: `A personal agent workspace.`)
- a single `<main>` landmark wrapping heading, greeting, and branding line
- no `<form>`
- no `<script>` (inline or `src`)
- no remote `href`, `src`, or `@import` (no CDN, analytics, fonts, or pixels)

### 7.2 Test contract

`welcome-page.test.mjs` shall run with:

```text
node --test welcome-page.test.mjs
```

from `plans/hari-agents/` (or an equivalent path argument). Assertions operate on the HTML file string: title, `h1`, greeting, viewport meta, no `form`, no `<script>`, no analytics markers. No extra npm packages.

---

## 8. Security and privacy

| Topic | Design |
|-------|--------|
| Secrets | None. No API keys, tokens, or credentials in files. |
| Page JavaScript | Forbidden in `index.html` (AD-10). No inline or external `<script>`. C-TEST is not linked from the page. |
| Third-party scripts | Forbidden. No CDN JS, tag managers, or remote widgets. |
| Remote assets | Forbidden. The only allowed stylesheet is same-folder `styles.css`. |
| Tracking | Forbidden (FR-8). No analytics, pixels, cookies, or beacons. |
| Input | No forms or writable fields (FR-7). No injection surface from visitors. |
| Supply chain | No npm dependencies for the page or its test. |
| Fonts / images | System fonts; no required remote or decorative images. |
| SVG | Not required. If a later mark is added, it must be first-party, script-free, and must not replace the text wordmark. |
| AuthZ / AuthN | Not applicable; page is unauthenticated static content. |
| Transport | `file://` has no network. If an optional static server is used later, it only serves these first-party files. |
| Privacy | No personal data collected or stored. |

Runtime trust boundary is `index.html` and `styles.css`. Crossing it (remote script, font, pixel, or page JavaScript) would be a design violation, not an open option.

---

## 9. Reliability, accessibility, observability

### 9.1 Reliability

- **Primary success mode:** opening `index.html` in a current Chromium-based desktop browser shows title, heading, greeting, and tagline (NFR-2, AC-FR-6.1).
- **No server process** is required; file-open works if the two static files remain together.
- **CSS missing:** content remains in the DOM and is readable as unstyled HTML.
- **Image missing:** not applicable in this design; identity is text (FR-12).
- **Scalability:** one static document; no concurrent-write or capacity model.
- **Disaster recovery:** restore the folder from git; no data store.

### 9.2 Accessibility

| Requirement | Design response |
|-------------|-----------------|
| FR-9 / AC-FR-2.2 | Exactly one semantic `h1` with text `Hari-Agents`. |
| FR-10 / NFR-1 | Default canvas `#ffffff` and text `#1a1a1a` (AD-12); contrast ≥ 4.5:1 normal, ≥ 3:1 large. |
| FR-11 | Viewport meta (AD-11); fluid width; wrapping; no horizontal clip of heading/greeting at ~375×667. |
| Keyboard | Content is visible without interaction; no hidden-only-on-hover identity. |
| Language | `lang="en"` on the root element. |
| Motion / dark mode | Not requested (A-7); do not add a theme toggle in this release. |

### 9.3 Observability

**None required.** No logs, metrics, traces, health checks, or error-reporting product. Failed decorative assets are out of scope because none are required. C-TEST output is a local developer signal only.

---

## 10. Risks, trade-offs, and open decisions

### 10.1 Risks

| ID | Risk | Mitigation |
|----|------|------------|
| R-1 | Scope creep into portal, chat, or Jira UI | This architecture authorizes one static page only. |
| R-2 | Treating a framework as mandatory | AD-1; alternatives documented and rejected. |
| R-3 | Image-only identity | AD-4: text wordmark; no required image. |
| R-4 | Files placed at repo root are gitignored | AD-2: deliver under `plans/hari-agents/`. |
| R-5 | Confusing this page with `US-LOGO-1` | AD-8; favicon/PWA/OG stay out. |
| R-6 | `file://` CSS path mistakes | Same-folder relative `href="styles.css"`; keep files together. |
| R-7 | Structure tests miss contrast/viewport | Viewport meta is asserted by C-TEST (AD-11); contrast and 375-wide wrap remain visual/NFR checks. |
| R-8 | Accidental page JavaScript or remote URL | AD-10 and HTML contract: no `<script>`, no remote `href`/`src`; C-TEST asserts no `<script>`. |

### 10.2 Trade-offs

- **Separate CSS vs inline:** two files vs one. Separate CSS is easier to review; both remain static. Chosen: separate file.
- **No visual test automation:** keeps zero dependencies; contrast and 375-wide layout need a human or later verify step.
- **`file://` vs always using a server:** `file://` matches FR-6; some browsers restrict other file types, which does not matter because no extra types are required.

### 10.3 Open decisions

| ID | Decision | Blocking? | Default if unset |
|----|----------|-----------|------------------|
| OD-1 | Exact greeting/tagline vs assumed copy (req Q-1) | No | `Welcome to Hari-Agents` / `A personal agent workspace.` |
| OD-2 | Separate application repo vs this folder (req Q-2) | No | `plans/hari-agents/` in this repo |
| OD-3 | Any decorative mark besides text (req Q-3) | No | Text-only wordmark |
| OD-4 | Visual direction beyond readable light UI (req Q-5) | No | Conservative system fonts and high-contrast neutrals |
| OD-5 | Optional local static server vs `file://` only | No | `file://` is sufficient |
| OD-6 | Later multi-page workspace (req Q-4) | No | This release is one static page only |

**Blocking open decisions:** none. Defaults above are sufficient to implement FR-1 through FR-12.

---

## 11. Mapping of FR-1..FR-12 to components

| Requirement | Component(s) | How the design addresses it |
|-------------|--------------|-----------------------------|
| FR-1 Document title exactly `Hari-Agents` | C-PAGE | `<title>Hari-Agents</title>`; asserted by C-TEST. |
| FR-2 Visible primary heading accessible name `Hari-Agents` | C-PAGE | Visible text `h1`; C-STYLE does not hide it. |
| FR-3 Greeting contains `Welcome` and `Hari-Agents` | C-PAGE | Default copy `Welcome to Hari-Agents` in main content. |
| FR-4 Branding line: personal agent workspace | C-PAGE | Default copy `A personal agent workspace.` |
| FR-5 First viewport on typical desktop; no click/form/API | C-PAGE + C-STYLE | Content in initial `main`; CSS centers/sizes for ~1280×800; no interaction required. |
| FR-6 Static files; no backend/session | Delivery model | Only HTML/CSS; `file://` or optional static serve. |
| FR-7 No input collection | C-PAGE | No `form` or required fields; C-TEST asserts no `form`. |
| FR-8 No analytics/telemetry | C-PAGE + security rules | No page scripts, no remote URLs; C-TEST asserts no `<script>` and no analytics markers. |
| FR-9 Single semantic `h1` | C-PAGE | Exactly one `h1`; C-TEST asserts it. |
| FR-10 Readable contrast | C-STYLE | Default `#ffffff` / `#1a1a1a` (AD-12) meeting NFR-1; visual verify (not C-TEST). |
| FR-11 Readable at ~1280×800 and ~375×667 | C-PAGE + C-STYLE | Viewport meta (AD-11); fluid layout, wrap, no clip; visual verify of wrap. |
| FR-12 Name remains text if decoration fails | C-PAGE | Product name is text; no required image. |

### 11.1 NFR coverage

| NFR | Coverage |
|-----|----------|
| NFR-1 Contrast | C-STYLE default `#ffffff` / `#1a1a1a` (AD-12); verify stage. |
| NFR-2 Chromium file/static open | Reliability; no runtime besides the browser. |
| NFR-3 Stack is an architecture choice | AD-1: HTML/CSS chosen; alternatives rejected. |

Out-of-scope items (auth, APIs, analytics, Jira-in-page, multi-page app, agent execution, logo/PWA/favicon program) have **no component**. That is intentional.

---

## 12. Assumptions consumed (not re-opened as product scope)

- English copy; light readable styling with default `#ffffff` / `#1a1a1a`; text wordmark is enough.
- Default greeting and tagline as in Assumptions A-3 and A-4.
- Repo-root `requirements.md` remains a separate `US-LOGO-1` logo draft.
- First browser target: current desktop Chrome or Edge.

---

## 13. Pipeline readiness

| Item | Value |
|------|--------|
| Current stage | Design Review complete |
| Input artifact | Approved requirement analysis (Hari-Agents welcome page, FR-1..FR-12) and this architecture |
| Output artifact | `plans/hari-agents/architecture.md` (this file, Approved) |
| Status | Approved |
| Design review | Passed |
| Ready for implementation | Yes |
| Next stage | Implementation Planning (`impl-plan.md`) |
| Production coding | Must wait for Implementation Planning; architecture blockers are none |

---

## 14. Out of scope reminder

Do not implement as part of this architecture: authentication, APIs, analytics, in-page Jira, multi-page navigation, agent execution, prescribed SPA stack, or the `US-LOGO-1` logo/PWA/favicon program.

---

## 15. Design Review findings (2026-10-05)

Review status: **Ready for implementation**. Critical/High blockers: **none**. Medium findings below were resolved in this revision.

| ID | Severity | Category | Finding | Resolution in this document |
|----|----------|----------|---------|-----------------------------|
| F-1 | Medium | Requirements / a11y | HTML contract omitted viewport meta required for reliable ~375×667 CSS width (FR-11). | AD-11; §7.1 viewport meta; C-PAGE / C-TEST updated. |
| F-2 | Medium | Security | Contract forbade third-party/analytics scripts but not first-party page JS. | AD-10; no `<script>` in `index.html`; security table + C-TEST. |
| F-3 | Medium | Diagrams | Context diagram placed `welcome-page.test.mjs` inside the runtime trust boundary. | §2.6 splits runtime files vs verification artifacts; Implementer also opens Browser. |
| F-4 | Medium | Diagrams | Sequence alias `node --test` can break Mermaid (`--` is message syntax). | Aliases use `node test runner` / `C-RUNNER node test`. |
| F-5 | Medium | Security / FR-8 | HTML contract did not explicitly ban remote `href`/`src` besides analytics markers. | §7.1: only same-folder `styles.css`; no remote URLs. |
| F-6 | Medium | Technology / NFR-1 | Contrast ratios were stated without default tokens; implementers could pick failing gray. | AD-12: `#ffffff` / `#1a1a1a`. |
| F-7 | Low | Diagrams | Implementer visual-check path was text-only. | Implementer → Browser added in §2.6. |
| F-8 | Low | Open decisions | Req Q-4 (later multi-page) was not listed. | OD-6: this release is one static page. |

Low items F-7 and F-8 are documentation-only and do not block approval.
