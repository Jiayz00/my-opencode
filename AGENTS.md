# Vibe Coding Workflow — 三角色协作

本项目采用三角色协作开发：**前端开发 / 后端开发 / 前后端结合**。三个角色各自拥有独立的 6 步 vibe 工作流，存放在 `.opencode/roles/<角色>/` 文件夹中，完全自包含（技能、命令、文档、AGENTS、权限配置）。

## 角色工作流激活

- 角色工作流源：`.opencode/roles/frontend|backend|integration/`
- **安装/切换角色：`/vibe-role <frontend|backend|integration>`** —— 将对应角色工作流安装到全局 `~/.config/opencode/`
- **全局同步仅在用户明确要求后执行**；切换角色 = 重新运行 `/vibe-role`
- 安装后每个会话以 `/vibe` 开始，加载当前激活角色的 vibe-core 工作流

## Core Rules (Non-Negotiable)

**Always:**
- Start each session by loading vibe-core skill（当前激活角色版本）
- Use the `question` tool when the workflow says "use question"
- Follow the 6-step process in order (1→2→3→4→5→6)
- Return to earlier steps when issues are found (as specified in the flow)
- Verify everything — "looks right" is never enough

**Ask first before:**
- Writing any code (Step 3 gate)
- Starting compatibility testing (Step 6 gate)
- Reporting acceptance results (Step 5 gate)
- Making schema changes or adding dependencies
- **任何写入全局配置的操作（如 /vibe-role 安装）**

**Never:**
- Skip steps or reorder them
- Start coding without a reviewed spec and explicit permission
- Assume requirements — always use `question` to clarify
- Skip verification because "it's a small change"
- 前端/后端开发人员**不**合并任何 PR；结合人员**禁止直接 push main**（合 main 只提交 merge PR，由人工在 GitHub 合并）

## 工作分工（三角色协作）

| 角色 | 文件夹 | 职责 | 产出 | 分支 | PR 目标 | 合并 |
|------|--------|------|------|------|---------|------|
| 前端开发 | `.opencode/roles/frontend/` | 只做前端：UI、组件、状态管理；契约驱动 + Mock，不实现后端接口 | 前端代码 + `docs/frontend/` 文档 | `feat/frontend/*` | develop（固定） | 不合并 |
| 后端开发 | `.opencode/roles/backend/` | 只做后端：API、数据库、业务逻辑；规格阶段产出 API 契约 | 后端代码 + `docs/api-contracts/` 契约 + `docs/backend/` 文档 | `feat/backend/*` | develop（固定） | 不合并 |
| 前后端结合 | `.opencode/roles/integration/` | 处理 PR、合并到 develop（确认+冲突处理+重测）、接口适配、全栈验收与兼容性测试、项目文档 | 集成代码 + 项目文档（README、docs/） | `feat/integration/*` 或直接 develop | main（合并 PR，人工 merge） | 唯一可合并到 develop；合 main 只提交 PR |

**GitHub 流程（强制）：**
- 前端/后端开发人员只提交 PR（base=develop），**不合并**；结合人员全权处理
- 结合人员：合并 PR→develop（question 确认 + 冲突处理 + 合并后重测）→ 接口适配 → 全栈验证 → **提交 develop→main 的 merge PR（base=main），merge 由人工在 GitHub 手动点击执行**，禁止直接 push main

**文档目录：** 前端 `docs/frontend/`、后端 `docs/backend/`、契约 `docs/api-contracts/`、项目级 `README.md` + `docs/`
