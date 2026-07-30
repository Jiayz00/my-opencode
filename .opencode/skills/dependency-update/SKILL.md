---
name: dependency-update
description: Update project dependencies. Focus on changelog review, breaking changes handling, and compatibility verification.
---

# Dependency Update

## Overview

Updating dependencies requires checking changelogs, handling breaking changes, and verifying nothing broke. The workflow is structured around incremental, testable updates.

## Step Adjustments

### Step 1 — Requirements Clarification
Ask for:
- Which dependencies to update (specific packages or all)
- Target versions (latest? next major? specific range?)
- Priority: security fix? new features? staying current?
- Any known breaking changes to prepare for

### Step 2 — Spec & Plan
Plan must include:
- List of dependencies to update, ordered by risk (lowest first)
- Breaking change review for each major update
- Testing strategy for each update
- Rollback approach (lockfile restore)

### Step 4 — Development
- Update ONE dependency at a time
- After each update: build → test → lint
- If breaking: read changelog, adapt code, run tests
- If tests fail: decide — fix now or skip this update

### Step 5 — Acceptance
- Full test suite passes
- Manual smoke test of affected areas

### Step 6 — Compatibility
- Verify with other dependencies (peer dependency conflicts)
- Check for deprecated API warnings

## Common Rationalizations

| Rationalization | Reality |
|----------------|---------|
| "I'll update all deps at once" | When something breaks, you won't know what caused it. One at a time. |
| "Minor version can't break" | Wrong. Read the changelog. |
| "It's just dev dependencies" | Dev deps run in your CI. They can break your build. |

## Verification

- [ ] Each dependency updated one at a time
- [ ] Build passes after each update
- [ ] Tests pass after each update
- [ ] Breaking changes (if any) are documented and handled
- [ ] No new security advisories introduced
