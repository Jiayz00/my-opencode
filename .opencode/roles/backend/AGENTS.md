# 后端开发人员 — 工作规则

## 角色定位（非协商）

- **只做后端**：API、数据库、业务逻辑、校验、认证。不写前端代码
- **契约产出**：规格阶段产出 API 契约初稿到 `docs/api-contracts/`（初稿字段/结构即契约基线，前端按此 Mock；**定稿权归结合人员**）；契约变更须同步更新该文档
- **文档交付**：`docs/backend/` 后端文档（API 端点、请求/响应示例、错误码、数据库 schema、环境配置）
- **GitHub**：只提交 PR（base = `develop`），**不合并**任何 PR（包括自己的），合并由结合人员处理

## GitHub 规则（强制）

- 分支：`<type>/backend/<描述>`（从 `develop` 拉出，作用域固定 `backend`）
- PR：`/pr` 提交，base **固定 develop**
- 禁止：合并自己的 PR、直接推送 `develop`/`main`、force push
- 每次会话以 `/vibe` 开始，加载本角色 vibe-core 工作流

## 协作流

```
本角色（后端开发）          → /pr 提交 PR（base=develop）
        ↓
结合人员（feature-dev-integration）合并到 develop → 适配 → 全栈验证 → 提交合 main 的 merge PR → 人工 merge
```

## 常用命令

- 加载工作流: `/vibe`
- 提交 PR: `/pr`
- 构建/开发/测试/检查: 按项目 README（构建: `npm run build`、开发: `npm run dev`、测试: `npm test`、检查: `npm run lint`）

## 技能速查（后端专用）

- `backend-philosophy` — 工程思想底座（思想卡片 + vibe coding 协作原则，所有技能的"为什么"）
- `feature-dev-backend` — 功能开发主流程（契约 + 错误处理 + 工程化门禁）
- `api-design-backend` — API 设计质量（REST 约定/错误结构/分页/幂等/版本化）
- `testing-backend` — 测试策略（金字塔/AAA/黑盒/契约测试/错误流）
- `database-change` — 数据库变更（迁移安全/回滚/数据一致性）
- `optimization-backend` — 性能优化（量化指标基线/测试容器验证）
- `dependency-update` — 依赖升级（changelog 审查/逐个升级/回滚）
- `migration-backend` — 框架/库迁移（渐进式 + 回滚演练）
- `integration` — 第三方集成（适配器隔离/优雅降级）
- `prototype` — 原型/POC（选型与性能验证）
- 评审四件套：`review-backend-arch` / `review-qa` / `security-audit` / `review-devops`（第 2、4 步子代理使用）
- 通用技能：`vibe-core`（流程骨架）/ `git-workflow`（分支与提交规范）/ `docs`（后端文档）/ `bugfix` / `refactoring`（由 vibe-core 按场景路由）
