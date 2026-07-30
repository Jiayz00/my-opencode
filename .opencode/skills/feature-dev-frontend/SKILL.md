---
name: feature-dev-frontend
description: Build a new frontend feature from scratch. Full 6-step with emphasis on UI component structure, styling patterns, and browser verification.
---

# Feature Development — Frontend

## Overview

Use this when building a new user-facing feature. The generic 6-step workflow applies. This skill adds frontend-specific details to each step.

## Step Adjustments

### Step 1 — Requirements Clarification
Ask specifically about:
- Target framework (React/Vue/Angular/etc.)
- Styling approach (CSS Modules/Tailwind/styled-components/etc.)
- State management requirements
- Responsive design requirements
- Browser support targets

### Step 2 — Spec & Plan
Spec must include:
- Component tree / hierarchy
- Data flow (props, state, API calls)
- Loading/empty/error states for each component
- Routing changes if any

### Step 4 — Development
- Build UI components first (data-agnostic), then wire up data
- Follow existing component patterns in the codebase
- Ensure all states are handled: loading, empty, error, edge cases
- Use existing design system components when available

### Step 5 — Acceptance
- Start local dev server and self-test
- Verify in browser (not just unit tests)
- Check responsive layout
- Check loading/error states visually

## Verification

- [ ] Component renders all states (data, loading, empty, error)
- [ ] Responsive design works at target breakpoints
- [ ] No console errors
- [ ] Existing tests still pass
- [ ] Follows existing component patterns
