---
name: git-workflow
description: Git 分支命名、提交规范、PR 模板。前后端结合人员使用：合并 PR 到 develop，合入 main 只提交 merge PR（人工手动 merge）。
---

# Git 工作流规范（前后端结合版）

## 概述

定义本项目的 Git 约定。所有分支命名、commit 信息、PR 创建都遵循此规范。

- `develop` 是集成分支：前端/后端开发人员的功能分支从 `develop` 拉出，PR 以 `develop` 为 base
- `main` 是发布分支：**只有本角色（结合人员）能合入，且只通过提交 merge PR 的方式，merge 由人工在 GitHub 手动点击执行**
- 本角色是唯一有权把 PR 合并到 `develop` 的人；开发人员不自行合并
- 禁止直接 push `develop`（除合并 PR 产生的本地 merge 提交）与 `main`

## 三角色协作流（结合人员视角）

```
前端开发（feat/frontend/*）    后端开发（feat/backend/*）
        │  PR(base=develop)          │  PR(base=develop)
        └────────────┬───────────────┘
                     ▼
        本角色（前后端结合）
        ├─ 审查并合并 PR 到 develop（question 确认 + 冲突处理 + 合并后重测）
        ├─ 接口适配（Mock→真实、字段/错误对齐、CORS）、全栈验证
        ├─ 项目文档（README、docs/、契约定稿）
        └─ /pr 提交 develop → main 的 merge PR（base=main）→ 人工手动 merge
```

## 统一类型表（分支 + Commit 共用）

| 类型 | 分支名示例 | Commit 示例 | 说明 |
|:-----|:----------|:-----------|:-----|
| `feat` | feat/integration/api-adapt | feat: 接口适配对接 | 集成/适配改动 |
| `fix` | fix/integration/contract-mismatch | fix: 修复契约字段不一致 | Bug 修复 |
| `hotfix` | hotfix/integration/urgent-patch | hotfix: 紧急修复 | 紧急修复（跨层） |
| `perf` | perf/integration/api-layer | perf: 优化适配层性能 | 性能优化 |
| `refactor` | refactor/integration/api-layer | refactor: 重构 API 适配层 | 重构，不改功能 |
| `chore` | chore/integration/update-docs | chore: 更新项目文档 | 文档/杂项 |
| `release` | release/v2.0 | release: 发布 v2.0.0 | 版本迭代/发布 |

分支名全小写，单词用连字符分隔。适配/集成改动统一带 `integration` 作用域。

## Release 流程（本角色执行）

```
feat/frontend/xxx → 合并到 develop
feat/backend/xxx  → 合并到 develop
        ↓ 全栈验证通过后
提交 develop → main 的 merge PR → 人工手动 merge
        ↓ 全部合入后
从 main 创建 release/v2.0 分支
        ↓
更新版本号、CHANGELOG
        ↓
git tag v2.0.0
        ↓
合并到 main
```

## 合并 PR 到 develop（本角色核心操作）

开发人员的 PR 需要合并时：

```bash
# 1. 同步最新 develop
git fetch origin develop
git checkout develop && git pull --ff-only origin develop

# 2. 拉取 PR 分支并合并（或用 gh pr merge）
git fetch origin pull/<N>/head:<分支名>
git merge --no-ff <分支名> -m "merge: PR #<N> <描述>"
```

- 每个 PR 合并前用 `question` 确认
- 冲突 → 按下方冲突解决流程处理，解决后**必须重测**
- 合并后：`git push origin develop`
- 可选：`gh pr merge <N> --merge --base develop`（需审批时先走审批流程）
- **合并前脱敏扫描**：按 `pr-flow.md` Step 3 对净差异扫描（`git diff origin/develop...HEAD`），命中即 STOP

### 冲突解决（PR 合并冲突时）

合并 develop 与功能分支产生冲突时：

```bash
# 1. 在合并冲突状态下查看冲突文件
git status
# 输出: both modified: src/xxx.ts

# 2. 打开冲突文件，处理冲突标记
# <<<<<<< HEAD          ← 当前 develop 上的代码
#     develop 的代码
# =======
#     PR 分支的代码
# >>>>>>> <分支名>      ← PR 分支的改动
```

处理规则：
- 两边都要 → 手动合并两部分代码
- 只要一边 → 删除另一边代码和标记
- 涉及前端/后端功能逻辑的冲突，看不懂 → 停下，`question` 询问对应开发人员或退回 PR
- **禁止**：直接删掉整个冲突块、跳过不处理

```bash
# 3. 标记已解决（冲突文件都 add 之后）
git add src/xxx.ts

# 4. 提交（git 会自动生成 merge commit 信息）
git commit

# 5. 重新测试 —— 冲突解决改变了代码，必须验证（前端 + 后端测试）
npm test

# 6. 推送到 develop
git push origin develop
```

**检查要点：**
- [ ] 所有 `<<<<<<<` `=======` `>>>>>>>` 标记已清除（`git diff --check`）
- [ ] 两边代码都保留所需部分
- [ ] 测试通过后才推送

### 分支保护

在 GitHub 仓库 Settings → Branches → Add rule 中对 `main` 和 `develop` 分别建议开启：

- **Require a pull request before merging** — 禁止直接推送 `main` / `develop`
- **Require approvals** — 至少 1 人审阅
- **Dismiss stale approvals** — 新推送后重置审批
- **Require status checks** — CI 全部通过后才能合并
- **Require up-to-date branches** — 合并前必须包含最新分支（GitHub 页面提供 "Update branch" 按钮一键同步）
- **Do not allow bypass** — 管理员也遵守

`main` 分支建议用 CODEOWNERS 指定结合人员为 owner，或由团队约定只合并结合人员提交的 merge PR。

**develop 保护与本地合并路径的协调**：本技能主合并路径是本地 `git merge --no-ff` 后 `git push origin develop`，该路径仅在 develop **未启用** "Require a pull request before merging" 时可用；若 develop 已启用该保护，改用 `gh pr merge <N> --merge --base develop` 主路径（由 GitHub 执行合并），本地合并仅作备选。禁止请求临时关闭分支保护来推送。

## Commit 格式

```
<type>: <描述>

# 正文（可选，复杂改动时写）
<详细说明>

# 脚注（可选）
<关联信息>
```

**规则：**
- Commit 信息用中文写
- 描述简洁，一句话说清楚做了什么
- type 后跟冒号加空格
- 正文在空一行后写，说明改动原因和思路
- 关联 Issue 在脚注写 `关联 #123`

**示例：**
```
feat: 前端 API 层对接真实后端接口

替换 Mock 数据层，对齐字段命名与错误码
配置开发代理与 CORS

关联 #42
```

## PR 模板

```markdown
## 概述
<!-- 这个 PR 做了什么？1-2 句话 -->

## 变更内容
- 

## 测试方式
- [ ] 全栈验收通过（测试容器）
- [ ] 兼容性测试通过
- [ ] 人工 merge 后 main 上 CI 通过
```

## 提交范围

**应该提交：**
- 接口适配与集成代码
- 项目文档（README、docs/、契约定稿）
- 部署/CI 配置

**禁止提交（脱敏扫描规则见 `pr-flow.md` Step 3）：**

| 类别 | 示例 | 说明 |
|------|------|------|
| 环境变量 | `.env` / `.env.*` / `*.env` | 用 `.env.example`（脱敏版）代替 |
| 密钥/证书 | `*.key` / `*.pem` / `*.cert` / `*.crt` / `*.p12` / `*.pfx` | SSH、TLS 密钥 |
| SSH 私钥 | `id_rsa` / `id_ed25519` / `id_dsa` / `id_ecdsa` | 通过 `~/.ssh/config` 管理 |
| 凭据文件 | `credentials*` / `secrets*` / `service-account*.json` | 含云服务凭据 |
| 网络凭据 | `.npmrc` / `.netrc` / `_netrc` | 包管理器/网络登录凭据 |
| 远程访问 | `*.rdp` / `*.kdbx` / `*.ovpn` | RDP 配置/密码库/VPN |
| 本地覆盖配置 | `*.local`（如 `.env.local`） | 本地覆盖配置不应入库 |
| 日志 | `*.log` | 可能含调试信息泄漏 |
| IDE 配置 | `.vscode/` / `.idea/` / `*.suo` | 每个人不同 |
| 构建产物 | `node_modules/` / `dist/` / `build/` / `target/` | 用 `.gitignore` 排除 |
| 系统文件 | `.DS_Store` / `Thumbs.db` | 每个系统都会生成 |

**内容拦截（以下模式出现在文本文件内容中都会被拦截；password 命中仅限配置文件 `.env*`/`.yml`/`.yaml`/`.json`/`.toml`/`.ini`/`.cfg`/`.conf`）：**
- `-----BEGIN ... KEY-----` — 明文私钥 / PGP 密钥（含 ENCRYPTED PRIVATE KEY 等变体）
- `password\s*[=:].+` — 硬编码密码（仅限配置文件）
- `AKIA[0-9A-Z]{16}` — AWS Access Key
- `gh[pousr]_[a-zA-Z0-9_]{36,}` — GitHub Token
- `sk-[a-zA-Z0-9]{20,}` — OpenAI API Key
- `xox[baprs]-` — Slack Token
- `https://hooks.slack.com/services/` — Slack Webhook
- `[a-z]+://[^:]+:[^@]+@` — URL 嵌入式凭据（数据库连接串等）
- `OPENCODE_TEST_` — 测试服务器凭据残留

**处理方式：**
- 将真实凭据移到 `.env` → 添加到 `.gitignore` → commit 提交 `.env.example`（脱敏版）
- 密钥通过 `~/.ssh/config` 或环境变量管理，不写入项目文件
- 构建产物用 `.gitignore` 排除

## 网络故障处理

git 网络操作（push / fetch / pull / ls-remote）失败时，判定错误为网络问题（`Failed to connect` / `Could not connect` / `Connection timed out`）后，按以下顺序处理。前提：HTTPS remote（`https://github.com/...`）；SSH remote 走 `~/.ssh/config` 的 ProxyCommand，本流程不适用。

1. **remote 协议检查**：`git remote get-url origin` 为 `ssh://` 或 `git@` 风格 → 提示改用 HTTPS remote（`git remote set-url origin https://github.com/<user>/<repo>.git`）或走 SSH 代理配置，不进入 http.proxy 流程（http.proxy 对 SSH 无效）
2. **gh 两级分诊**（gh 与 git 网络栈独立，gh 通不代表 git 通；gh 认证与网络通路是两件事）：
   - `gh auth status`：未认证/凭据失效 → 引导 `gh auth login`，**这是认证问题，不是网络问题**
   - `gh api rate_limit --jq .rate.remaining`：失败 → 整个网络不通 → 转第 4 步问用户；通 → 问题在 git 层 → 继续检测
   - gh 未安装（command not found）→ 提示安装或跳过
3. **检测系统代理**（优先级：环境变量 > WinINET 注册表 > WinHTTP）：
   - 环境变量：`env | grep -iE 'https?_proxy|all_proxy'`（含小写）
   - Windows 注册表（WinINET，浏览器/gh 同源）：`reg query "HKCU\Software\Microsoft\Windows\CurrentVersion\Internet Settings" /v ProxyEnable` 为 1 时取 `/v ProxyServer`；值可能为 `host:port` 或 `http=host:port;https=host:port` 分段格式（取 http 段）；ProxyEnable=0 或 ProxyServer 空 → 无系统代理；PAC 模式 → 停止并报告无法自动处理
   - WinHTTP 兜底：`netsh winhttp show proxy`
   - macOS：`scutil --proxies`；Linux：环境变量
5. **询问**：无代理信息 → `question` 询问端口（提示"回车跳过"）；检测到系统代理 → 用 `question` 展示完整代理地址请用户确认（默认拒绝自动改道，防误路由）
6. **配置**（URL 级，仅影响 github.com 远程，不覆盖既有 http.proxy）：
   - 写前留存旧值：`git config --global --get http.proxy`；旧值已存在 → 先验证旧值连通性，通则保留不覆盖
   - `question` 确认后写入：
     ```bash
     git config --global http.https://github.com/.proxy http://<完整host:port>
     ```
   - 禁止在代理 URL 内嵌 `user:pass@` 凭据；需认证代理 → `git config --global http.proxyAuthMethod negotiate`（Windows 集成认证，不落盘密码）
7. **验证**（分场景，与仓库解耦）：
   - 无 origin remote 或非 git 仓库 → `curl.exe -x http://<host>:<port> -m 10 -sI https://github.com` 返回 200 即通过
   - 有 origin remote → `git ls-remote origin HEAD`（Git Bash 下执行，`timeout 15` 包裹）
    - 失败 → `question` 询问备选端口或跳过 → 重配置重验 → 仍失败才报告
    - 失败回退：`git config --global --unset http.https://github.com/.proxy`（如本次写入过 authMethod 一并 `--unset http.proxyAuthMethod`）
7. **逃生口**：仓库级 `git config --local http.proxy <url>` 可覆盖全局配置；不需要代理时 `git config --global --unset http.https://github.com/.proxy` 移除

提交方式约定："用 gh 提交" = gh 认证 + git 跟随系统代理（URL 级配置），push 由 git 无参执行；gh 无 push 命令（gh 仅承担认证与 API 操作：PR/Release）。

## 安全加固

### GPG 签名

建议所有 commit 启用 GPG 签名，确保提交者身份可验证：

```bash
# 配置 GPG 密钥
git config --global user.signingkey <KEY-ID>
git config --global commit.gpgsign true
```

在 GitHub 上添加 GPG 公钥后，commit 会显示 `Verified` 标记。首次设置：

1. 生成 GPG 密钥：`gpg --full-generate-key`
2. 列出公钥：`gpg --list-secret-keys --keyid-format=long`
3. 导出并添加到 GitHub：`gpg --armor --export <KEY-ID>`
