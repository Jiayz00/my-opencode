# Three-Role Agent Skills

Standard Agent Skills for three software-delivery roles: `frontend`, `backend`, and `integration`.

The package exposes only three selectable skills. After a role is selected, its entry `SKILL.md` first reads that role's complete `references/workflows/role-flow.md`, then identifies the task and reads only the detailed references needed for that work. The 52 detailed practices are internal references, not independently selectable skills.

## Skills

| Skill | Use for | Primary outputs |
|---|---|---|
| `frontend` | UI, components, state, accessibility, browser validation, frontend documentation | frontend code, `docs/frontend/`, PR to `develop` |
| `backend` | APIs, data, business logic, authentication, backend testing, backend documentation | backend code, `docs/api-contracts/`, `docs/backend/`, PR to `develop` |
| `integration` | PR integration, contract reconciliation, end-to-end validation, compatibility, release preparation | integrated `develop`, project docs, `develop` to `main` merge PR |

Use your agent tool's native Skill picker or loading mechanism to select one of these names. The Agent Skills standard does not require a particular slash-command spelling, so this repository does not ship tool-specific commands.

## Workflow

Each role's `role-flow.md` uses the same six control stages, adapted to its ownership:

1. Clarify requirements.
2. Produce and review a specification or plan.
3. Obtain explicit approval before writes.
4. Implement or review a verifiable increment.
5. Present acceptance evidence and obtain user feedback.
6. Obtain separate approval before compatibility or regression testing.

The role entry provides a task-routing table. `role-flow.md` is the role's complete workflow: stage gates, approval points, review triggers, loop rules, and delivery checklist. Focused files under `references/` provide API design, accessibility, database migration, code review, release preparation, and similar specialized rules. `pr-flow.md`, `integrate-flow.md`, and `release-flow.md` are delivery-stage workflows, not replacements for the role flow.

## Collaboration Rules

- Backend owns API contract baselines. Integration owns final contract reconciliation.
- Frontend uses the agreed contract and mocks unavailable services; it does not invent backend behavior.
- Backend and frontend do not merge PRs.
- Integration may merge approved work into `develop` only after confirmation, conflict handling, and retesting.
- Release preparation creates a `develop` to `main` merge PR. A human merges `main`.
- Do not force-push or directly push `develop` or `main`.

## Layout

```text
.agents/
  skills/
    backend/
      SKILL.md
      references/                 # 18 backend practices + role and PR workflows
    frontend/
      SKILL.md
      references/                 # 17 frontend practices + role and PR workflows
    integration/
      SKILL.md
      references/                 # 17 integration practices + role, integration, PR, and release workflows
scripts/
  validate-skills.mjs
AGENTS.md
CHANGELOG.md
LICENSE
```

The package contains 3 entry skills, 52 reference documents, 3 role-flow references, and 5 specialized workflow references.

## Reference Coverage

- Backend: API design, data migrations, testing, dependencies, migrations, performance, third-party integration, security, reviews, Git and PR workflow.
- Frontend: design, accessibility, testing, browser acceptance, dependencies, migrations, performance, security, reviews, Git and PR workflow.
- Integration: contract reconciliation, PR integration, full-stack acceptance, compatibility, CI/CD, release preparation, security, reviews, Git and PR workflow.

## Test Environment Variables

Integration references use the following portable names when a test server is needed:

```text
TEST_SERVER_HOST
TEST_SERVER_USER
TEST_SERVER_KEY
TEST_SERVER_PORT
TEST_SERVER_DIR
```

Keep their values outside the repository. The package's Git workflows treat secrets, private keys, `.env` files, and test-server credentials as blocked content.

## Validation

Run after changing package content:

```bash
node scripts/validate-skills.mjs
```

It verifies the three-entry layout, standard frontmatter, reference counts, role and specialized workflow files, and absence of legacy runtime-specific paths, commands, and names.

## Contributing

1. Keep role ownership and workflow gates intact.
2. Update the relevant entry routing table when adding or renaming a reference.
3. Keep references tool-independent: describe user confirmation and optional delegation behavior without binding to a particular agent API.
4. Run the validation script and inspect `git diff --check`.
5. Do not commit, push, or create a pull request unless explicitly requested.
