# Vibe Coding Workflow

This project follows a strict 6-step vibe coding workflow. You MUST follow this workflow in every session.

## Core Rules (Non-Negotiable)

At the start of every session, run `opencode /vibe` to load the `vibe-core` workflow.

**Always:**
- Start each session by loading vibe-core skill
- Use the `question` tool when the workflow says "use question"
- Follow the 6-step process in order (1→2→3→4→5→6)
- Return to earlier steps when issues are found (as specified in the flow)
- Verify everything — "looks right" is never enough

**Ask first before:**
- Writing any code (Step 3 gate)
- Starting compatibility testing (Step 6 gate)
- Reporting acceptance results (Step 5 gate)
- Making schema changes or adding dependencies

**Never:**
- Skip steps or reorder them
- Start coding without a reviewed spec and explicit permission
- Assume requirements — always use `question` to clarify
- Skip verification because "it's a small change"

## Scenario Skills

When vibe-core's workflow tells you to load a scenario-specific skill, use the `skill` tool to load one of:

| Skill | When |
|-------|------|
| `feature-dev-frontend` | New frontend feature from scratch |
| `feature-dev-backend` | New backend feature from scratch |
| `feature-dev-fullstack` | New full-stack feature from scratch |
| `optimization-frontend` | Improve frontend performance/UX |
| `optimization-backend` | Improve backend performance/reliability |
| `bugfix` | Fix a bug (any layer) |
| `refactoring` | Restructure code without changing behavior |
| `code-review` | Review code quality |
| `review-frontend-arch` | Frontend architecture review (subagent) |
| `review-backend-arch` | Backend architecture review (subagent) |
| `review-devops` | DevOps/deployment review (subagent) |
| `review-qa` | QA/regression risk review (subagent) |
| `prototype` | Quick proof-of-concept |
| `integration` | Third-party integration |
| `migration` | Tech stack or version migration |
| `hotfix` | Emergency production fix |
| `project-init` | New project setup |
| `database-change` | Schema/migration changes |
| `security-audit` | Security review |
| `dependency-update` | Update dependencies |
| `acceptance-frontend` | Frontend acceptance verification |
| `acceptance-fullstack` | Full-stack acceptance verification |
| `compatibility-test` | Compatibility regression testing |
| `ci-cd` | CI/CD pipeline and Docker configuration |
| `docs` | Documentation, README, changelog |
| `architecture` | Architecture decisions and ADRs |

## 网络

代理端口: 7897

