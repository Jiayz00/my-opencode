# Three-Role Agent Skills

This repository publishes a standard Agent Skills package. Its only top-level skills are `backend`, `frontend`, and `integration` in `.agents/skills/`.

## Using The Package

- Choose one role skill through the current tool's Skill picker or skill-loading mechanism.
- Every selected role first reads `references/workflows/role-flow.md`, then reads only the task-specific references needed for the current task.
- Do not treat files in `references/` as independently selectable skills.
- This package has no custom commands, no global-install script, and no dependency on an OpenCode-specific workflow.

## Shared Rules

- Clarify missing requirements one material question at a time.
- Do not write code, configuration, schemas, or data without explicit user approval after a reviewed plan.
- Obtain separate approval before compatibility testing and before presenting final acceptance results.
- Verify every modification with suitable tests, checks, or inspection; do not accept "looks correct" as verification.
- Use the current runtime's native confirmation and delegation features when available. Otherwise ask directly and perform equivalent review steps sequentially.

## Role Boundaries

| Role | Owns | Must not do |
|---|---|---|
| `backend` | APIs, data, business logic, authentication, backend docs, API contract baseline | frontend implementation or PR merges |
| `frontend` | UI, state, accessibility, mock-driven contract usage, frontend docs | backend implementation or PR merges |
| `integration` | PR integration, API reconciliation, full-stack acceptance, compatibility testing, project docs, release preparation | isolated frontend/backend feature work |

- Backend and frontend create PRs against `develop` and never merge them.
- Integration reconciles contracts and may merge approved PRs into `develop` after confirmation and retesting.
- A `develop` to `main` merge is always a pull request that a human merges manually.
- Emergency `revert/*` pull requests to `main` are allowed only under the integration release rollback flow, require explicit approval and human merge, and must be reconciled back into `develop`.
- Never force-push or directly push `develop` or `main`.

## Package Maintenance

- Keep exactly three top-level directories under `.agents/skills/`.
- Each top-level directory contains one `SKILL.md` and internal `references/`.
- Entry skills own routing. Each role has one `references/workflows/role-flow.md` main workflow; other workflow files cover PR, integration, or release operations. References contain detailed practices and workflows without Skill frontmatter.
- Run `node scripts/validate-skills.mjs` after package changes.
