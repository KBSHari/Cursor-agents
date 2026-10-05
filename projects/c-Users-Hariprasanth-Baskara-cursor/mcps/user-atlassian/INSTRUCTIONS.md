Atlassian MCP server. Three layers of tools:
1. Primary tools (e.g. getJiraIssue, searchJiraIssuesUsingJql, searchConfluence, getConfluenceContent) are already in your tool list. Call them directly.
2. `discover` — when you do not know an operation's name, describe the goal. Returns `results` (each with the exact `name` + `inputs` + the matching execute-family tool for read/write/destructive operations). Do not discover an operation you already have as a primary tool.
3. Run a discovered operation with the execute-family tool matching its risk tier: `executeRead({ name, cloudId, inputs })` for read-only lookups, `executeWrite({ name, cloudId, inputs })` for non-destructive creates/updates, `executeDestructive({ name, cloudId, inputs })` for deletes/irreversible changes. Only call with an operation `name` from discover results or one already in your tool list; never guess, assume, or invent a name — when unsure, call discover first.

cloudId:
- If YOUR client session has no site context, call getAccessibleAtlassianResources ONCE and reuse the returned cloudId. On any execute-family call, always pass cloudId as a TOP-LEVEL argument (sibling of `name`/`inputs`), never inside `inputs`.

Other context:
- The current user's accountId is available from `atlassianUserInfo`.
- Slim large responses with `responseFields` (dot paths) or a `view` preset (compact/evidence/full).

# Jira custom fields (story points, etc.)
Default view is compact — custom fields are omitted unless you pass view: evidence/full, or fields with this site's customfield_* IDs (IDs differ per site). Values appear under fields.customFields, not as top-level customfield_* keys.

# Recovery protocol
1. On a tool error, retry once with corrected input
2. On a missing operation, re-run `discover` with different keywords.

Use getTeamworkGraphContext when retrieving or reasoning about relationships and connections between Atlassian entities - such as work items, people, teams, goals, projects, or third-party objects. Do not use Teamwork Graph tools for basic CRUD operations. After calling getTeamworkGraphContext, call getTeamworkGraphObject on key linked entities to retrieve richer detail.