# Vibe Coding Workflow

基于 opencode 的 AI 辅助全栈开发工作流。**三角色协作体系**：前端开发 / 后端开发 / 前后端结合，每个角色拥有独立的 6 步 vibe 工作流（技能、命令、流程文档、AGENTS、权限配置），完全自包含于 `.opencode/roles/<角色>/`。

## 部署

### 全局安装（一次配置，所有项目可用）

```bash
# 1. 克隆仓库
git clone <repo-url> ~/opencode-vibe

# 2. 安装角色工作流到全局（frontend / backend / integration 三选一）
cd ~/opencode-vibe
opencode /vibe-role <frontend|backend|integration>
```

`/vibe-role` 会将对应角色的 `skills/`、`commands/`、`docs/`、`AGENTS.md` 安装到全局 `~/.config/opencode/` 并合并技能权限（写入全局前会 `question` 确认并备份配置）。

- 三人各用一台机器：每台机器运行一次安装自己的角色
- 单机切换角色：重新运行 `/vibe-role` 选择另一角色

### 项目使用

```bash
opencode /vibe       # 每次会话开始（加载当前激活角色的 6 步工作流）
opencode /pr         # 按 PR 推送（base 按角色固定 develop 或 main）
opencode /integrate  # 仅结合角色：合并 PR 到 develop
opencode /release    # 仅结合角色：发布版本
```

## 三角色协作

| 角色 | 文件夹 | 职责 | 分支 | PR 目标 | 合并 |
|------|--------|------|------|---------|------|
| 前端开发 | `.opencode/roles/frontend/` | 只做前端：UI、组件、状态管理；契约驱动 + Mock | `feat/frontend/*` | develop（固定） | 不合并 |
| 后端开发 | `.opencode/roles/backend/` | 只做后端：API、数据库、业务逻辑；规格阶段产出 API 契约 | `feat/backend/*` | develop（固定） | 不合并 |
| 前后端结合 | `.opencode/roles/integration/` | 处理 PR、合并 develop、接口适配、全栈验收与兼容性测试、项目文档 | `feat/integration/*` 或 develop | main（merge PR，人工 merge） | 唯一可合并 develop；合 main 只提交 PR |

**GitHub 流程（强制）：**
- 前端/后端开发人员只提交 PR（base=develop），**不合并**
- 结合人员：合并 PR→develop（question 确认 + 冲突处理 + 合并后重测）→ 接口适配 → 全栈验证 → **提交 develop→main 的 merge PR（base=main），merge 由人工在 GitHub 手动点击执行**，禁止直接 push main

**文档目录：** 前端 `docs/frontend/`、后端 `docs/backend/`、契约 `docs/api-contracts/`、项目级 `README.md` + `docs/`

## 命令

| 命令 | 角色 | 用途 |
|------|------|------|
| `/vibe-role <角色>` | 所有 | 安装/切换角色工作流到全局（唯一全局写入入口，需确认） |
| `/vibe` | 所有 | 加载当前角色 6 步工作流（每次会话第一步） |
| `/pr` | 前端/后端 | 提交 PR（base=develop，不合并） |
| `/pr` | 结合 | 提交 develop→main 的 merge PR（base=main，人工 merge） |
| `/integrate` | 结合 | 合并 PR 到 develop（确认 + 冲突处理 + 重测） |
| `/release` | 结合 | 发布版本（release 分支 → 合并 → tag → Release） |

## 使用

每次新会话先执行 `/vibe`，工作流 6 步自动引导：

```
Step 1  需求澄清          使用 question 工具澄清需求
Step 2  规格与计划         文档 + 多角色评审（子代理 + 思想评审）
Step 3  权限门禁           问你是否可以开始（未经许可不写代码）
Step 4  开发与评审         编码 → 评审 → 验证（小修直接改，需调整方案回 Step 2）
Step 5  验收测试           本地测试套件 → 你确认（未过回 Step 4/2）
Step 6  兼容性测试         回归，发现问题回 Step 2
```

## 结构

```
├── AGENTS.md                    项目级规则入口（三角色协作说明）
├── opencode.json                配置（最小权限集）
└── .opencode/
    ├── commands/                /vibe-role 命令
    ├── docs/                    role-flow.md（角色安装/切换流程）
    └── roles/
        ├── frontend/            前端角色（17 技能 + 命令 + pr-flow + AGENTS + opencode.jsonc）
        │   ├── skills/          vibe-core, feature-dev-frontend, frontend-philosophy,
        │   │                    design-frontend, testing-frontend, accessibility-frontend,
        │   │                    optimization-frontend, acceptance-frontend, bugfix,
        │   │                    refactoring, git-workflow, docs, dependency-update,
        │   │                    migration-frontend, prototype, review-frontend-arch,
        │   │                    review-qa, security-audit
        │   ├── commands/        /vibe、/pr
        │   └── docs/            pr-flow.md
        ├── backend/             后端角色（19 技能 + 命令 + pr-flow + AGENTS + opencode.jsonc）
        │   ├── skills/          vibe-core, feature-dev-backend, backend-philosophy,
        │   │                    api-design-backend, testing-backend, database-change,
        │   │                    optimization-backend, dependency-update, migration-backend,
        │   │                    integration, prototype, bugfix, refactoring, git-workflow,
        │   │                    docs, review-backend-arch, review-qa, review-devops,
        │   │                    security-audit
        │   ├── commands/        /vibe、/pr
        │   └── docs/            pr-flow.md
        └── integration/         结合角色（18 技能 + 命令 + 流程文档 + AGENTS + opencode.jsonc）
            ├── skills/          vibe-core, feature-dev-integration, integration-philosophy,
            │                    api-contract-integration, acceptance-fullstack,
            │                    compatibility-test, bugfix, refactoring, git-workflow, docs,
            │                    dependency-update, ci-cd, code-review, review-frontend-arch,
            │                    review-backend-arch, review-devops, review-qa, security-audit
            ├── commands/        /vibe、/pr、/integrate、/release
            └── docs/            pr-flow.md、integrate-flow.md、release-flow.md
```

## 规则

- **不跳过步骤、不假设需求、不省略验证**——"看起来对"不算对，要实测
- 服务器凭据走 SSH config alias 或环境变量，不写入项目文件
- commit 类型：`feat / fix / hotfix / refactor / perf / chore / release`
- commit 信息中文，PR 只创建不合并（结合人员负责合并）
- 全局同步（`/vibe-role`）仅在你明确要求后执行
