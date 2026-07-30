---
name: bugfix
description: Fix a bug in any layer. Starts with reproduction and root-cause analysis before writing any fix.
---

# Bug Fix

## Overview

Bug fixes follow the 6-step workflow with a stronger emphasis on reproduction and root cause analysis in Step 2. The goal is to fix the root cause, not just the symptom.

## Step Adjustments

### Step 1 — Requirements Clarification
Ask for:
- Steps to reproduce (exact, detailed)
- Expected vs actual behavior
- Environment details (browser/OS/version)
- When did it start? Any recent changes?
- Severity (blocker / major / minor)

### Step 2 — Spec & Plan
- Step 1: **Reproduce** — confirm you can see the bug
- Step 2: **Localize** — identify the root cause (specific file, function, condition)
- Step 3: **Design the fix** — decide what to change and why
- For complex bugs: write a mini-spec describing root cause and fix approach

### Step 3 — Permission Gate
Present: "I identified the root cause as [X] in [file:line]. The fix is [approach]. May I proceed?"

### Step 4 — Development
- Apply the fix
- Add a regression test that would catch this bug
- Verify the fix and that existing tests still pass

### Step 5 — Acceptance
- Confirm the bug is resolved (run reproduction steps)
- Run existing test suite
- If frontend: visual check

### Step 6 — Compatibility
- Run regression tests focused on the affected area

## Common Rationalizations

| Rationalization | Reality |
|----------------|---------|
| "I know what's wrong, I'll just fix it" | Skip reproduction and you might fix the wrong thing. Reproduce first. |
| "This is a one-line fix, no need for a plan" | One-line fixes still need root cause analysis. |
| "I'll add the regression test later" | Now or never. Regression tests are part of the fix. |

## Verification

- [ ] Bug is reproduced and confirmed
- [ ] Root cause is identified (not just symptom)
- [ ] Fix addresses root cause
- [ ] Regression test added
- [ ] All existing tests pass
