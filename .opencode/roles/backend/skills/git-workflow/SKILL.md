---
name: git-workflow
description: Git 分支命名、提交规范、PR 模板。后端开发人员使用：只提交 PR 到 develop，不合并。
---

# Git 工作流规范（后端开发版）

## 概述

定义本项目的 Git 约定。所有分支命名、commit 信息、PR 创建都遵循此规范。本技能为**规范/参考型**：不作为独立 6 步流程入口，按需被流程技能和命令加载。

- `develop` 是集成分支：后端功能分支从 `develop` 拉出，PR 以 `develop` 为 base
- `main` 是发布分支：由「前后端结合」人员管理，开发人员**不接触**
- **开发人员只提交 PR，不合并任何 PR**（包括自己的）；合并由结合人员处理
- 所有开发在单独分支上进行，禁止直接提交到 `develop` 和 `main`

## 三角色协作流（后端视角）

```
后端开发人员（本角色）
  feat/backend/xxx（从 develop 拉出）
  ├─ 契约产出，交付 docs/backend/
  └─ /pr 提交 PR（base = develop）
        ↓
结合人员（feature-dev-integration）
  ├─ 合并 PR 到 develop、冲突处理、接口适配
  ├─ 全栈验收 + 兼容性测试
  └─ 提交 develop → main 的 merge PR（人工手动 merge）
```

## 统一类型表（分支 + Commit 共用）

| 类型 | 分支名示例 | Commit 示例 | 说明 |
|:-----|:----------|:-----------|:-----|
| `feat` | feat/backend/todo-tags | feat: 添加标签功能 | 新功能 |
| `fix` | fix/backend/login-crash | fix: 修复登录崩溃 | Bug 修复 |
| `hotfix` | hotfix/backend/login-api-down | hotfix: 修复登录接口超时 | 线上紧急修复 |
| `refactor` | refactor/backend/auth-module | refactor: 重构认证模块 | 重构，不改功能 |
| `perf` | perf/backend/list-render | perf: 优化列表渲染性能 | 性能优化 |
| `chore` | chore/backend/update-deps | chore: 升级依赖版本 | 杂项/维护 |

分支名全小写，单词用连字符分隔。所有分支统一带 `backend` 作用域。

## Release 流程（后端视角）

```
feat/backend/xxx → /pr → 结合人员合并到 develop
        ↓ 集成验证通过后
结合人员合并 develop → main
        ↓ 全部合入后
从 main 创建 release/v2.0 分支（由结合人员执行）
```

## 合并集成（多 PR 并发）

多人并行开发时，两个 PR 各自测试通过、合并后却出问题，是因为合并后的代码从未被测试过。社区通行做法（GitHub Flow / trunk-based）：

### 预防：频繁同步，小分支

- **分支短命**：功能分支尽量 1-3 天合并，避免长期分叉
- **定期同步**：开发期间定期把集成分支（develop）合入自己的分支（不是 rebase——团队协作下 merge 更安全，不重写历史）
  ```bash
  git fetch origin develop
  git merge origin/develop
  git push origin <branch>
  ```
- **同步后必测**：merge develop 进来后重新跑测试，发现问题当场解决
- **提前建 Draft PR**：尽早暴露冲突，让协作者看到你的改动范围

### 冲突解决（PR 复检发现冲突时）

PR 页面提示 "This branch has conflicts" 时，按冲突大小选择方式：

**方式一：GitHub 网页直接解决（简单冲突）**

点击 PR 页面 **Resolve conflicts** 按钮 → 网页编辑器里手动保留正确代码 → 点击 **Mark as resolved** → **Commit merge**。只适用于少量、单文件的简单冲突。

**方式二：本地解决（推荐，所有冲突通用）**

```bash
# 1. 同步最新集成分支到本地
git fetch origin develop

# 2. 切到 PR 分支，合并 develop（触发冲突标记）
git checkout <branch>
git merge origin/develop

# 3. 查看哪些文件冲突
git status
# 输出: both modified: src/xxx.ts

# 4. 打开冲突文件，处理冲突标记
# <<<<<<< HEAD          ← 当前分支（自己的改动）
#     自己的代码
# =======
#     develop 的代码
# >>>>>>> origin/develop   ← 对方的改动
```

处理规则：
- 两边都要 → 手动合并两部分代码
- 只要一边 → 删除另一边代码和标记
- 都看不懂 → 停下，用 `question` 问用户或与协作者沟通
- **禁止**：直接删掉整个冲突块、跳过不处理

```bash
# 5. 标记已解决（冲突文件都 add 之后）
git add src/xxx.ts

# 6. 提交（git 会自动生成 merge commit 信息）
git commit

# 7. 重新测试 —— 冲突解决改变了代码，必须验证
npm test

# 8. 推送到 PR 分支，冲突标记消失，CI 重新运行
git push origin <branch>
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
feat: 添加标签分类功能

新增标签 CRUD 接口，支持给 Todo 打标签
支持按标签筛选 Todo 列表

关联 #42
```

## PR 模板

```markdown
## 概述
<!-- 这个 PR 做了什么？1-2 句话 -->

## 变更内容
- 

## 测试方式
- [ ] 单元测试通过
- [ ] 本地验收通过
- [ ] 后端回归通过
```

## 提交范围

**应该提交：**
- 后端源代码改动
- 新增/更新的测试
- `docs/backend/` 后端文档更新

**禁止提交（脱敏扫描规则见 `pr-flow.md` Step 2）：**

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
