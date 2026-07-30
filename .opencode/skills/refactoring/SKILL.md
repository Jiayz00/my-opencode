---
name: refactoring
description: Restructure code to improve maintainability, readability, or performance without changing external behavior.
---

# Refactoring

## Overview

Refactoring means restructuring existing code WITHOUT changing its observable behavior. The key challenge is preserving behavior while improving structure. Heavy emphasis on test coverage before and after.

## Step Adjustments

### Step 1 — Requirements Clarification
Ask for:
- What code needs refactoring and why
- What "better" looks like (performance? readability? maintainability?)
- Any behavior that MUST NOT change (critical paths, edge cases)

### Step 2 — Spec & Plan
- **Before starting:** Check test coverage of the target code. Low coverage = high risk.
- Plan must include:
  - Current state analysis (what's wrong)
  - Target state (what "good" looks like)
  - Refactoring steps (small, verifiable increments)
  - Safety net strategy (tests, type checks, lints)

### Step 4 — Development
- Make ONE change at a time
- After each change: verify behavior unchanged (tests + build)
- Never refactor and add features in the same change
- Prefer mechanical, tool-assisted refactoring (rename, extract, etc.)

### Step 5 — Acceptance
- Full test suite must pass
- Manual smoke test of affected area

## Common Rationalizations

| Rationalization | Reality |
|----------------|---------|
| "I'll refactor while adding this feature" | Two responsibilities, one change. Never mix refactoring with feature work. |
| "The tests are good enough" | If you're not sure coverage is adequate, add tests before refactoring. |
| "It's just a rename, nothing can break" | Renames break imports, types, and serialization. Verify. |

## Verification

- [ ] Pre-refactoring tests pass (baseline established)
- [ ] Post-refactoring tests pass (behavior preserved)
- [ ] No behavior changes beyond the refactoring scope
- [ ] Code is measurably better (simpler/faster/cleaner) by stated criteria
