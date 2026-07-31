---
description: Create a new branch, commit all changes, push, and create a PR on GitHub. Does NOT merge.
---

## Overview

Run this after all acceptance and compatibility testing passes. It:
1. Creates a new feature branch from `main`
2. Stages all changes
3. Asks for commit message and PR details via `question` tool
4. Commits, pushes, creates a PR
5. Returns the PR URL — you merge manually

## Process

### 1. Pre-flight Checks

Before proceeding, verify:

- [ ] Current directory is a Git repository (`git status`)
- [ ] `gh` is installed and authenticated (`gh auth status`)
- [ ] There are uncommitted changes (`git status --porcelain`)
- [ ] You're not on `main` branch (or if you are, confirm intent)

If any check fails, stop and report the issue.

### 2. Sensitive Data Sanitization (Mandatory)

Scan all changed files for sensitive content. This is a hard gate — if anything is found, the process stops immediately.

#### 2a. File Name Scan

Run `git status --porcelain` to list changed files. Check each file name against the blocklist:

| Blocklist pattern | Reason |
|---|---|
| `.env` / `.env.*` / `*.env` | 环境变量文件 |
| `*.key` / `*.pem` / `*.cert` / `*.crt` / `*.p12` / `*.pfx` | 密钥/证书文件 |
| `id_rsa` / `id_ed25519` / `id_dsa` / `id_ecdsa` | SSH 私钥 |
| `credentials*` / `secrets*` | 凭据文件 |
| `*.log` | 日志文件 |
| `.DS_Store` / `Thumbs.db` | 系统文件 |
| `.vscode/` / `.idea/` / `*.suo` | IDE 配置 |
| `node_modules/` / `dist/` / `build/` / `target/` | 构建产物 |
| `*.local` (如 `.env.local`) | 本地覆盖配置 |
| `service-account*.json` | GCP/Azure 服务账号 |
| `.npmrc` / `.netrc` / `_netrc` | 包管理器/网络凭据 |
| `*.rdp` / `*.kdbx` / `*.ovpn` | 远程桌面/密码库/VPN 配置 |

**如果匹配：** 列出所有匹配的文件路径和对应的违规类别。**STOP** — 通知用户需要先处理这些文件再继续。

#### 2b. Content Scan

For all changed files that are text-based (`.md`, `.json`, `.yaml`, `.yml`, `.toml`, `.ini`, `.cfg`, `.conf`, `.sh`, `.bat`, `.ps1`, `.py`, `.js`, `.ts`, `.env*`, `Dockerfile`, `docker-compose*.yml`), grep for these patterns:

| Pattern | What it catches |
|---|---|
| `-----BEGIN [A-Z ]*KEY-----` | 明文私钥 / PGP 密钥（含 ENCRYPTED PRIVATE KEY 等变体） |
| `password\s*[=:].+` | 硬编码密码（仅限配置文件 `.env*`/`.yml`/`.yaml`/`.json`/`.toml`/`.ini`/`.cfg`/`.conf`） |
| `OPENCODE_TEST_` | 测试服务器凭据残留 |
| `AKIA[0-9A-Z]{16}` | AWS Access Key |
| `gh[pousr]_[a-zA-Z0-9_]{36,}` | GitHub Token（PAT / OAuth） |
| `sk-[a-zA-Z0-9]{20,}` | OpenAI API Key |
| `xox[baprs]-` | Slack Token |
| `https://hooks\.slack\.com/services/` | Slack Webhook URL |
| `[a-z]+://[^:]+:[^@]+@` | URL 嵌入式凭据（`mysql://user:pass@host`） |

**如果匹配：** 列出文件名、匹配行号和内容片段（对 password 行只显示变量名，不显示值）。**STOP** — 通知用户需要先删除或替换敏感内容再继续。

#### 2c. Pass

如果两项扫描都通过，输出 `✓ 敏感信息检查通过`，继续下一步。

### 3. Load Conventions

Load the `git-workflow` skill to reference naming conventions and commit format:
```
skill({ name: "git-workflow" })
```

### 4. Determine Branch Type (Auto-detected)

Analyze the staged diff to automatically determine the change type:

1. Run `git diff --cached --stat` to see what files changed
2. Inspect the actual diff content for clues:

   | If changes include | Likely type |
   |---|---|
   | New files, new components, new API routes, new features | `feat` |
   | Bug-related fixes, edge case handling, error condition fixes | `fix` |
   | Code restructuring, renaming, extracting without new behavior | `refactor` |
   | Package.json, config files, CI, deps, tooling | `chore` |
   | Performance-related changes | `perf` |
   | User explicitly says "release/vX" or "版本发布" | `release` |
   | Emergency production fix | `hotfix` |

3. Use `question` to present the suggestion + ask for description:
   ```
   "Based on the diff, this looks like a [suggested type].
   分支名: [suggested type]/[请描述]
   Branch type (feat/fix/hotfix/refactor/perf/chore/release):
   Description (kebab-case):
   ```
   The user can accept the suggestion or override.

4. Construct branch name: `<type>/<description>`

### 5. Create Branch

```bash
git fetch origin main
git checkout -b <branch-name> origin/main
```

任意 git 网络操作失败（`Failed to connect` / `Could not connect` / `Connection timed out`）→ 按 `git-workflow` skill 的网络故障处理流程处理。

### 6. Stage and Commit

- Stage all changes: `git add -A`
- Show a summary of what's being committed: `git diff --cached --stat`
- Use `question` to get commit message from user
- Validate commit message follows the `git-workflow` convention
- Commit: `git commit -m "<message>"`

### 7. Push

```bash
git push -u origin <branch-name>
```

如果失败且报网络错误（`Failed to connect` / `Could not connect` / `Connection timed out`）：按 `git-workflow` skill 的网络故障处理流程处理（remote 协议检查 → 读 AGENTS.md 端口 → gh 两级分诊 → 系统代理检测 → URL 级 git 代理配置 → 验证 → 持久化）。

注意：gh 已认证/可用不代表 git 网络通（两者网络栈独立），push 失败优先检查 git 代理配置。

### 8. Create PR

Use `question` to ask for:
- PR title (default to commit subject)
- PR description (offer the template from git-workflow skill)
- Any labels or reviewers to add

Create the PR:
```bash
gh pr create --base main --head <branch-name> --title "<title>" --body "<description>"
```

### 9. Report

Use `question` to present the result:
- Branch name
- Commit hash
- PR URL
- Reminder: "PR is created but NOT merged. Please review and merge manually on GitHub."
- Reminder: "如 PR 页面提示 'This branch has conflicts'，需要先按 git-workflow skill 的冲突解决流程处理后再合并。"

## Safety Rules

- Do NOT merge the PR — only create it
- Do NOT push to `main` directly
- Do NOT force push
- Do NOT commit without user confirmation of the message
