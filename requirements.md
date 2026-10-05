# Requirements: Hari-Agents welcome page

**Status:** Approved (for implementation)
**Source:** Requirement analysis, 2026-10-05 (Hari-Agents welcome page)
**Location:** `plans/hari-agents/` — do not confuse with repo-root `requirements.md` (`US-LOGO-1` logo/PWA draft)

## Summary

One static welcome/landing page that presents the Hari-Agents identity. Opening the page in a browser (no login, no API) shows the product title, a greeting, and a personal-workspace branding line.

## Functional requirements

- **FR-1:** The page shall set the browser document title to exactly `Hari-Agents`.
- **FR-2:** The page shall display a visible primary heading whose accessible name is `Hari-Agents`.
- **FR-3:** The page shall display a greeting that includes `Welcome` and `Hari-Agents`. Default sentence: `Welcome to Hari-Agents`.
- **FR-4:** The page shall display a short branding line that states the surface is a personal agent workspace. Default: `A personal agent workspace.`
- **FR-5:** The page shall present FR-2, FR-3, and FR-4 in the first viewport of a typical desktop window without a click, form submit, or application API call.
- **FR-6:** The page shall be deliverable as static files and shall not require a backend, database, or authenticated session.
- **FR-7:** The page shall not collect input (no login, search, or required fields) in this release.
- **FR-8:** The page shall not embed analytics, tracking pixels, or third-party telemetry scripts.
- **FR-9:** The primary heading shall be a single semantic `h1` so assistive technology can identify the page name.
- **FR-10:** Visible text on the default background shall remain readable (see NFR-1).
- **FR-11:** The same welcome content shall remain readable at about 1280×800 and about 375×667; horizontal overflow that clips the heading or greeting is not acceptable.
- **FR-12:** The product name `Hari-Agents` shall remain visible as text so identity does not depend on an image load.

## Non-functional requirements

- **NFR-1:** Body and heading text shall meet WCAG 2.2 contrast of at least 4.5:1 for normal text and 3:1 for large text. Approved tokens: canvas `#ffffff`, text `#1a1a1a`.
- **NFR-2:** The page shall render required content from local/static files in a current Chromium-based desktop browser.
- **NFR-3:** Technology stack is an architecture decision, not a product requirement. Chosen stack: plain HTML + CSS.

## Acceptance criteria

- **AC-FR-1.1:** Given the welcome page files are opened in a browser, when the page finishes loading, then the document title shown in the tab is `Hari-Agents`.
- **AC-FR-2.1:** Given the welcome page is visible, when a user views the main content, then a primary heading displaying `Hari-Agents` is on screen.
- **AC-FR-2.2:** Given the page DOM is inspected, when the main heading is queried, then there is exactly one `h1` whose text is `Hari-Agents`.
- **AC-FR-3.1:** Given the welcome page is visible, when a user reads the main content, then a greeting containing `Welcome` and `Hari-Agents` is visible without interaction.
- **AC-FR-4.1:** Given the welcome page is visible, when a user reads the main content, then supporting text identifies the surface as a personal agent workspace.
- **AC-FR-5.1:** Given a desktop viewport of about 1280×800, when the page loads, then the heading, greeting, and branding line are visible without scrolling away from the first screen and without submitting a form.
- **AC-FR-6.1:** Given no application server, API, or login session is running, when the static page is opened in the browser, then FR-2, FR-3, and FR-4 still render.
- **AC-FR-7.1:** Given the welcome page is loaded, when a user inspects the page, then there is no login, signup, or required input form.
- **AC-FR-8.1:** Given the welcome page source is reviewed, when scripts and network requests after load are checked, then no analytics or tracking endpoint is called.
- **AC-FR-10.1:** Given the default theme, when contrast of heading and greeting text is checked against the background, then the ratios meet NFR-1.
- **AC-FR-11.1:** Given a viewport of about 375×667, when the page loads, then the heading and greeting remain fully readable and are not clipped by horizontal overflow.
- **AC-FR-12.1:** Given any decorative image is blocked or missing, when the page renders, then the text `Hari-Agents` remains visible and no broken-image icon is the only identifier.

## Out of scope

Auth, APIs, analytics, in-page Jira, multi-page navigation, agent execution, SPA/frameworks, `US-LOGO-1` logo/PWA/favicon program.
