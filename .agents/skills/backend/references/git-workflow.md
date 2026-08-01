
# Git 工作流规范（后端开发版）

## 概述

定义本项目的 Git 约定。所有分支命名、commit 信息、PR 创建都遵循此规范。本参考资料为规范型 reference，不作为独立 6 步流程入口，由角色入口或 workflow 按需读取。

- `develop` 是集成分支：后端功能分支从 `develop` 拉出，PR 以 `develop` 为 base
- `main` 是发布分支：由「前后端结合」人员管理，开发人员**不接触**
- **开发人员只提交 PR，不合并任何 PR**（包括自己的）；合并由结合人员处理
- 所有开发在单独分支上进行，禁止直接提交到 `develop` 和 `main`

## 三角色协作流（后端视角）

```
后端开发人员（本角色）
  feat/backend/xxx（从 develop 拉出）
  ├─ 契约产出，交付 docs/backend/
  └─ PR 流程 提交 PR（base = develop）
        ↓
结合人员（integration 角色）
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
feat/backend/xxx → PR 流程 → integration 合并到 develop
        ↓ integration 验收与回归
release 变更经 PR 合入 develop
        ↓ develop → main 人工 merge PR
验证 main SHA → tag → Release
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
- 都看不懂 → 停下，向用户确认 问用户或与协作者沟通
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
