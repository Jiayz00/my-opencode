---
name: migration
description: Migrate between tech stacks, versions, or platforms. Full 6-step with emphasis on parallel runs and rollback planning.
---

# Migration

## Overview

Migrations are high-risk changes. The workflow emphasizes thorough planning in Step 2, staged execution in Step 4, and careful compatibility testing in Step 6.

## Step Adjustments

### Step 1 — Requirements Clarification
Ask for:
- What is being migrated (framework? library? database? infra?)
- From what version to what version
- Breaking changes expected
- Rollback criteria (when do we abort?)
- Any parallel-run requirements (old + new side by side)

### Step 2 — Spec & Plan
Spec must include:
- Current state inventory (everything that needs to change)
- Migration approach (big bang vs incremental vs parallel)
- Breaking changes catalog with migration guides
- Rollback plan (how to revert if things go wrong)
- Testing strategy (what to verify at each stage)

### Step 4 — Development
- Staged approach: apply changes incrementally
- Keep old and new code paths coexisting when possible
- Each stage should be independently verifiable and reversible
- Commit migratable changes separately from non-migratable

### Step 6 — Compatibility (Critical)
- Old and new paths must produce identical results
- If parallel run mode: verify both outputs match
- Test performance characteristics (migrations often cause regressions)

## Verification

- [ ] Migration approach is documented and approved
- [ ] Rollback plan exists and is tested
- [ ] Each stage was independently verified
- [ ] Old and new paths produce identical results
- [ ] Performance characteristics are acceptable
