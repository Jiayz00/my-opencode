# Backend Role Flow

本文件是 backend 角色的主流程。所有后端任务先读取本文件，再按任务加载专项 reference；专项 reference 细化规则，不替代本流程。

## Role Boundaries

- 只负责 API、数据库、业务逻辑、校验、认证、授权和后端文档；不实现前端 UI。
- API 变化须在规格阶段形成契约初稿，Step 3 批准后写入 `docs/api-contracts/`。integration 角色拥有契约定稿权。
- 后端文档写入 `docs/backend/`。
- 只能创建目标为 `develop` 的 PR；不得合并 PR，也不得直接推送 `develop` 或 `main`。
- 前端联调和全栈回归属于 integration 角色。发现会影响前端的契约问题时，记录差异并移交 integration。

## State Flow

```text
Clarify -> Specify and review -> Write approval -> Implement and review
  -> Backend acceptance -> Compatibility approval and regression -> PR delivery
```

每一步必须满足退出条件才能继续。发现问题按“回环规则”返回对应步骤。

## Step 1: Clarify

一次只确认一个关键问题，不对缺失需求自行假设。确认：

- API 风格、调用场景和受影响调用方。
- 数据模型、迁移、认证、授权和敏感数据要求。
- 性能、并发、幂等、兼容性和回滚要求。
- 现有项目模式、验收标准和文档范围。

输出：需求摘要、受影响模块、已确认约束、未决问题和初步风险。

退出条件：关键行为、调用方、数据影响和验收标准已明确。

## Step 2: Specify and Review

规格至少包含：

- API 端点、方法、路径、参数、请求、响应和错误结构。
- 数据模型、schema、迁移和回滚策略。
- 业务逻辑、校验、认证、授权、幂等和兼容性规则。
- `docs/api-contracts/` 中的 API 契约初稿。
- 测试、后端文档、验收和回归计划。

按风险加载专项 reference：

- API 或契约：`references/api-design.md`。
- 数据库或迁移：`references/database-change.md`。
- 测试：`references/testing.md`。
- 认证、授权、外部输入或敏感数据：`references/security-audit.md`。
- API、数据模型或公共模块：`references/review-backend-architecture.md`。
- 行为变化或回归风险：`references/review-qa.md`。
- 部署、环境、迁移或 CI：`references/review-devops.md`。
- 工程取舍：`references/philosophy.md`。

汇总评审发现，去重并处理冲突；修订规格后，对受影响的高风险部分复审。运行时支持子代理时可并行评审，否则顺序完成等价检查。

退出条件：规格与契约初稿已在对话中形成并完成评审，评审阻塞项已关闭，且关键风险有测试和回滚方案。文件落盘须等待 Step 3 批准。

## Step 3: Write Approval

在任何写操作前，向用户说明：

- 将修改的文件及其作用。
- 实现方案、API 和数据影响。
- 计划执行的验证和回滚方式。

未经用户明确批准，不得修改代码、配置、schema、迁移、数据或文档，也不得执行会产生写入副作用的命令。

退出条件：已获得明确写入许可。

## Step 4: Implement and Review

以小而可验证的增量实现：

1. 先从最新 `develop` 创建并确认当前任务分支，再将已批准的规格和 API 契约初稿落盘，然后实现业务逻辑和数据层。
2. 添加输入校验、统一错误处理、认证和授权。
3. 数据库改动遵循 `references/database-change.md`，包含可验证的回滚路径。
4. 同步补充测试；根据风险运行 API、契约、错误流、幂等和数据完整性测试。
5. 审查 AI 生成的关键代码，必须能解释其边界、错误行为和取舍。
6. 按第二步的风险路由完成架构、QA、安全或 DevOps 复核。
7. 运行适用的测试、lint、格式化、类型检查、构建和契约校验。

不得通过弱化类型、跳过校验或夹带无关重构绕过质量门禁。

退出条件：实现满足规格，评审无阻塞项，验证通过，契约与实现一致。

## Step 5: Backend Acceptance

执行并记录：

- 完整后端测试套件。
- API 成功和失败响应、状态码、错误结构与输入校验。
- 认证、授权、数据完整性和迁移结果。
- `docs/api-contracts/` 与 `docs/backend/` 的同步情况。

先汇总实现内容、API 和数据变更、验证证据及已知限制；单独取得呈现最终验收结论的许可后再向用户报告并等待明确验收。验收通过后才可进入兼容性阶段和 PR 交付。

退出条件：用户已明确接受，文档和验证证据完整。

## Step 6: Compatibility Approval and Regression

先单独请求兼容性或回归测试许可。获准后，按第二步影响范围验证现有 API、路由、错误行为、认证授权、数据读写和向后兼容性。

后端只负责 API、数据和后端调用方回归；真实前后端联调和全栈验收移交 integration 角色。

通过后读取 `references/git-workflow.md` 和 `references/workflows/pr-flow.md`，完成脱敏检查并创建目标为 `develop` 的 PR。

退出条件：回归通过，PR 已按角色边界交付给 integration 处理。

## Loop Rules

| Event | Return to |
|---|---|
| Requirement or scope changes | Step 1 |
| Specification, contract, schema, or design changes | Step 2 |
| Local implementation or test failure | Step 4 |
| User acceptance failure | Step 4 for a local fix, Step 2 for a plan issue |
| Compatibility failure | Step 2, or Step 4 when the approved plan remains valid |
| Frontend contract impact | Step 2 and hand off the discrepancy to integration |

## Delivery Checklist

- [ ] Requirements and acceptance criteria are confirmed.
- [ ] Specification includes contract, data, errors, validation, tests, documentation, rollback, and compatibility scope.
- [ ] Applicable architecture, QA, security, and DevOps reviews are complete.
- [ ] User approved all writes.
- [ ] Tests, lint, types, build, and contract checks pass as applicable.
- [ ] Error structure, authentication, authorization, idempotency, and data integrity are verified as applicable.
- [ ] `docs/api-contracts/` and `docs/backend/` are current.
- [ ] User acceptance and separately approved backend regression passed.
- [ ] Sensitive-data scan passed; the PR targets `develop` and remains unmerged.
