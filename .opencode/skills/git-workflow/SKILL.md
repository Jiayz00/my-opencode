---
name: git-workflow
description: Git 分支命名、提交规范、PR 模板。/pr 命令和开发过程中引用。
---

# Git 工作流规范

## 概述

定义本项目的 Git 约定。所有分支命名、commit 信息、PR 创建都遵循此规范。

所有开发在单独分支上进行，禁止直接提交到 `main`。

## 统一类型表（分支 + Commit 共用）

| 类型 | 分支名示例 | Commit 示例 | 说明 |
|:-----|:----------|:-----------|:-----|
| `feat` | feat/todo-tags | feat: 添加标签功能 | 新功能 |
| `fix` | fix/login-crash | fix: 修复登录崩溃 | Bug 修复 |
| `hotfix` | hotfix/payment-500 | hotfix: 修复支付500错误 | 线上紧急修复 |
| `refactor` | refactor/auth-module | refactor: 重构认证模块 | 重构，不改功能 |
| `perf` | perf/list-query | perf: 优化列表查询性能 | 性能优化 |
| `chore` | chore/update-deps | chore: 升级依赖版本 | 杂项/维护 |
| `release` | release/v2.0 | release: 发布 v2.0.0 | 版本迭代/发布 |

## Release 流程

版本迭代时，先并行开发各功能，各自验收通过后，统一发版：

```
feat/xxx       → /pr → 合入 main
fix/xxx        → /pr → 合入 main
refactor/xxx   → /pr → 合入 main
                  ↓ 全部合入后
        从 main 创建 release/v2.0 分支
                  ↓
        更新版本号、CHANGELOG
                  ↓
        git tag v2.0.0
                  ↓
        合并到 main
```

分支名全小写，单词用连字符分隔。

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

```
fix: 修复登录页空邮箱崩溃

空邮箱提交时未做非空判断，增加了前端校验和后端防御

关联 #18
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
- [ ] 兼容性测试通过
```

## 提交范围

**应该提交：**
- 源代码改动
- 新增/更新的测试
- 数据库迁移文件
- 文档更新

**禁止提交（`/pr` 命令会自动拦截以下内容）：**

| 类别 | 示例 | 说明 |
|------|------|------|
| 环境变量 | `.env` / `.env.*` / `*.env` | 用 `.env.example`（脱敏版）代替 |
| 密钥/证书 | `*.key` / `*.pem` / `*.cert` / `*.crt` / `*.p12` / `*.pfx` | SSH、TLS 密钥 |
| SSH 私钥 | `id_rsa` / `id_ed25519` / `id_dsa` / `id_ecdsa` | 通过 `~/.ssh/config` 管理 |
| 凭据文件 | `credentials*` / `secrets*` / `service-account*.json` | 含云服务凭据 |
| 网络凭据 | `.npmrc` / `.netrc` / `_netrc` | 包管理器/网络登录凭据 |
| 远程访问 | `*.rdp` / `*.kdbx` / `*.ovpn` | RDP 配置/密码库/VPN |
| 日志 | `*.log` | 可能含调试信息泄漏 |
| IDE 配置 | `.vscode/` / `.idea/` / `*.suo` | 每个人不同 |
| 构建产物 | `node_modules/` / `dist/` / `build/` / `target/` | 用 `.gitignore` 排除 |
| 系统文件 | `.DS_Store` / `Thumbs.db` | 每个系统都会生成 |

**内容拦截（以下模式出现在任何文件中都会被拦截）：**
- `-----BEGIN ... KEY-----` — 明文私钥 / PGP 密钥
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

### 分支保护

在 GitHub 仓库 Settings → Branches → Add rule 中建议开启：

- **Require a pull request before merging** — 禁止直接推送 `main`
- **Require approvals** — 至少 1 人审阅
- **Dismiss stale approvals** — 新推送后重置审批
- **Require status checks** — CI 全部通过后才能合并
- **Do not allow bypass** — 管理员也遵守
