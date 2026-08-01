
# Git 工作流规范（前后端结合版）

## 概述

定义本项目的 Git 约定。所有分支命名、commit 信息、PR 创建都遵循此规范。

- `develop` 是集成分支：前端/后端开发人员的功能分支从 `develop` 拉出，PR 以 `develop` 为 base
- `main` 是发布分支：本角色负责准备 merge PR，merge 由人工在托管平台执行
- 本角色是唯一有权把 PR 合并到 `develop` 的人；开发人员不自行合并
- 禁止直接 push `develop` 与 `main`

## 三角色协作流（结合人员视角）

```
前端开发（feat/frontend/*）    后端开发（feat/backend/*）
        │  PR(base=develop)          │  PR(base=develop)
        └────────────┬───────────────┘
                     ▼
        本角色（前后端结合）
        ├─ 审查并合并 PR 到 develop（用户确认 + 冲突处理 + 合并后重测）
        ├─ 接口适配（Mock→真实、字段/错误对齐、CORS）、全栈验证
        ├─ 项目文档（README、docs/、契约定稿）
        └─ PR 流程 提交 develop → main 的 merge PR（base=main）→ 人工手动 merge
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
release/vX.Y.Z → PR 合入 develop
        ↓ develop 上重新验证
提交 develop → main merge PR → 人工 merge
        ↓ 验证 main SHA 与 required checks
从已验证 main SHA 创建 tag → 创建 Release
```

## 合并 PR 到 develop（本角色核心操作）

开发人员的 PR 需要合并时，worktree 只用于只读 diff 审查；执行构建、测试或安装脚本必须在真正的沙箱/容器中进行，且不挂载宿主 socket、用户目录或凭据，默认无生产网络并限制资源。记录 target SHA、PR head SHA 和候选 tree SHA，再通过托管平台合并：

```bash
# 1. 同步最新 develop
git fetch origin develop
git checkout develop && git pull --ff-only origin develop

# 2. 使用平台原生能力获取 PR head；以下 refspec 仅为 GitHub 示例
git fetch origin pull/<N>/head:<分支名>
git checkout -b integration/pr-<N> origin/develop
git merge --no-ff <分支名> -m "merge: PR #<N> <描述>"
```

- 每个 PR 合并前向用户确认
- 候选合并结果必须通过 `git diff --check`、受影响测试、契约检查和安全扫描。Secret scanner 覆盖 `merge-base(origin/develop, PR_HEAD)..PR_HEAD`、候选 tree 和 staged blobs
- 冲突 → 按下方冲突解决流程处理，解决后必须重测并更新原 PR
- 验证通过后优先使用 merge queue；普通 PR merge 前必须确认 target/head SHA 未变化，变化则重新构造候选并验证。GitHub 示例为 `gh pr merge <N> --merge --base develop`
- scanner 不可用或无法确定 target/head SHA 时停止；不得退化为只扫描 `main..develop`

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
- 涉及前端/后端功能逻辑的冲突且无法确认意图 → 停止并询问对应开发人员或退回 PR
- **禁止**：直接删掉整个冲突块、跳过不处理

```bash
# 3. 标记已解决（冲突文件都 add 之后）
git add src/xxx.ts

# 4. 提交（git 会自动生成 merge commit 信息）
git commit

# 5. 重新测试 —— 冲突解决改变了代码，必须验证（前端 + 后端测试）
npm test

# 6. 将冲突解决提交推送到 PR 分支并重新走平台检查；不得推送 develop
```

**检查要点：**
- [ ] 所有 `<<<<<<<` `=======` `>>>>>>>` 标记已清除（`git diff --check`）
- [ ] 两边代码都保留所需部分
- [ ] 测试通过后才推送

### 分支保护

在托管平台上对 `main` 和 `develop` 必须开启等价保护：

- **Require a pull request before merging** — 禁止直接推送 `main` / `develop`
- **Require approvals** — 至少 1 人审阅
- **Dismiss stale approvals** — 新推送后重置审批
- **Require status checks** — CI 全部通过后才能合并
- **Require up-to-date branches** — 合并前必须包含最新分支（GitHub 页面提供 "Update branch" 按钮一键同步）
- **Do not allow bypass** — 管理员也遵守

`main` 分支使用 CODEOWNERS 或等价规则指定发布审阅者。若平台无法提供分支保护、required checks 和审计记录，停止自动合并并要求人工采用等价治理；不得退化为直接 push。

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
- `TEST_SERVER_*` 的真实非占位赋值；变量名、空值和明显占位值允许出现在模板中

**处理方式：**
- 将真实凭据移到 `.env` → 添加到 `.gitignore` → commit 提交 `.env.example`（脱敏版）
- 密钥通过 `~/.ssh/config` 或环境变量管理，不写入项目文件
- 构建产物用 `.gitignore` 排除

## 网络故障处理

git 网络操作失败时先区分认证、DNS、代理、TLS、限流和远程权限问题，并报告原始错误。使用当前运行时可用的诊断能力，不假设 GitHub CLI、特定操作系统、shell 或代理实现。

1. 读取 remote 协议和目标，使用与 HTTPS 或 SSH 对应的诊断方式。
2. 检查当前进程可见的代理环境和仓库级 Git 配置；不得读取或修改用户全局配置作为默认修复。
3. 可用托管平台 API 时分别验证平台认证和 Git 远程连通性；两者不可互相替代。
4. 需要修改仓库级代理或 remote 时，先说明旧值、新值、影响和恢复命令并取得独立许可。
5. 禁止在代理 URL 或 remote URL 中嵌入用户名、密码或 token。
6. 修改后使用等价的只读远程查询验证；失败时恢复本次仓库级改动并停止。

用户全局 Git、系统代理、凭据管理器或 GPG 配置属于项目外环境操作，必须作为独立任务取得明确许可；本参考资料不自动修改。

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
