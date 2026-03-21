# Pull Request Tracking & Visibility

This document provides guidance on tracking open pull requests (PRs) in the `stampini81/skills-integrate-mcp-with-copilot` repository and outlines best practices for maintaining PR visibility across the team.

## Open Pull Requests

The following pull requests are currently open in this repository:

| PR | Title | Author | Status | Linked Issue |
|---|---|---|---|---|
| [#23](https://github.com/stampini81/skills-integrate-mcp-with-copilot/pull/23) | Add documentation for pull request visibility | @Copilot | Draft | — |
| [#14](https://github.com/stampini81/skills-integrate-mcp-with-copilot/pull/14) | Move activities and signups to persistent database storage | @Copilot | Open | [#8](https://github.com/stampini81/skills-integrate-mcp-with-copilot/issues/8) |
| [#13](https://github.com/stampini81/skills-integrate-mcp-with-copilot/pull/13) | Add admin mode for student registration management | @Copilot | Open | [#5](https://github.com/stampini81/skills-integrate-mcp-with-copilot/issues/5) |

> **Note:** This table is a point-in-time snapshot. For the live list of open PRs, see the [Pull Requests tab](https://github.com/stampini81/skills-integrate-mcp-with-copilot/pulls).

## PR Lifecycle & Status Definitions

Each pull request moves through the following stages:

| Status | Description |
|---|---|
| **Draft** | Work in progress — not yet ready for review |
| **Open** | Ready for review; awaiting approval |
| **Changes Requested** | Reviewer has requested modifications before approving |
| **Approved** | All required reviewers have approved; ready to merge |
| **Merged** | Changes integrated into the target branch |
| **Closed** | PR closed without merging |

## Tracking Guidance

### For Contributors

- **Open a draft PR early** to provide visibility into work in progress. Convert to "Ready for Review" when implementation and tests are complete.
- **Link PRs to issues** using `Fixes #<issue-number>` or `Closes #<issue-number>` in the PR description so that issues close automatically when the PR merges.
- **Keep PR descriptions up to date** — describe what changed, why, and any testing steps needed.
- **Request reviewers explicitly** so that the right people are notified and blocking PRs don't get lost.
- **Respond to review comments promptly** to keep PRs moving and avoid stale reviews.

### For Reviewers

- Check the [Pull Requests tab](https://github.com/stampini81/skills-integrate-mcp-with-copilot/pulls) regularly (at least once per day during active sprints) to avoid review bottlenecks.
- Leave actionable, specific feedback. If changes are needed, mark the PR as **Changes Requested** — don't leave it in a limbo state.
- Approve only when all acceptance criteria are met and tests pass.

### For Project Managers

- Use the PR list and linked issues as a live view of in-flight work. A PR without a linked issue is a signal to investigate.
- Stale PRs (no activity for more than 3 business days) should be triaged in the weekly delivery sync: either accelerate review, update scope, or close.
- Track the ratio of open-to-merged PRs as a proxy for delivery health. A growing open PR count may indicate review bottlenecks or scope creep.

## PR Review Checklist

Before approving any pull request, reviewers should confirm:

- [ ] Code changes match the linked issue's acceptance criteria
- [ ] Tests are present for new or modified logic
- [ ] CI checks (linting, tests, security scans) are passing
- [ ] PR description clearly explains the change and any manual testing steps
- [ ] No sensitive credentials or secrets are introduced
- [ ] Documentation is updated if public APIs or workflows changed

## Escalation Path for Stale PRs

If a PR has been open for more than **3 business days** without review activity:

1. **Contributor** pings the requested reviewer in a PR comment
2. **PM/Tech Lead** raises it in the next daily standup or delivery sync
3. If still unresolved after **5 business days**, escalate to the project sponsor for prioritization

## Related Resources

- [Open Issues](https://github.com/stampini81/skills-integrate-mcp-with-copilot/issues)
- [Open Pull Requests](https://github.com/stampini81/skills-integrate-mcp-with-copilot/pulls)
- [OctoAcme Process Overview](./README.md)
