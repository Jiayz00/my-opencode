---
name: integration
description: Integrate a third-party service, API, or library. Full 6-step with emphasis on contract verification and error handling.
---

# Integration

## Overview

Integrating external systems introduces dependency risk. The focus is on contract verification, error handling, and graceful degradation.

## Step Adjustments

### Step 1 — Requirements Clarification
Ask for:
- Which external service/library to integrate
- What data flows in/out
- Authentication method (API key, OAuth, etc.)
- Any existing integration patterns in the codebase to follow
- Fallback behavior when the external service is unavailable

### Step 2 — Spec & Plan
Spec must include:
- Integration pattern (adapter/facade layer to isolate third-party code)
- Error handling strategy (timeouts, retries, circuit breaker)
- Authentication handling
- Rate limiting consideration
- Test strategy (mock vs real endpoint)

### Step 4 — Development
- Wrap external dependency in an adapter/abstraction layer
- NEVER expose third-party types directly to the rest of the codebase
- Handle all error scenarios: timeout, auth failure, malformed response, rate limit

### Step 5 — Acceptance
- Test with real endpoint if possible (not just mocks)
- Verify auth flow works end-to-end
- Test error scenarios: network failure, invalid credentials, malformed data
- Verify fallback behavior

## Common Rationalizations

| Rationalization | Reality |
|----------------|---------|
| "I'll add error handling later" | The integration IS error handling. Do it now. |
| "The API always returns this shape" | APIs change. Validate responses. |
| "I'll use the SDK directly everywhere" | Wrap it. When the SDK changes, you'll thank yourself. |

## Verification

- [ ] External service is wrapped behind an adapter/abstraction
- [ ] Error handling covers: timeout, auth failure, bad response, rate limit
- [ ] Integration tests pass with real endpoints
- [ ] Fallback behavior works when service is offline
- [ ] No third-party types leak into core code
