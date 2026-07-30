---
name: optimization-frontend
description: Improve frontend performance or user experience. Measure-first approach with emphasis on Step 5 local acceptance.
---

# Frontend Optimization

## Overview

Optimization follows the 6-step workflow but with a stronger emphasis on Step 2 (baseline measurement) and Step 5 (local start + user verification). Never optimize without measuring first.

## Step Adjustments

### Step 1 — Requirements Clarification
Ask for:
- What specifically needs to improve? (load time? interaction? bundle size?)
- Current pain points and target metrics
- Device/browser/network conditions to optimize for
- Any constraints (must not break existing behavior)

### Step 2 — Spec & Plan
- **Before anything:** Establish baseline metrics
- Plan must include:
  - Current measurement (with tools/numbers)
  - Target measurement
  - Optimization approach(es) to try
  - How each approach will be validated

### Step 3 — Permission Gate
Present: "Baseline is [metric A: Xms]. Target is [metric A: <Yms]. Approach: [Z]. May I proceed?"

### Step 4 — Development
- Make ONE optimization at a time
- After each: re-measure, compare to baseline
- Revert optimizations that don't improve metrics
- Document findings even for failed attempts

### Step 5 — Acceptance (Critical)
1. Start local dev server
2. Self-test all optimized paths
3. Use `question` tool to present:
   - Before/after metrics
   - What changed
   - Local URL for user verification
4. Wait for user to accept via browser check
5. If user requests changes → return to Step 1

## Common Rationalizations

| Rationalization | Reality |
|----------------|---------|
| "This optimization is obviously faster" | Obvious is not evidence. Measure before and after. |
| "I'll optimize all the things at once" | One change at a time or you won't know what worked. |
| "The metrics look good in my environment" | User verification is required. Their environment may differ. |

## Verification

- [ ] Baseline metrics recorded
- [ ] Each optimization measured independently
- [ ] Before/after comparison documented
- [ ] No regressions in other areas
- [ ] User accepted via local browser check
