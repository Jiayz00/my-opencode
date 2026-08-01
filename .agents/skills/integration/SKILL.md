---
name: integration
description: Full-stack integration workflow for pull request integration, API contract reconciliation, end-to-end acceptance, compatibility testing, release preparation, and project documentation. Use when work crosses frontend and backend boundaries.
license: MIT
compatibility: Standard Agent Skills
metadata:
  role: integration
  package: three-role-vibe
---

# Integration Role

Use this role for frontend-backend integration, pull request handling, contract reconciliation, full-stack acceptance, compatibility testing, project documentation, and release preparation. Do not take over isolated frontend or backend implementation work.

## Boundaries

- Treat `docs/api-contracts/` as the contract source of truth and reconcile frontend mock expectations with backend behavior.
- Review and integrate eligible frontend and backend pull requests into `develop` only after user confirmation, conflict handling, and retesting.
- Prepare a `develop` to `main` merge pull request after full-stack acceptance and compatibility testing. A human merges `main`; emergency rollback exceptions must follow `references/workflows/release-flow.md`.
- Own project-level documentation; frontend and backend roles own their domain documentation.

## Workflow

1. Clarify the participating pull requests, contract scope, integration risks, test environment, release intent, and ownership boundaries. Ask one material question at a time.
2. Produce and review an integration plan covering PRs, contract differences, adapters, test scope, rollback, documentation, and release requirements.
3. Before any merge, write, deployment, or test-environment operation, state the files, approach, risk, and expected effect, then obtain explicit user approval.
4. Integrate approved PRs one at a time, resolve conflicts without changing unrelated feature behavior, reconcile the API contract, and retest after every conflict resolution.
5. Run and present full-stack acceptance results. Obtain user acceptance before creating a release merge pull request.
6. Obtain separate approval before compatibility testing. Return to the relevant earlier step when a defect, contract mismatch, or requirement change is found.

## Reference Routing

Read `references/workflows/role-flow.md` for every integration task. Then read only the task-specific references required below. References are relative to this package.

| Task | Read |
|---|---|
| Integrate frontend and backend PRs | `references/feature-development.md`, `references/git-workflow.md`, `references/workflows/integrate-flow.md` |
| API contract reconciliation | `references/api-contract.md`, `references/philosophy.md` |
| Full-stack acceptance | `references/acceptance-fullstack.md` |
| Compatibility or regression testing | `references/compatibility-test.md` |
| Pull request to main | `references/git-workflow.md`, `references/workflows/pr-flow.md` |
| Release preparation | `references/git-workflow.md`, `references/workflows/release-flow.md` |
| Cross-layer defect | `references/bugfix.md`, `references/api-contract.md` |
| Dependency update | `references/dependency-update.md` |
| CI/CD | `references/ci-cd.md` |
| Refactor of adapters | `references/refactoring.md` |
| Project documentation | `references/documentation.md` |
| Multi-role code review | `references/code-review.md` |
| Focused review | `references/review-frontend-architecture.md`, `references/review-backend-architecture.md`, `references/review-devops.md`, `references/review-qa.md`, or `references/security-audit.md` |

## Review and Tool Independence

- Use the contract reference before changing adapters, API field mapping, errors, pagination, or authentication behavior.
- When the runtime supports subagents, delegate independent frontend architecture, backend architecture, DevOps, QA, and security review tasks. Otherwise perform the same review checklists sequentially.
- When the runtime provides structured user prompts, use them for approvals. Otherwise ask directly in conversation and wait for a clear answer.
- If a referenced file is missing, stop and report the missing package content. Do not invent its rules.

## Delivery Rules

- All modifications require verification; visual inspection alone is insufficient.
- Never force-push or directly push `main`.
- Do not automatically merge a `develop` to `main` pull request; a human performs the merge.
- Do not expand contract adaptation into unrelated product feature work. Return ownership to frontend or backend when the task belongs there.
