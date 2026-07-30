---
name: acceptance-fullstack
description: Full-stack acceptance verification in test container. End-to-end testing before compatibility testing.
---

# Full-Stack Acceptance

## Overview

This handles the full-stack acceptance path from Step 5 of the core workflow. Testing happens in a test container (not local), covering the complete frontend-backend-data flow.

## Server Access

This skill requires access to a test server. Follow the **Sensitive Information Handling** rules in `vibe-core`:

1. Check env vars: `OPENCODE_TEST_HOST`, `OPENCODE_TEST_USER`, `OPENCODE_TEST_KEY`, `OPENCODE_TEST_PORT`, `OPENCODE_TEST_DIR`
2. If missing, use `question` to ask the user one variable at a time
3. Never save credentials to files or echo them back

## Process

### 1. Pre-Check
- All unit/integration tests pass
- Build succeeds (frontend + backend)
- Test server is accessible (SSH connection verified)

### 2. Deploy to Test Container
- SSH into test server: `ssh -i %OPENCODE_TEST_KEY% %OPENCODE_TEST_USER%@%OPENCODE_TEST_HOST%`
- Navigate to deployment directory: `cd %OPENCODE_TEST_DIR%`
- Deploy: `docker-compose up -d --build` (or equivalent)
- Verify the container starts successfully: `docker ps`
- Confirm all services are running: check container logs

### 3. End-to-End Verification
Run through the complete user flow:
- Frontend connects to backend
- API endpoints respond correctly
- Data flows end-to-end (UI → API → DB and back)
- Error propagation works (backend error → frontend display)

If issues found:
- Collect full summary with logs/evidence
- Return to Step 2 of core workflow
- Do NOT proceed to user reporting

### 4. User Report
Use `question` tool to present:
- Summary of implementation
- Test environment URL
- Specific flows/features to verify
- Account/credentials if needed for testing

### 5. User Acceptance
- Wait for user to confirm acceptance
- If user reports issues or requests changes → return to Step 1 of core workflow
- If user accepts → proceed to Step 6

## Verification

- [ ] Application deployed to test container
- [ ] Frontend-backend connectivity verified
- [ ] End-to-end flow works (UI → API → DB)
- [ ] Error handling works end-to-end
- [ ] User has been notified via `question`
- [ ] User has accepted
