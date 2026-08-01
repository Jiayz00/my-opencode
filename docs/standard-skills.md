# Standard Skills Design

## Discovery Surface

The package intentionally exposes only these top-level skills:

- `backend`
- `frontend`
- `integration`

Each entry follows the Agent Skills `SKILL.md` format. Files under an entry's `references/` directory are ordinary Markdown documents, not discoverable skills. This keeps the Skill picker focused on role selection while preserving detailed workflow guidance.

## Reference Loading

The selected entry skill owns task routing. It must:

1. Identify the task category before loading detailed guidance.
2. Read only the reference files required by the active task.
3. Read `references/workflows/role-flow.md` before task-specific references; it is the selected role's complete workflow.
4. Read specialized workflow references for PR, integration, or release work at the applicable delivery stage.
5. Stop and report a missing reference rather than inventing its contents.
6. Apply the role boundary and approval gates from the entry skill before any reference-specific instruction.

References may point to another file in the same package as `references/<name>.md` or `references/workflows/<name>.md`. Each package must contain exactly one `references/workflows/role-flow.md`; it defines the six-stage role workflow, review triggers, loop rules, and final delivery checks. Other workflow files are specialized subflows and must not replace it.

## Runtime Independence

The content describes behavior rather than a runtime API:

- Ask the user for approval instead of requiring a named question tool.
- Use structured confirmation when the runtime offers it; otherwise ask in conversation.
- Delegate independent reviews when subagents are available; otherwise run equivalent checklists sequentially.
- Use the runtime's normal Git and GitHub mechanisms, but preserve branch, approval, verification, and human-merge rules.

No custom command, global configuration, or global installation procedure is part of this package.

## Content Rules

- Entry `SKILL.md` files carry standard YAML frontmatter and their directory-matching names.
- References have no Skill frontmatter.
- Keep detailed practices out of entry files unless they define role boundaries, routing, workflow gates, or tool-independent fallback behavior.
- Update an entry routing table whenever a reference is added, removed, or renamed. The entry must route every task through `references/workflows/role-flow.md`.
- Test-server references use `TEST_SERVER_*` variable names and never contain real credentials.

## Validation

Run `node scripts/validate-skills.mjs` after every package change. The validator checks the three-entry structure, reference inventories, role workflow content, frontmatter, and legacy runtime residue.
