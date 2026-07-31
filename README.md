# Vibe Coding Workflow

基于 opencode 的 AI 辅助全栈开发工作流。包含 6 步流程引擎 + 28 个 Skill，覆盖开发、优化、修复、审查、部署等全场景。

## 部署

### 全局安装（一次配置，所有项目可用）

```bash
# 1. 克隆仓库
git clone <repo-url> ~/opencode-vibe

# 2. 将 skills、commands 和流程文档部署到全局 opencode 配置
xcopy ~/opencode-vibe/.opencode/skills %USERPROFILE%\.config\opencode\skills\ /E /I /Y
xcopy ~/opencode-vibe/.opencode/commands %USERPROFILE%\.config\opencode\commands\ /E /I /Y
xcopy ~/opencode-vibe/.opencode/docs %USERPROFILE%\.config\opencode\docs\ /E /I /Y
copy ~/opencode-vibe/AGENTS.md %USERPROFILE%\.config\opencode\AGENTS.md /Y

# 3. 合并权限配置（重要）：opencode.json 的 permission.skill 放行列表需要合并到全局配置，
#    否则新项目调用 skill 时权限会退回逐次询问。
copy ~/opencode-vibe/opencode.json %USERPROFILE%\.config\opencode\opencode.jsonc /Y
```

> 注意：仓库中的 `opencode.json` 包含 28 个 skill 的 `permission.skill` 放行列表，复制到全局 `opencode.jsonc` 后即为全局预放行；若已有全局配置，请手动合并该放行列表。

或者手动复制对应文件到 `~/.config/opencode/`。

### 项目使用

```bash
opencode /vibe-init  # 首次初始化（技术栈 + 服务器 + Git + 代理）
opencode /vibe       # 每次会话开始（加载工作流）
opencode /pr         # 按 PR 推送
opencode /release    # 发布新版本：版本号 → CHANGELOG → tag → GitHub Release
```

已有 opencode 的项目只需将本仓库的 `AGENTS.md` 和 `.opencode/` 目录放入项目根目录即可生效。

## 命令

```bash
opencode /vibe       # 加载工作流（每次会话第一步）
opencode /vibe-init  # 项目初始化：技术栈 → 服务器 → Git → 代理
opencode /pr         # 按 PR 推送：自动分析 diff → 分支 → commit → PR
opencode /release    # 发布新版本：main 校验 → release 分支 → 版本号/CHANGELOG → 合并 → tag → Release
```

## 使用

每次新会话先执行 `/vibe`，工作流 6 步自动引导：

```
Step 1  需求澄清          使用 question 工具澄清需求
Step 2  规格与计划         文档 + 6 角色评审（5 子代理 + 用户/体验）
Step 3  权限门禁           问你是否可以开始
Step 4  开发与评审         编码 → 多角色评审 → 验证（小修直接改，需调整方案回 Step 2）
Step 5  验收测试           本地启动 / 测试容器 → 你确认
Step 6  兼容性测试         全栈回归，发现问题回 Step 2
```

## 结构

```
├── AGENTS.md                    项目级规则入口
├── opencode.json                配置（全部 skill 预放行）
└── .opencode/
    ├── skills/                  28 个 SKILL.md
    │   ├── vibe-core/           6 步主工作流（每次加载）
    │   ├── git-workflow/        Git 分支/提交/PR 规范
    │   ├── feature-dev-*/       新功能开发
    │   ├── optimization-*/      性能优化
    │   ├── acceptance-*/        验收测试
    │   ├── bugfix/              问题修复
    │   ├── refactoring/         重构
    │   ├── code-review/         代码审查（总指挥模式）
    │   ├── review-*/            前端/后端/DevOps/QA 审查（子代理角色）
    │   ├── hotfix/              紧急修复
    │   ├── ci-cd/               CI/CD 管道
    │   ├── docs/                文档编写
    │   ├── architecture/        架构决策（ADR）
    │   └── ...                  database-change, migration, integration,
    │                              security-audit, dependency-update,
    │                              prototype, project-init, compatibility-test
    ├── commands/                命令（/vibe、/vibe-init、/pr、/release，全局同源）
    ├── docs/                    流程文档（命令骨架的读取目标：*-flow.md，全局同源）
    └── prompts/                 自定义提示词（可选）
```

## 场景

| Skill | 用途 |
|-------|------|
| `vibe-core` | **主工作流**（每次必加载） |
| `feature-dev-*` | 全栈/前后端新功能 |
| `bugfix` | Bug 修复 |
| `refactoring` | 重构 |
| `code-review` | 代码审查（总指挥：派发 5 角色子代理） |
| `review-frontend-arch` | 前端架构审查（子代理） |
| `review-backend-arch` | 后端架构审查（子代理） |
| `review-devops` | DevOps 审查（子代理） |
| `review-qa` | QA 回归风险审查（子代理） |
| `optimization-*` | 性能优化 |
| `hotfix` | 紧急修复 |
| `git-workflow` | Git 操作规范 |
| `ci-cd` | CI/CD 管道配置 |
| `docs` | 文档编写 |
| `architecture` | 架构决策记录（ADR） |
| `database-change` | Schema 变更 |
| `migration` | 技术栈/版本迁移 |
| `integration` | 第三方集成 |
| `security-audit` | 安全审计 |
| `dependency-update` | 依赖更新 |
| `prototype` | 快速原型 |
| `project-init` | 项目初始化 |
| `acceptance-*` | 验收测试 |
| `compatibility-test` | 兼容性回归 |

## 规则

- **不跳过步骤、不假设需求、不省略验证**——"看起来对"不算对，要实测
- 服务器凭据走 SSH config alias 或环境变量，不写入项目文件
- commit 类型：`feat / fix / hotfix / refactor / perf / chore / release`
- commit 信息中文，PR 只创建不合并
