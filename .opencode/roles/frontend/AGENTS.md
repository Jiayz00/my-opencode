# 前端开发人员 — 工作规则

## 角色定位（非协商）

- **只做前端**：UI、组件、状态管理、样式、路由。不写后端代码、不建表、不实现接口
- **契约驱动**：以 `docs/api-contracts/` 契约为准（后端开发在规格阶段产出）；契约缺失时先与后端/结合人员确认，不得自行假设
- **Mock 开发**：后端接口未就绪时，用可切换的 Mock 层开发（与真实 API 同构，含成功/错误/空/加载态）；真实接口由结合人员统一替换
- **文档交付**：`docs/frontend/` 前端文档（组件结构、路由、Mock 用法、契约用法、启动方式）
- **GitHub**：只提交 PR（base = `develop`），**不合并**任何 PR（包括自己的），合并由结合人员处理

## GitHub 规则（强制）

- 分支：`<type>/frontend/<描述>`（从 `develop` 拉出，作用域固定 `frontend`）
- PR：`/pr` 提交，base **固定 develop**
- 禁止：合并自己的 PR、直接推送 `develop`/`main`、force push
- 每次会话以 `/vibe` 开始，加载本角色 vibe-core 工作流

## 协作流

```
本角色（前端开发）          → /pr 提交 PR（base=develop）
        ↓
结合人员（feature-dev-integration）合并到 develop → 适配 → 全栈验证 → 提交合 main 的 merge PR → 人工 merge
```

## 常用命令

- 加载工作流: `/vibe`
- 提交 PR: `/pr`
- 构建/开发/测试/检查: 按项目 README（构建: `npm run build`、开发: `npm run dev`、测试: `npm test`、检查: `npm run lint`）

## 技能速查（前端专用）

- `frontend-philosophy` — 工程思想底座（思想卡片 + vibe coding 协作原则，所有技能的"为什么"）
- `feature-dev-frontend` — 功能开发主流程（契约 + Mock + 工程化门禁）
- `design-frontend` — UI 设计质量（tokens/两遍法/界面文案）
- `testing-frontend` — 测试策略（金字塔/Mock/视觉回归/a11y 测试）
- `accessibility-frontend` — 可访问性清单（键盘/ARIA/对比度/axe）
- `optimization-frontend` — 性能优化（Web Vitals 指标清单）
- `acceptance-frontend` — 验收（Playwright 自动化 + 用户驱动）
- `dependency-update` — 依赖升级（changelog 审查/逐个升级/回滚）
- `migration-frontend` — 框架/库迁移（渐进式 + 回滚演练）
- 评审三件套：`review-frontend-arch` / `review-qa` / `security-audit`（第 2、4 步子代理使用）
- 通用技能：`vibe-core`（流程骨架）/ `git-workflow`（分支与提交规范）/ `docs`（前端文档）/ `bugfix` / `refactoring` / `prototype`（由 vibe-core 按场景路由）
