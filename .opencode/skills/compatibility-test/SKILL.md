---
name: compatibility-test
description: Full-stack compatibility regression testing. Verifies new changes don't break existing functionality across all layers.
---

# Compatibility Test

## Overview

This is Step 6 of the core workflow. After user acceptance, this verifies that the changes don't break any existing functionality. It's a full-stack, full-coverage regression test in the test container.

## Server Access

This skill requires access to a test server. Follow the **Sensitive Information Handling** rules in `vibe-core`:

1. Check env vars: `OPENCODE_TEST_HOST`, `OPENCODE_TEST_USER`, `OPENCODE_TEST_KEY`, `OPENCODE_TEST_PORT`, `OPENCODE_TEST_DIR`
2. If missing, use `question` to ask the user one variable at a time
3. Never save credentials to files or echo them back

## Process

### 1. Gate
Use `question` tool to ask user for permission:
- "Compatibility testing will run full-stack regression tests to ensure no existing functionality is broken by the changes. This covers frontend, backend, API, database, and integration. May I proceed?"
- Do NOT start without explicit permission

### 2. Test Preparation
- Ensure test server environment is clean (no stale state from acceptance testing)
- Deploy the version with changes: SSH → docker-compose up -d --build
- Prepare test data if needed

### 3. Frontend Regression
- Verify all existing pages/routes load without errors
- Check critical user flows still work
- No new console errors
- Responsive layout not broken

### 4. Backend Regression
- Run full test suite
- Verify all existing API endpoints respond correctly
- Check backward compatibility (if API contract changed)
- No performance regressions under load

### 5. Integration Regression
- Frontend-backend connectivity still works
- Database queries return expected results
- Auth/authorization flows unchanged
- Third-party integrations still functional

### 6. Issue Handling
- If issues found:
  - Collect full details (logs, screenshots, reproduction steps)
  - Summarize each issue with severity
  - Return to Step 2 of core workflow
- If clean: report to user

### 7. Final Report
Use `question` tool:
- "Compatibility testing complete. All regression tests pass. [List what was tested]. Ready for deployment."

## Common Rationalizations

| Rationalization | Reality |
|----------------|---------|
| "This change is too small to need compatibility testing" | Small changes can break big things. Run the tests. |
| "I already tested this in Step 5" | Step 5 tests the NEW feature. Step 6 tests existing features aren't broken. Different scope. |
| "The test container setup takes too long" | It's not optional. Ask the user; let them decide. |

## Verification

- [ ] User granted permission via `question`
- [ ] Frontend regression: all pages/routes load
- [ ] Backend regression: all tests pass
- [ ] Integration: frontend-backend connectivity intact
- [ ] All regressions documented if found
- [ ] Final report delivered to user
