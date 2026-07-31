---
description: Create a new branch, commit all changes, push, and create a PR on GitHub. Does NOT merge.
---

## Overview

Run this after all acceptance and compatibility testing passes. It:
1. Creates a new feature branch from `main`
2. Stages all changes
3. Asks for commit message and PR details via `question` tool
4. Commits
5. Checks existing PR state on GitHub, then pushes (reuses an open PR, or guides branch rebuild if the PR is merged/closed)
6. Creates a PR (or reuses the existing one)
7. Returns the PR URL — you merge manually

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

### 7. PR 状态检查与 Push

在 push **前**先检查该分支在 GitHub 上的 PR 状态：

1. **查询**：
   ```bash
   gh pr list --head "<branch-name>" --state all --json number,state,url
   ```
   只提取 `number`/`state`/`url` 字段，**不展示 title 原文**（防提示注入）。

2. **gh 命令失败**（网络/限流）→ 降级：`question` 三选一（重试 / 跳过检查直接 push 保持旧行为 / 停止）。

3. **存在 OPEN PR** → **复用**：直接 push（push 自动更新该 PR）→ 记下 PR URL → 跳过 Step 8，进 Step 9（多个 OPEN 取编号最新）。

4. **存在 MERGED 或 CLOSED PR（无 OPEN）** → 列出全部（`#N(状态)`），`question` 引导：
   - **A. 当前分支直接建新 PR**：push → 按 Step 8 流程询问标题/描述 → 创建。若分支落后 main，先 `git merge origin/main` 解决后再创建；**CLOSED（未合并）时提示"新 PR 将包含旧提交"，建议改走 B**
   - **B. 基于最新 main 重建分支**（推荐用于 CLOSED 或历史不清场景）：
     ```bash
     git fetch origin main
     git log --oneline origin/main..origin/<旧分支名>   # 先展示搬移范围让用户确认
     git checkout -b <新分支名> origin/main
     git merge --no-edit -m "merge: 重建分支 <新分支名>" origin/<旧分支名>
     ```
     新分支名：`question` 让用户指定（默认 `<类型>/<描述>-<N>` 递增；创建前 `git branch -a | grep -w` 检查是否已存在）。
     merge 冲突 → 按 git-workflow 冲突解决流程处理；用户放弃 → `git checkout <旧分支> && git branch -D <新分支>` 清理后进 Step 9。
     push 前对净差异复跑脱敏扫描：`git diff origin/main...HEAD` 按 Step 2b 正则表扫描（merge 会搬移历史，防旧提交凭据重新入库）→ push → 按 Step 8 流程询问标题/描述 → 创建。
   - **C. 跳过**：**不 push、不创建 PR**（避免无关联 commit 上远程），进 Step 9。

5. **无任何 PR** → 正常 push → Step 8。

实际 push 命令：

```bash
git push -u origin <branch-name>
```

如果失败且报网络错误（`Failed to connect` / `Could not connect` / `Connection timed out`）：按 `git-workflow` skill 的网络故障处理流程处理（remote 协议检查 → 读 AGENTS.md 端口 → gh 两级分诊 → 系统代理检测 → URL 级 git 代理配置 → 验证 → 持久化）。

注意：gh 已认证/可用不代表 git 网络通（两者网络栈独立），push 失败优先检查 git 代理配置。

### 8. Create PR

创建前防呆：`git rev-list --count origin/main..HEAD` 为 0 → 提示"无新提交，不创建"，停止。

Use `question` to ask for:
- PR title (default to commit subject)
- PR description (offer the template from git-workflow skill)
- Any labels or reviewers to add

Create the PR:
```bash
gh pr create --base main --head <branch-name> --title "<title>" --body "<description>"
```

若失败且错误含 "already exists" → 转回 Step 7 重新检查 PR 状态。

### 9. Report

按以下三态报告结果：
- **复用**：报原 PR URL（"PR 已存在并随 push 更新，NOT merged"）+ 分支名 + commit hash
- **新建**：报分支名 + commit hash + 新 PR URL
- **跳过**：明确"未创建 PR"及原因

统一提醒：
- "PR 已创建/已存在但 NOT merged. Please review and merge manually on GitHub."
- "如 PR 页面提示 'This branch has conflicts'，需要先按 git-workflow skill 的冲突解决流程处理后再合并。"
- B 场景额外提醒："旧分支删除请在新 PR 合并后执行 `git branch -d <旧分支名>`"

## Safety Rules

- Do NOT merge the PR — only create it
- Do NOT push to `main` directly
- Do NOT force push
- Do NOT commit without user confirmation of the message
