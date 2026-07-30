---
name: vibe-core
description: Master 6-step vibe coding workflow. Always load this first. Routes to scenario-specific skills based on task type. Use for any software development task.
---

# Vibe Core Workflow

## Overview

This is the master workflow for all development. It enforces a strict 6-step loop: **Clarify → Plan → Gate → Build → Verify → Ship**. Every session starts here.

The workflow is a state machine. Each step has an entry condition, a process, and an exit condition. If any step fails its checks, you return to an earlier step as specified.

```
Step 1: ┌──────────────────────────────────────┐
         │  Requirements Clarification         │
         │  Use `question` to confirm needs    │
         └──────────────┬───────────────────────┘
                        ▼
Step 2: ┌──────────────────────────────────────┐
         │  Spec & Plan Document                │
         │  3+ rounds multi-role review         │
         │  Optimize based on findings          │
         └──────────────┬───────────────────────┘
                        ▼
Step 3: ┌──────────────────────────────────────┐
         │  Permission Gate                     │
         │  Use `question` — "may I begin?"     │
         |  NO CODING without explicit yes      │
         └──────────────┬───────────────────────┘
                        ▼
Step 4: ┌──────────────────────────────────────┐
         │  Development & Review                │
         │  Code → Review → Verify              │
         │  Issues? → go to Step 2              │
         │  Clean? → proceed                    │
         └──────────────┬───────────────────────┘
                        ▼
Step 5: ┌──────────────────────────────────────┐
         │  Acceptance Testing                  │
         │  Frontend: local start → user verify │
         │  Fullstack: test container → user OK │
         │  Issues? → go to Step 4 or Step 2    │
         └──────────────┬───────────────────────┘
                        ▼
Step 6: ┌──────────────────────────────────────┐
         │  Compatibility Testing               │
         │  `question` gate before starting     │
         │  Full-stack regression in container  │
         │  Issues? → go to Step 2              │
         └──────────────────────────────────────┘
```

## When to Use

Use this skill at the start of EVERY session. It is the entry point for all scenarios — the scenario-specific skills provide detailed adjustments for each case, but the core 6-step structure never changes.

## Context: How Scenario Skills Work

This workflow references scenario-specific skills. When you encounter a reference like `→ load skill: feature-dev-frontend`, use the `skill` tool to load it. The scenario skill will provide specific adjustments to the generic 6-step flow for that case.

Scenarios fall into categories:

| Category | Example Skills | Flow Adjustments |
|----------|---------------|------------------|
| **Development** | feature-dev-frontend, -backend, -fullstack, bugfix, refactoring | Full 6-step, heavy on Step 2 & 4 |
| **Optimization** | optimization-frontend, -backend | Step 5 emphasis (local start + user acceptance) |
| **Review** | code-review, security-audit | Read-only (Step 4 is analysis, not coding) |
| **Infrastructure** | project-init, database-change, migration, dependency-update | Step 5 & 6 vary (may skip container testing) |
| **Integration** | integration | Full 6-step, emphasis on contract verification & error handling |
| **Experimental** | prototype | Step 2 lightweight, Steps 5-6 skippable |
| **Emergency** | hotfix | Abbreviated flow (skip Step 2, Step 3 may be bypassed) |
| **Infrastructure-light** | ci-cd, docs | Steps 1-4 only, simplified acceptance (no container testing) |
| **Decision** | architecture | Steps 1-3 only (discussion + ADR, no coding) |
| **Cross-cutting** | acceptance-frontend, acceptance-fullstack, compatibility-test | Focused on Step 5 & 6 only |

## Process

### Step 1: Requirements Clarification

**Entry condition:** A task request has been received.

**Process:**

1. If requirements are unclear, vague, or underspecified, use the `question` tool to ask targeted questions. Do NOT make assumptions.
2. Ask one question at a time. Wait for the answer before asking the next.
3. After clarification, restate your understanding to confirm alignment.
4. Load the appropriate scenario skill based on the task type.

```
ASSESMENT: what kind of task is this?
- New feature: frontend / backend / fullstack?
- Bug fix?
- Optimization?
- Something else?
```

5. Once the scenario is identified, load the scenario skill: `skill({ name: "<scenario-name>" })`

**Exit condition:** Requirements are confirmed. Scenario skill is loaded.

### Step 2: Spec & Plan

**Entry condition:** Requirements are confirmed and documented.

**Process:**

1. **Write spec document** covering:
   - Objective and success criteria
   - Architecture / approach
   - Files to be changed
   - Dependencies and risks

2. **Write task plan** — break work into verifiable units. Each task must have:
   - Clear acceptance criteria
   - Verification step (test command, build check, manual test)
   - File list

3. **Multi-role review (3+ rounds):** Conduct at least 3 review rounds from different perspectives:
   - **Round 1 — Architecture:** Is the approach sound? Any design issues?
   - **Round 2 — Detailed:** Are there edge cases? Missing details? Implementation-level concerns?
   - **Round 3 — User/Experience:** Does this match what the user asked for? Any UX concerns?

   For each round:
   - Self-review the document against the given perspective
   - Document findings
   - Fix issues found
   - Move to next round

4. **Optimize** the spec/plan based on all review findings.

**Exit condition:** Spec and plan are written, reviewed (3+ rounds), and saved to files.

### Step 3: Permission Gate

**Entry condition:** Spec and plan are finalized.

**Process:**

1. Use the `question` tool to ask the user for explicit permission to start coding.
2. Present a summary of what will be done: "I will implement [X] by modifying [files] using [approach]. May I begin?"
3. **Do NOT write any code until permission is explicitly granted.**
4. If the user says no, return to Step 1 or Step 2 as appropriate.

**Exit condition:** User has explicitly approved starting implementation.

### Step 4: Development & Review

**Entry condition:** User has granted permission to code.

**Process:**

1. **Implement** following the plan. Work incrementally — one task at a time, one file at a time.
2. After implementation, **self-review** the code:
   - Does it match the spec?
   - Are there edge cases?
   - Is it consistent with existing code style?
   - Are there security concerns?
3. **Verify** — run the relevant commands (build, test, lint) to confirm the code works.
4. If issues are found:
   - Collect all issues into a summary
   - Analyze root causes
   - Return to Step 2 (update spec/plan, fix approach)
5. If no issues: proceed to Step 5.

**Exit condition:** Code passes self-review and verification. No unresolved issues.

### Step 5: Acceptance Testing

**Entry condition:** Implementation passes verification. No known issues.

**Process depends on scenario type:**

**For frontend optimization/UI work:**
1. Start local dev server
2. Self-test the feature — confirm it works end-to-end
3. If issues found, return to Step 4
4. Use `question` tool to report to user:
   - What was built
   - How to access it (local URL)
   - What to look for
5. Wait for user acceptance
6. If user reports issues or new requests, return to Step 1

**For full-stack features:**
1. Deploy to test container environment
2. Run verification tests
3. If issues found, collect and return to Step 2
4. Use `question` tool to report to user:
   - What was built
   - Test environment URL
   - What to verify
5. Wait for user acceptance
6. If user reports issues or new requests, return to Step 1

**Exit condition:** User has accepted the implementation via `question` tool.

### Step 6: Compatibility Testing

**Entry condition:** Step 5 acceptance is complete.

**Process:**

1. **Gate:** Use `question` tool to ask user for permission to start compatibility testing.
   - "Compatibility testing will verify that the new changes don't break existing functionality across frontend, backend, and their integration. May I proceed?"
2. Only proceed after explicit permission.
3. Run full-stack regression tests in the test container.
4. Test areas:
   - Frontend: existing pages/components still work
   - Backend: existing APIs/routes still work
   - Integration: frontend-backend connectivity
   - Data: no data loss or corruption
5. If issues found:
   - Collect and summarize
   - Return to Step 2
6. If clean: report results.

**Exit condition:** Compatibility testing passes or issues are routed back to Step 2.

## Sensitive Information Handling

Server credentials, API keys, and database passwords are sensitive. The following rules apply whenever you need server access.

### Preferred: SSH Config Alias

If the user has `~/.ssh/config` configured with a host alias, use it directly. This is the most secure approach — no credentials touch the project files at all.

```
Example ~/.ssh/config:
Host test-server
    HostName 192.168.1.100
    User deploy
    IdentityFile ~/.ssh/test_key
    Port 22

→ Agent uses: ssh test-server "docker-compose up -d"
```

The SSH alias is stored in the project AGENTS.md (e.g., "Test server alias: test-server"). This is NOT sensitive — it's just a label. The actual credentials stay in the user's private `~/.ssh/config`.

### Fallback: Environment Variables

Use these when SSH config is not available. NEVER written into skill files.

| Variable | Purpose | Example |
|----------|---------|---------|
| `OPENCODE_TEST_HOST` | Test server hostname/IP | `192.168.1.100` |
| `OPENCODE_TEST_USER` | SSH user | `deploy` |
| `OPENCODE_TEST_KEY` | Path to SSH private key | `~/.ssh/test_server_ed25519` |
| `OPENCODE_TEST_PORT` | SSH port (default 22) | `2222` |
| `OPENCODE_TEST_DIR` | Deployment directory on server | `/opt/test-app` |

### How to Use

1. **Check for env vars first:**
   ```
   OPENCODE_TEST_HOST is set? → use it
   OPENCODE_TEST_USER is set? → use it
   OPENCODE_TEST_KEY is set? → use it in SSH commands
   ```

2. **If missing, use `question` to ask the user:**
   - Ask ONE variable at a time
   - Do NOT display the value back after receiving it
   - Use it immediately in bash commands, never save to a file
   - If the user provides a password (not key), use SSH_ASKPASS or expect-like patterns

3. **Example SSH command pattern:**
   ```bash
   ssh -i %OPENCODE_TEST_KEY% %OPENCODE_TEST_USER%@%OPENCODE_TEST_HOST% -p %OPENCODE_TEST_PORT% "docker ps"
   ```

4. **Never:**
   - Hardcode IPs, usernames, passwords, or keys in any file
   - Save credentials to project files or AGENTS.md
   - Echo credentials back in the conversation
   - Commit credential-related files

### Server Operations Safety

When deploying to test containers via SSH:
- Ask permission before any SSH connection (Step 3/Step 6 gates cover this)
- Verify the target is the TEST container, not production
- If unsure about the environment, stop and ask via `question`

## Loop-Back Rules

| Situation | Return To | Why |
|-----------|-----------|-----|
| Requirements change mid-session | Step 1 | Must re-clarify |
| Spec review finds issues | Step 2 | Fix the plan first |
| User says no at Step 3 gate | Step 1 or 2 | Depending on what's wrong |
| Code review finds issues | Step 2 | Fix the spec/plan first |
| Acceptance testing fails | Step 4 or Step 2 | Minor: Step 4; Major: Step 2 |
| User requests changes during acceptance | Step 1 | Treat as new requirement |
| Compatibility testing fails | Step 2 | Spec/plan needs revision |

## Common Rationalizations

| Rationalization | Reality |
|----------------|---------|
| "This is simple, I don't need to ask questions" | Simple tasks still need confirmation. One question saves rework. |
| "I'll write tests later" | Later never comes. Verification must happen now. |
| "The user said yes to coding, so I'll just build it all" | Step 4 still requires review and verification. Permission is not a blank check. |
| "I know what they want, I don't need Step 1" | Wrong. Use `question` to confirm. Always. |
| "One round of review is enough" | The spec requires 3+ rounds from different angles. |
| "Compatibility testing is too heavy for this change" | Follow the scenario skill. If it says compatibility testing, do it. |
| "It looks right" | Looks right is not evidence. Run the tests. |

## Red Flags

- Writing code before clarifying requirements
- Skipping the permission gate (Step 3)
- Not using `question` tool when the workflow says to
- Making assumptions about what the user wants
- Proceeding after finding issues without going back to Step 2
- Accepting "seems right" as verification
- Not loading the appropriate scenario skill

## Verification

Before declaring a task complete:

- [ ] All 6 steps were followed in order
- [ ] `question` tool was used at every gate
- [ ] Spec/plan exists and had 3+ review rounds
- [ ] Code was verified by running actual commands
- [ ] User accepted the result
- [ ] Compatibility testing passed or was explicitly handled
