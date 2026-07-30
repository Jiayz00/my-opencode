---
name: prototype
description: Quick proof-of-concept or experimental feature. Abbreviated workflow — speed is prioritized, but structure is maintained.
---

# Prototype / POC

## Overview

Prototypes are for exploration and validation, not production. The workflow is abbreviated: Step 2 is lightweight, Step 3 permission is still required, and Step 5-6 may be skipped entirely.

## Workflow Adaptation

### Step 1 — Clarify
Ask:
- What question are we trying to answer with this prototype?
- What "good enough" looks like (success criteria for the POC)
- Is there a time box? (e.g., "spend no more than 2 hours")
- Will this code be thrown away or evolved into production?

### Step 2 — Spec & Plan (Lightweight)
- Brief 1-paragraph plan describing the approach
- No multi-round review needed — one round is sufficient
- Focus on the risky/unknown part (what we're trying to learn)

### Step 3 — Permission Gate
Present: "Prototype approach: [brief plan]. Estimated effort: [time]. May I proceed?"

### Step 4 — Development
- Speed over quality (within reason)
- Minimal tests or none (prototype quality)
- Comment anything that would need rework for production
- Call out unknowns discovered during building

### Step 5 — Acceptance
- Demonstrate the prototype works
- Ask: is this direction correct? Should we productionize it?

### Step 6 — Skip (unless explicitly requested)

## Verification

- [ ] Prototype answers the question it was built for
- [ ] Risks/unknowns are documented
- [ ] Decisions needed for production path are captured
- [ ] User approves direction or provides next steps
