---
name: code-review
description: Review code quality, architecture, security, and maintainability. Read-only — no code changes allowed.
---

# Code Review

## Overview

This is a read-only scenario. The purpose is to analyze code and provide actionable feedback, NOT to write or modify code. Follow the 6-step workflow adapted for review.

## Workflow Adaptation

The 6-step workflow is read-only specific:

### Step 1 — Clarify
Ask the user:
- What code needs review? (specific files, PR, or entire directory)
- What aspects to focus on? (architecture? correctness? security? style?)
- Any known concerns?

### Step 2 — Analyze (replaces Spec & Plan)
Review across these dimensions:
- **Correctness:** Logic errors, edge cases, race conditions
- **Architecture:** Coupling, cohesion, separation of concerns
- **Security:** Input validation, auth, data exposure
- **Performance:** Obvious inefficiencies, N+1 queries, memory leaks
- **Maintainability:** Readability, naming, complexity, test coverage
- **Consistency:** Follows existing patterns and conventions

Write review document with:
- Summary of findings (severity: critical/major/minor/nit)
- Specific file:line references for each finding
- Suggested fixes (text description only — no code edits)

### Step 3 — Gate (same: ask permission)
"Here's my review. May I present the full findings?"

### Step 4 — Not applicable (no coding)

### Step 5 — Acceptance
Present review document. Wait for user feedback.

### Step 6 — Not applicable

## Critical Rules

- **Do NOT edit any file during review**
- **Do NOT run bash commands that modify the system**
- Focus on patterns and principles, not line-by-line nitpicking
- Prioritize findings that could cause production issues

## Verification

- [ ] Review covers all relevant dimensions
- [ ] Every finding has a specific location reference
- [ ] Severity labels are applied consistently
- [ ] No files were modified during review
