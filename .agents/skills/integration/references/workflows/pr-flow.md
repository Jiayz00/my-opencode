<!-- flow-v1.0-integration --> 前后端结合人员专用

## Overview

结合人员提交 **develop → main 的 merge PR** 的流程。在全栈验收（第 5 步）与兼容性测试（第 6 步）通过后执行。它：
1. 校验 develop 与远程同步、确认要合并的内容
2. 创建 merge PR（base **固定为 main**，head = develop）
3. 返回 PR URL —— **merge 由人工在 GitHub 手动点击执行**，本流程不执行 merge

## Process

### 1. Pre-flight Checks

- [ ] 当前目录是 Git 仓库（`git status`）
- [ ] 托管平台 PR 能力可用（运行时原生工具、平台 API 或 CLI；`gh` 只是 GitHub 示例）
- [ ] 本地工作区干净（`git status --porcelain`）
- [ ] 本地 `develop` 与远程同步（`git fetch origin && git status -sb`；behind → `git pull --ff-only origin develop`）
- [ ] 兼容性测试已通过（第 6 步门禁已过）

任一检查失败 → 停止并报告。

### 2. 确认合并内容

向用户展示并确认：

- 本次合并包含的 PR 编号与功能摘要
- 适配内容摘要
- 验证结果摘要（全栈验收 + 兼容性测试）

防呆：`git rev-list --count origin/main..develop` 为 0 → 提示"develop 相对 main 无新提交"，不创建，停止。

### 3. Sensitive Data Sanitization (Mandatory)

对净差异做脱敏扫描，硬门禁，命中即 STOP（完整规则见 git-workflow「提交范围」节）：

- **文件名**：`git diff --name-only origin/main...develop` 对照 blocklist（`.env*`、`*.key`/`*.pem`/`*.cert`/`*.crt`/`*.p12`/`*.pfx`、`id_rsa`/`id_ed25519`、`credentials*`/`secrets*`/`service-account*.json`、`*.log`、`.DS_Store`/`Thumbs.db`、`.vscode/`/`.idea/`/`*.suo`、`node_modules/`/`dist/`/`build/`/`target/`、`*.local`、`.npmrc`/`.netrc`/`_netrc`、`*.rdp`/`*.kdbx`/`*.ovpn`）
- **内容与历史**：使用成熟 secret scanner 覆盖净差异、staged blobs 和 `origin/main..develop` 的完整 commit 范围，并用快速模式补充检查私钥、密码、云密钥、token、webhook 和含凭据 URL。`TEST_SERVER_*` 变量名及空值/明显占位值允许出现在模板中；真实非占位赋值必须阻断。

通过 → 输出 `✓ 敏感信息检查通过`，继续。

### 4. Load Conventions

读取 `references/git-workflow.md`：
```
读取 `references/git-workflow.md`
```

### 5. 检查既有 PR

防重复提交：用托管平台能力查询 head=`develop` 的 open PR；GitHub CLI 示例：`gh pr list --head develop --state open --json number,state,url`

- 存在 OPEN PR → 复用：记下 PR URL → 跳 Step 7
- 查询失败 → 向用户确认重试或停止；不得跳过检查后重复创建 main PR

### 6. Create Merge PR（base 固定 main）

向用户确认标题与描述：

- 标题默认：`merge: develop 合入 main`
- 描述：PR 编号清单 + 适配摘要 + 验证结果（用 git-workflow 的 PR 模板）

```bash
gh pr create --base main --head develop --title "<title>" --body "<description>" # GitHub CLI example
```

若失败且错误含 "already exists" → 转回 Step 5。

### 7. Report

报告：

- **merge PR URL**（base=main、head=develop）
- 提醒：**"merge 操作请在 GitHub 上手动点击执行，本流程不执行 merge。"**
- 提醒：PR 合并后验证 main 上 CI/测试通过；如有问题，回滚按 release-flow 或 git-workflow 处理
- 提醒：已合并进 develop 的功能分支可删除（`git branch -d <分支名>`）

## Safety Rules

- **Do NOT merge the PR** — 合入 main 的 merge 操作由人工在 GitHub 手动执行
- **Do NOT push to `main` directly** — 合入 main 只通过本流程提交的 merge PR
- Do NOT force push
- 脱敏扫描未通过不创建 PR
- 未通过全栈验收与兼容性测试不创建 PR
- Do NOT create PR without user confirmation of title/description
