# 三角色 Agent Skills

面向三种软件交付角色（`frontend` / `backend` / `integration`）的标准 Agent Skills 包。

本包仅暴露三个可选择的 Skill。角色选定后，其入口 `SKILL.md` 先读取该角色完整的 `references/workflows/role-flow.md`，再识别任务并只读取该工作所需的详细 references。52 个详细实践均为内部 references，不可独立选择。

## Skills

| Skill | 适用场景 | 主要产出 |
|---|---|---|
| `frontend` | UI、组件、状态、可访问性、浏览器验证、前端文档 | 前端代码、`docs/frontend/`、PR 到 `develop` |
| `backend` | API、数据、业务逻辑、认证、后端测试、后端文档 | 后端代码、`docs/api-contracts/`、`docs/backend/`、PR 到 `develop` |
| `integration` | PR 集成、契约对账、端到端验证、兼容性、发布准备 | 集成后的 `develop`、项目文档、`develop` 到 `main` 的 merge PR |

使用所用代理工具原生的 Skill 选择器或加载机制来选择上述名称之一。Agent Skills 标准不要求特定的斜杠命令写法，因此本仓库不附带工具专属命令。

## 工作流

每个角色的 `role-flow.md` 使用相同的六个控制阶段，并根据其职责范围调整：

1. 澄清需求。
2. 产出并评审规格或计划。
3. 写入前获得明确批准。
4. 实现或评审一个可验证的增量。
5. 呈现验收证据并获取用户反馈。
6. 兼容性或回归测试前单独获得批准。

角色入口提供任务路由表。`role-flow.md` 是角色的完整工作流：阶段门禁、审批点、评审触发条件、回环规则与交付清单。`references/` 下的聚焦文件提供 API 设计、可访问性、数据库迁移、代码评审、发布准备等专项规则。`pr-flow.md`、`integrate-flow.md`、`release-flow.md` 是交付阶段的子流程，不能替代角色主流程。

## 协作规则

- 后端拥有 API 契约基线；集成角色拥有最终契约对账权。
- 前端使用已商定的契约，对不可用服务使用 Mock，不自行发明后端行为。
- 后端与前端不合并 PR。
- 集成角色只有在确认、冲突处理并重新测试后，才能将已批准的工作合并到 `develop`。
- 发布准备创建 `develop` 到 `main` 的 merge PR，`main` 由人工合并。
- 禁止 force-push 或直接 push `develop` 与 `main`。

## 目录结构

```text
.agents/
  skills/
    backend/
      SKILL.md
      references/                 # 18 个后端实践 + 角色与 PR 工作流
    frontend/
      SKILL.md
      references/                 # 17 个前端实践 + 角色与 PR 工作流
    integration/
      SKILL.md
      references/                 # 17 个集成实践 + 角色、集成、PR 与发布工作流
scripts/
  validate-skills.mjs
AGENTS.md
CHANGELOG.md
LICENSE
```

本包包含 3 个入口 Skill、52 个 reference 文档、3 个 role-flow 与 5 个专项流程 reference。

## Reference 覆盖范围

- 后端：API 设计、数据迁移、测试、依赖、性能、三方集成、安全、评审、Git 与 PR 工作流。
- 前端：设计、可访问性、测试、浏览器验收、依赖、迁移、性能、安全、评审、Git 与 PR 工作流。
- 集成：契约对账、PR 集成、全栈验收、兼容性、CI/CD、发布准备、安全、评审、Git 与 PR 工作流。

## 测试环境变量

集成 references 在需要测试服务器时使用以下可移植命名：

```text
TEST_SERVER_HOST
TEST_SERVER_USER
TEST_SERVER_KEY
TEST_SERVER_PORT
TEST_SERVER_DIR
```

值请保存在仓库之外。本包的 Git 工作流将机密、私钥、`.env` 文件与测试服务器凭据视为被拦截内容。

## 校验

修改包内容后运行：

```bash
node scripts/validate-skills.mjs
```

它会校验三入口布局、标准 frontmatter、reference 数量、角色与专项工作流文件，以及是否存在遗留运行时专属路径、命令与命名。

## 参与贡献

1. 保持角色职责边界与工作流门禁不变。
2. 新增或重命名 reference 时，更新对应入口的路由表。
3. 保持 references 工具无关：描述用户确认与可选委派行为，不绑定特定代理 API。
4. 运行校验脚本并检查 `git diff --check`。
5. 未经明确要求不得提交、推送或创建拉取请求。
