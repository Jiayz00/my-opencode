# Changelog

## [v3.0.0] - 2026-08-01

### Changed
- Rebuilt the package as three standard Agent Skills under `.agents/skills/`: `backend`, `frontend`, and `integration`.
- Migrated the former 55 independently discoverable role skills into 52 internal reference documents and 5 workflow references, loaded by the selected role entry as needed.
- Replaced OpenCode-specific commands, global installation, role activation, configuration, and runtime tool calls with tool-independent role workflows and reference routing.
- Renamed test-server environment variable guidance from `OPENCODE_TEST_*` to `TEST_SERVER_*`.
- Added `scripts/validate-skills.mjs` to verify entry layout, references, frontmatter, and legacy runtime residue.
- Corrected the frontend inventory: the former role contained 18 skills, not 17.

### Fixed
- Restored a complete, role-specific `references/workflows/role-flow.md` for backend, frontend, and integration. Each now defines the six-stage flow, approvals, review triggers, loop rules, and delivery checks; PR, integration, and release files remain specialized subflows.
- Routed every role entry through its `role-flow.md` and replaced active legacy skill-name references with package-relative paths.

## [v2.0.0] - 2026-07-31

### 新增

- 三角色工作流体系：`/vibe-role` 角色安装/切换命令 + `role-flow.md`，frontend/backend/integration 三个自包含角色工作流（技能、命令、流程文档、AGENTS、opencode.jsonc）
- 结合角色新增技能：`integration-philosophy`（思想底座 12 卡片）、`api-contract-integration`（消费者驱动契约 CDC）、`feature-dev-integration`（集成主流程）
- 后端角色新增技能：`backend-philosophy`、`api-design-backend`、`migration-backend`、`testing-backend`；前端角色新增 `frontend-philosophy`、`design-frontend`、`accessibility-frontend` 等

### 变更

- 移除全局单一技能集（28 技能），拆分至 `.opencode/roles/<角色>/`：前端 17 技能 / 后端 19 技能 / 结合 18 技能
- 错误结构统一：error 包裹层（code/message/details/requestId）；契约措辞统一：初稿即契约基线，定稿权归结合人员
- 命令新增版本标记门禁（`flow-v1.0-*` 校验）与内嵌最小规则集补齐（`OPENCODE_TEST_`、`xox[baprs]-`）
- AGENTS.md 移除网络节（代理端口）；opencode.json 精简 permission 至最小集
- 三轮多角色审查（前端/后端/DevOps/QA/安全）闭环：修复 git-workflow 前端残留、错误结构不一致、契约措辞矛盾、验收回环缺失等

## [v1.0.0] - 2026-07-31

### 其他

- 命令瘦身改造：`/pr`、`/release`、`/vibe-init` 骨架化（各 12 行，初始注入减 90%），完整流程迁移至 `.opencode/docs/`（读取强制门禁 + 内嵌最小规则集 + 流程门禁摘要）

## [v0.1.0] - 2026-07-31

### 新增

- 初始化 vibe coding 工作流：6 步流程 + 场景技能路由（含 `vibe-core` / `git-workflow` 等 24 个技能）
- 工作流全中文化并新增多角色评审机制（规格评审 6 角色 + 代码评审 5 角色）
- 新增 `/release` 发布命令：8 步流程（预检 → 版本号机械校验 → release 分支 → 白名单版本文件 + CHANGELOG → 脱敏扫描 → tag → 合并验证 → GitHub Release）+ 回滚指引
- `/pr` 命令新增 PR 状态检查：push 前检测分支已有 PR（OPEN 复用 / MERGED/CLOSED 引导重建分支 / gh 失败降级），Step 9 三态报告

### 其他

- 提交方式优化：gh 认证 + git 全局代理配置，新增网络故障处理流程（9 步分诊）
- 记录代理端口（7897）至 AGENTS.md
