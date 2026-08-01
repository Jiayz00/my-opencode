# Frontend Role Flow

本文件是 frontend 角色的主流程。所有前端任务先读取本文件，再按任务加载专项 reference；专项 reference 细化规则，不替代本流程。

## Role Boundaries

- 只负责 UI、组件、状态、样式、路由、前端测试和前端文档；不实现后端 API、数据库或业务服务。
- 以 `docs/api-contracts/` 为契约基线。契约缺失或冲突时不得自行猜测字段或错误行为。
- 后端未就绪时使用与契约同构、可切换的 Mock 层；前端文档写入 `docs/frontend/`。
- 只能创建目标为 `develop` 的 PR；不得合并 PR，也不得直接推送 `develop` 或 `main`。
- 真实前后端联调、全栈验收和集成环境回归属于 integration 角色。

## State Flow

```text
Clarify -> Specify and review -> Write approval -> Implement and review
  -> Browser acceptance -> Compatibility approval and regression -> PR delivery
```

每一步必须满足退出条件才能继续。发现问题按“回环规则”返回对应步骤。

## Step 1: Clarify

一次只确认一个关键问题。确认：

- 目标用户、核心用户流程和非目标。
- 框架、样式方案、状态管理、路由和权限影响。
- API 契约位置、字段、错误结构和 Mock 切换需求。
- 响应式范围、目标浏览器、设计方向和现有 tokens。
- 可访问性、测试、浏览器验收和文档要求。

输出：需求摘要、用户流程、契约来源、已确认约束、未决问题和回归风险。

退出条件：核心流程、契约来源、浏览器范围和验收标准已明确。

## Step 2: Specify and Review

规格至少包含：

- 组件树、模块边界、页面、路由和导航变化。
- props、客户端状态、服务端状态和 API 数据流。
- API 层和 Mock 层设计，以及加载、成功、空、错误、数据获取场景适用的 stale/partial 和边界状态。
- 设计 tokens、响应式方案、交互和可访问性要求。
- 测试分层、浏览器验收场景、回归范围和 `docs/frontend/` 文档清单。

按风险加载专项 reference：

- 视觉或交互设计：`references/design.md` 和 `references/philosophy.md`。
- 新增或变更交互组件：`references/accessibility.md`。
- 测试和回归：`references/testing.md` 与 `references/review-qa.md`。
- 浏览器验收：`references/acceptance.md`。
- 组件、路由、状态或架构：`references/review-frontend-architecture.md`。
- 认证、用户数据、第三方脚本或安全边界：`references/security-audit.md`。

视觉改动须先完成设计计划和复核；新增交互须明确键盘、焦点和 ARIA 方案。汇总评审发现，修订规格后复审受影响的高风险部分。

退出条件：规格已在对话中形成并完成评审，契约无未决冲突，设计、可访问性、测试和安全风险已有可验证方案。文件落盘须等待 Step 3 批准。

## Step 3: Write Approval

在写入前向用户说明：

- 将修改的文件、组件和模块。
- API/Mock、视觉、响应式和可访问性方案。
- 预计影响、验证计划，以及是否需要启动服务和浏览器验收。

未经用户明确批准，不得修改代码、配置或文档，也不得执行会产生写入副作用的命令。

退出条件：已获得明确写入许可。

## Step 4: Implement and Review

按可验证增量实现：

1. 先从最新 `develop` 创建并确认当前任务分支，再将已批准的规格和文档计划落盘，然后构建 UI 结构和静态状态并接入 API 或 Mock。
2. 将请求收敛到 API 层，保持 Mock 与契约字段和错误行为一致。
3. 补全加载、成功、空、错误、数据获取场景适用的 stale/partial 和边界状态。
4. 使用既有 design tokens 和组件模式实现响应式界面。
5. 对交互组件执行 `references/accessibility.md` 清单，包括语义、键盘、焦点、ARIA、对比度和动效。
6. 按风险补充单元、集成、E2E 或视觉测试。
7. 审查 AI 生成的关键代码，必须能解释组件边界、状态分层和抽象取舍。
8. 完成适用的架构、QA 和安全复核，并运行 lint、格式化、类型检查、测试和构建。

不得将 API 数据写死在组件中，不得以跳过类型、可访问性或状态处理换取交付速度，也不得夹带无关重构或后端实现。

退出条件：规格要求已实现，评审无阻塞项，质量检查通过。

## Step 5: Browser Acceptance

面向用户的交互功能必须启动开发服务器并进行浏览器验证；关键用户流程必须使用 Playwright 或等效自动化验证。纯静态改动可按风险说明不启动服务的原因。

验收至少覆盖：

- 页面非空白和核心用户流程。
- 加载、成功、空、错误、数据获取场景适用的 stale/partial 和网络失败状态。
- 响应式断点、控制台和网络请求。
- 键盘完成核心流程、axe 或等效 a11y 扫描、对比度和 reduced motion。
- 关键页面的视觉状态、截图或等效证据。
- `docs/frontend/` 的更新。

先汇总本地 URL、变更、浏览器证据、已知限制和重点流程；单独取得呈现最终验收结论的许可后再向用户报告并等待明确接受。验收通过后才可进入兼容性阶段和 PR 交付。

退出条件：用户已明确接受，浏览器和可访问性证据完整。

## Step 6: Compatibility Approval and Regression

先单独请求兼容性或回归测试许可。获准后，验证受影响的现有页面、共享组件调用方、路由和权限守卫、Mock 切换、关键用户流程、既有测试和控制台错误。

真实后端联调、数据库回归和全栈环境验收移交 integration 角色。

通过后读取 `references/git-workflow.md` 和 `references/workflows/pr-flow.md`，完成脱敏检查并创建目标为 `develop` 的 PR。

退出条件：前端回归通过，PR 已按角色边界交付给 integration 处理。

## Loop Rules

| Event | Return to |
|---|---|
| Requirement, user flow, or scope changes | Step 1 |
| Contract, component design, route, or test-plan changes | Step 2 |
| Local implementation, visual, accessibility, or test failure | Step 4 |
| User acceptance failure | Step 4 for a local fix, Step 2 for a plan issue |
| Compatibility failure | Step 2, or Step 4 when the approved plan remains valid |
| Backend contract discrepancy | Step 2 and hand off the discrepancy to integration |

## Delivery Checklist

- [ ] User flow, contract source, browser scope, and acceptance criteria are confirmed.
- [ ] Specification includes components, states, API/Mock behavior, design, a11y, tests, documentation, and regression scope.
- [ ] User approved all writes.
- [ ] API calls are centralized; Mock is switchable and contract-compatible.
- [ ] UI states, responsive behavior, design tokens, and interaction accessibility are verified.
- [ ] Lint, formatting, types, tests, build, and applicable browser automation pass.
- [ ] Browser, keyboard, console, network, and a11y checks have evidence.
- [ ] `docs/frontend/` is current; user acceptance and separately approved regression passed.
- [ ] Sensitive-data scan passed; the PR targets `develop` and remains unmerged.
