---
name: database-change
description: Schema design, migration scripts, and data operations. Full 6-step with emphasis on migration safety and rollback.
---

# Database Change

## Overview

Database changes are high-risk because they affect all layers of the stack. The workflow emphasizes careful migration design, data preservation, and rollback planning.

## Step Adjustments

### Step 1 — Requirements Clarification
Ask for:
- What data needs to be stored/changed
- Whether this is additive (new table/column) or destructive (drop/rename)
- Existing data volume (how much data needs migration?)
- Downtime tolerance
- Rollback requirements

### Step 2 — Spec & Plan
Spec must include:
- Schema change (exact SQL or ORM migration)
- Data migration strategy (if moving/transforming data)
- Rollback migration (how to undo)
- Impact analysis (what application code needs updating)
- Zero-downtime approach if required

### Step 3 — Permission Gate
Present full migration plan. User MUST approve before any schema changes.

### Step 4 — Development
- Write migration script
- Write rollback script
- Test migration on a copy of production data (or representative sample)
- Verify data integrity before and after

### Step 6 — Compatibility
Critical for destructive changes:
- Verify application works with new schema
- Verify rollback works correctly
- Test with actual data volume (performance of migration)

## Common Rationalizations

| Rationalization | Reality |
|----------------|---------|
| "It's just adding a column" | Famous last words. Write the rollback. |
| "The migration is reversible" | Prove it. Test the rollback. |
| "Small data, no need to test" | Schema changes affect queries. Test with realistic data. |

## Verification

- [ ] Migration script runs clean
- [ ] Rollback script runs clean (tested)
- [ ] Data integrity verified before and after
- [ ] Application code updated to match new schema
- [ ] Migration tested with realistic data volume
