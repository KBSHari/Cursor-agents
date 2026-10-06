# Stage 2 preview — SCRUM-62

**Date:** 2026-10-06
**Write status:** Jira description updated 2026-10-06 12:59 IST (confirmed)
**Issue URL:** https://epam-team-v1cb1mzz.atlassian.net/browse/SCRUM-62

## Proposed Jira operation

- **Action:** Update existing issue (do not create a new story)
- **Issue:** [SCRUM-62](https://epam-team-v1cb1mzz.atlassian.net/browse/SCRUM-62)
- **Project key:** SCRUM
- **Issue type:** Story (unchanged)
- **Summary (unchanged):** `[KBSHARI] As a user, I want a Clear button in the search box so that I can quickly remove the entered search text.`
- **Priority:** Medium (unchanged)
- **Assignee:** unchanged (currently unassigned)
- **Labels:** none (unchanged)
- **Sprint / epic:** not set by this update
- **Status transition:** none

### Description (exact body to write)

```markdown
**User story:**
As a user,
I want a Clear button in the search box,
so that I can quickly remove the entered search text.

**Description:**
Users who type into a search box need a dedicated Clear control that removes the entered search text in one action, without a full page refresh, and without breaking existing search behavior.

In scope: a Clear control inside or immediately next to the search box; Clear empties the current search text; Clear on an already-empty box has no harmful effect; existing search still works; Clear does not cause a full page refresh.

Out of scope: a new search engine or API; ranking, filters, or query-syntax changes; autocomplete, recent-search history, and saved searches; SCRUM-61 username-field work.

**Acceptance criteria:**
- Given a page that contains the product search box, when the page is ready for input, then a Clear control is visible inside or next to that search box.
- Given the search box contains one or more characters, when the user activates Clear, then the search box value is empty.
- Given the search box is empty, when the user activates Clear, then the value stays empty and the user is not shown an error.
- Given search already works for that box, when Clear has been added, then the user can still run search the same way as before.
- Given the user activates Clear, when the action completes, then the document is not fully reloaded as a result of that action.

**Dependencies:**
- An existing search box and search action (stated by this story). No search box was found in the Hari-Agents welcome page in this workspace.

**Assumptions:**
- “Inside/next to” means visually grouped with the search input.
- After Clear, the same input remains usable without reload.
- Clear is keyboard-usable and is not a submit/refresh control.
- Native browser search-cancel UI does not satisfy the story unless it is a product-visible Clear control that meets the acceptance criteria.
- Visible label may be the word Clear or an icon whose accessible name is Clear.
- Hari-Agents welcome page is not the default implementation target unless later specified.

**Open questions:**
- Which application and screen host the search box?
- When the box is empty, should Clear stay visible and enabled, stay visible but disabled, or be hidden?
- Must Clear also reset visible search results / URL query, or only the input value?
- Is a field containing only spaces treated as empty?
- Target browsers, and whether native type=search clear is allowed as the implementation?
```

## Proposed Confluence operation

**Not included in the default write.** Command default space is “AI Schokwave”. That space was not found among accessible Confluence spaces in this session. Parent page is unknown. Skill rules forbid inventing a space or parent.

If you name a space (and parent if required), a page titled `SCRUM-62 — Clear button for search text` can be drafted from the approved requirements.
