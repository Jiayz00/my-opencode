---
name: optimization-backend
description: Improve backend performance, reliability, or efficiency. Measure-first with focus on test container verification.
---

# Backend Optimization

## Overview

Backend optimization follows the 6-step workflow. Key differences: baseline measurement in Step 2, staged rollout in Step 4, and test container verification in Step 5.

## Step Adjustments

### Step 1 — Requirements Clarification
Ask for:
- What metric matters most? (latency? throughput? memory? cost?)
- Current performance and target
- Load patterns (concurrent users, request distribution)
- Any constraints (must not change API contract)

### Step 2 — Spec & Plan
- Baseline: profile the current system under realistic load
- Plan must include specific optimization targets with numbers

### Step 4 — Development
- Change one component at a time
- Profile before moving to next optimization
- Safe rollback strategy for each change

### Step 5 — Acceptance
- Test in test container under realistic load
- Verify API contract unchanged
- Present before/after metrics in user report

## Verification

- [ ] Baseline metrics captured
- [ ] Each optimization verified independently
- [ ] API contract unchanged
- [ ] No performance regressions in other areas
- [ ] Test container validation passed
