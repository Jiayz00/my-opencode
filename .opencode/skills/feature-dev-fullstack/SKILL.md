---
name: feature-dev-fullstack
description: Build a new full-stack feature touching frontend, backend, and data. Applies frontend and backend skills together with integration focus.
---

# Feature Development — Full Stack

## Overview

Use this when a feature spans frontend, backend, and database. Combines `feature-dev-frontend` and `feature-dev-backend`. Integration testing is critical.

## Step Adjustments

### Step 1 — Requirements Clarification
Ask about everything from both frontend and backend lists, plus:
- Data flow from UI → API → DB and back
- API contract between frontend and backend
- CORS/network considerations

### Step 2 — Spec & Plan
Spec must include:
- Full data flow diagram (UI → API → Service → DB → response)
- API contract (shared types/schemas)
- Component tree + data dependencies
- Integration test plan

### Step 4 — Development
Order:
1. Data model / schema
2. Backend API endpoints
3. Frontend components + API integration
4. Integration wiring (verify end-to-end)

### Step 5 — Acceptance
- Test in test container (not just local)
- Verify frontend connects to backend correctly
- Test full user flow from UI to DB and back
- Test error propagation (backend error → frontend display)

## Verification

- [ ] End-to-end flow works (UI → API → DB → response → display)
- [ ] Frontend handles all API response states (success, error, loading, empty)
- [ ] Backend validates input and handles edge cases
- [ ] Integration tests pass
- [ ] No CORS or connectivity issues
