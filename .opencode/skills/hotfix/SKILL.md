---
name: hotfix
description: Emergency production fix. Abbreviated workflow — speed is critical but quality gates are maintained at minimum viable level.
---

# Hotfix

## Overview

Hotfixes are for production emergencies where normal process would cause unacceptable delay. The workflow is abbreviated but NOT skipped. Every step happens — just faster.

## Workflow Adaptation

### Step 1 — Clarify
Quick confirmation only:
- What's broken?
- Where (which environment, which users)?
- Severity (how many users affected, revenue impact)?
- Time sensitivity (how fast does this need to ship)?

### Step 2 — Spec & Plan (Abbreviated)
- Identify root cause quickly
- Design minimal fix (the smallest change that resolves the emergency)
- Write 3-5 line plan
- **Skip multi-round review** — one quick self-review is sufficient

### Step 3 — Permission Gate
Present: "Production issue: [what's broken]. Root cause: [identified]. Fix: [minimal change]. Estimated risk: [low/medium/high]. May I deploy?"

### Step 4 — Development
- Smallest possible change
- Test the fix locally
- Do NOT refactor or improve surrounding code
- Document any technical debt introduced

### Step 5 — Acceptance
- Deploy to production
- Verify the fix resolves the issue in production
- Monitor for 15-30 minutes after deploy

### Step 6 — Post-mortem
After the emergency is resolved:
- Create a follow-up task for proper root cause analysis
- Schedule the "real" fix (if the hotfix was temporary)
- Document what happened

## Common Rationalizations

| Rationalization | Reality |
|----------------|---------|
| "It's production, I'll skip the check" | Production is exactly when you need the check. |
| "I'll fix it properly later" | You won't. Create a ticket now. |
| "The root cause is obvious" | Verify first. Obvious != correct. |

## Verification

- [ ] Fix resolves the reported issue in production
- [ ] No new issues introduced (monitored)
- [ ] Follow-up ticket created for proper RCA
- [ ] Temporary workarounds are documented
