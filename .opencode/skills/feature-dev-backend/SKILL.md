---
name: feature-dev-backend
description: Build a new backend feature from scratch. Full 6-step with emphasis on API design, data modeling, and integration testing.
---

# Feature Development — Backend

## Overview

Use this when building new server-side functionality. The generic 6-step workflow applies. This skill adds backend-specific details to each step.

## Step Adjustments

### Step 1 — Requirements Clarification
Ask specifically about:
- API style (REST/GraphQL/gRPC/etc.)
- Data model changes needed
- Authentication/authorization requirements
- Performance requirements (expected throughput, latency)
- Existing patterns to follow

### Step 2 — Spec & Plan
Spec must include:
- API endpoints (method, path, request/response shapes)
- Data model / schema changes
- Business logic flow
- Error handling strategy
- Validation rules

### Step 4 — Development
- Contract-first: define API shapes before implementing
- Add error handling and input validation
- Write tests alongside implementation
- Follow existing error handling patterns

### Step 5 — Acceptance
- Run full test suite
- Verify API responses match spec
- Check error cases return proper status codes
- Verify auth/authorization works

## Verification

- [ ] All endpoints respond with correct status codes
- [ ] Input validation catches invalid data
- [ ] Auth/authorization enforced where expected
- [ ] Error responses are consistent with existing patterns
- [ ] All tests pass
- [ ] Existing behavior not broken
