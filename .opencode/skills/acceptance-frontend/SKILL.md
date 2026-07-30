---
name: acceptance-frontend
description: Frontend acceptance verification after development is complete. User-driven browser testing with structured reporting.
---

# Frontend Acceptance

## Overview

This is a focused acceptance workflow triggered after Step 4 (development) passes. It handles the frontend-specific acceptance path from Step 5 of the core workflow.

## When to Use

Use this when the core workflow's Step 5 requires frontend acceptance testing. This is typically after a frontend feature, optimization, or bug fix.

## Process

### 1. Pre-Check
- Build passes with no errors
- Dev server starts without issues
- All automated tests pass

### 2. Local Start
- Start the local dev server (`npm run dev` or equivalent)
- Verify the feature works in the browser
- Check: correct rendering, interactions, data display, error states

### 3. Self-Verification
- Run through the acceptance criteria from the spec
- Note any issues found
- If issues found:
  - Minor: fix directly, re-verify
  - Major: report via `question`, return to Step 4 of core workflow

### 4. User Report
Use `question` tool to present:
- Summary of what was built/changed
- Local URL (e.g., `http://localhost:5173`)
- Specific areas/features for the user to check
- Any known limitations or notes

### 5. User Acceptance
- Wait for user to confirm acceptance
- If user reports issues or requests changes → return to Step 1 of core workflow
- If user accepts → proceed to Step 6

## Verification

- [ ] Dev server starts and feature is accessible
- [ ] Feature matches acceptance criteria
- [ ] User has been notified via `question`
- [ ] User has accepted (or issues routed back)
