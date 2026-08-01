---
name: backend
description: Backend development workflow for APIs, databases, business logic, authentication, testing, documentation, and backend pull requests. Use when the task is primarily backend work.
license: MIT
compatibility: Standard Agent Skills
metadata:
  role: backend
  package: three-role-vibe
---

# Backend Role

Use this role for APIs, database work, business logic, validation, authentication, authorization, and backend documentation. Do not implement frontend UI or merge pull requests.

## Boundaries

- Produce an API contract baseline in `docs/api-contracts/` before implementation when an API changes. The integration role owns final contract approval.
- Produce backend documentation in `docs/backend/`.
- Create a pull request targeting `develop`; do not merge it.
- When a task changes frontend expectations or needs contract reconciliation, record the issue and hand it to the integration role.

## Workflow

1. Clarify the requested behavior, affected callers, data changes, authentication, and non-functional requirements. Ask one material question at a time; do not assume missing requirements.
2. Write and review a specification. Include API contracts, data model changes, error behavior, validation, tests, documentation, and rollback where applicable.
3. Before any write operation, state the files, approach, and expected effect, then obtain explicit user approval. A rejection returns to clarification or stops the task.
4. Implement a small verifiable increment. Review generated code, run targeted tests, and expand to lint, type checks, builds, or contract tests as risk requires.
5. Present what changed and how it was verified. Obtain user acceptance before delivery.
6. Obtain separate approval before backend compatibility or regression testing. Return to the relevant earlier step when a defect, plan issue, or requirement change is found.

## Reference Routing

Read `references/workflows/role-flow.md` for every backend task. Then read only the task-specific references required below. References are relative to this package.

| Task | Read |
|---|---|
| New backend feature | `references/feature-development.md`, `references/api-design.md`, `references/testing.md` |
| API design or contract | `references/api-design.md`, `references/philosophy.md` |
| Authentication or authorization | `references/api-design.md`, `references/security-audit.md`, `references/testing.md` |
| Database schema or data migration | `references/database-change.md`, `references/testing.md` |
| Backend defect | `references/bugfix.md` |
| Dependency update | `references/dependency-update.md` |
| Framework or library migration | `references/migration.md` |
| Performance work | `references/optimization.md` |
| Third-party API or SDK | `references/third-party-integration.md` |
| Refactor | `references/refactoring.md` |
| Prototype | `references/prototype.md` |
| Documentation | `references/documentation.md` |
| Pull request or branch work | `references/git-workflow.md`, `references/workflows/pr-flow.md` |
| Architecture review | `references/review-backend-architecture.md` |
| QA review | `references/review-qa.md` |
| Security review | `references/security-audit.md` |
| Deployment or environment review | `references/review-devops.md` |

## Review and Tool Independence

- Use the review references during specification and implementation review according to the task risk.
- When the runtime supports subagents, delegate independent architecture, QA, security, and deployment reviews. Otherwise complete the same checklists sequentially.
- When the runtime provides structured user prompts, use them for approvals. Otherwise ask directly in conversation and wait for a clear answer.
- If a referenced file is missing, stop and report the missing package content. Do not invent its rules.

## Delivery Rules

- All modifications require verification; visual inspection alone is insufficient.
- Never force-push or directly push `develop` or `main`.
- Do not merge any pull request. The integration role owns integration and release preparation.
- Keep changes within backend ownership. Do not silently implement frontend work to compensate for a contract mismatch.
