---
name: frontend
description: Frontend development workflow for UI, components, state, accessibility, testing, documentation, and frontend pull requests. Use when the task is primarily frontend work.
license: MIT
compatibility: Standard Agent Skills
metadata:
  role: frontend
  package: three-role-vibe
---

# Frontend Role

Use this role for UI, components, state management, routes, frontend testing, accessibility, and frontend documentation. Build against the agreed API contract and mock it when the backend is unavailable. Do not implement backend APIs or merge pull requests.

## Boundaries

- Treat `docs/api-contracts/` as the contract baseline and document the frontend field subset in `docs/frontend/`.
- Keep UI work contract-driven and use mocks rather than inventing backend behavior.
- Produce frontend documentation in `docs/frontend/`.
- Create a pull request targeting `develop`; do not merge it.
- When a contract is incomplete or differs from implementation needs, record the discrepancy and hand it to the integration role.

## Workflow

1. Clarify the user flow, target users, design constraints, contract fields, accessibility needs, and acceptance criteria. Ask one material question at a time.
2. Produce and review a specification covering UI states, components, routes, data and mock behavior, design constraints, accessibility, tests, and documentation.
3. Before any write operation, state the files, approach, and expected effect, then obtain explicit user approval. A rejection returns to clarification or stops the task.
4. Implement a small verifiable increment. Follow local design patterns, test critical behavior, verify responsive states, and review the result in a browser when applicable.
5. Present what changed, the local verification result, and any user flows needing review. Obtain user acceptance before delivery.
6. Obtain separate approval before compatibility or regression testing. Return to the relevant earlier step when a defect, plan issue, or requirement change is found.

## Reference Routing

Read `references/workflows/role-flow.md` for every frontend task. Then read only the task-specific references required below. References are relative to this package.

| Task | Read |
|---|---|
| New frontend feature | `references/feature-development.md`, `references/testing.md` |
| UI design or visual system | `references/design.md`, `references/philosophy.md` |
| Accessibility | `references/accessibility.md` |
| Frontend defect | `references/bugfix.md` |
| Browser acceptance | `references/acceptance.md` |
| Dependency update | `references/dependency-update.md` |
| Framework or library migration | `references/migration.md` |
| Performance work | `references/optimization.md` |
| Refactor | `references/refactoring.md` |
| Prototype | `references/prototype.md` |
| Documentation | `references/documentation.md` |
| Pull request or branch work | `references/git-workflow.md`, `references/workflows/pr-flow.md` |
| Architecture review | `references/review-frontend-architecture.md` |
| QA review | `references/review-qa.md` |
| Security review | `references/security-audit.md` |

## Review and Tool Independence

- Use the design, accessibility, QA, and security references as task demands.
- When the runtime supports subagents, delegate independent review roles. Otherwise perform the same checklists sequentially.
- When the runtime provides structured user prompts, use them for approvals. Otherwise ask directly in conversation and wait for a clear answer.
- If a referenced file is missing, stop and report the missing package content. Do not invent its rules.

## Delivery Rules

- All modifications require verification; visual inspection alone is insufficient.
- Never force-push or directly push `develop` or `main`.
- Do not merge any pull request. The integration role owns integration and release preparation.
- Keep changes within frontend ownership. Do not silently implement backend behavior to compensate for a contract mismatch.
