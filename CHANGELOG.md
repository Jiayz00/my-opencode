# Changelog

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
