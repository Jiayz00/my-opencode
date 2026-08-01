# Changelog

## [v3.0.0] - 2026-08-01

### 变更

- 将包重构为标准 Agent Skills 三入口形式，位于 `.agents/skills/`：`backend`、`frontend`、`integration`
- 原 55 个可独立发现的角色技能迁移为 52 个内部 reference 文档与 5 个工作流 reference，由所选角色入口按需加载
- 移除 OpenCode 专属命令、全局安装、角色激活、配置与运行时工具调用，替换为工具无关的角色工作流与 reference 路由
- 测试服务器环境变量命名由 `OPENCODE_TEST_*` 调整为 `TEST_SERVER_*`
- 新增 `scripts/validate-skills.mjs`，校验入口布局、references、frontmatter 及遗留运行时残留
- 修正前端技能清单：原角色包含 18 个技能，而非 17 个

### 修复

- 为 backend、frontend、integration 恢复完整、角色专属的 `references/workflows/role-flow.md`，各自定义六阶段流程、审批、评审触发、回环规则与交付检查；PR、集成与发布文件保持为专项子流程
- 每个角色入口均路由至其 `role-flow.md`，并将遗留的旧技能名引用替换为包内相对路径

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
