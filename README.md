# Vibe Coding Workflow

基于 opencode 的 AI 辅助全栈开发工作流。包含 6 步流程引擎 + 22 个场景 Skill，覆盖开发、优化、修复、审查、部署等全场景。

## 部署

### 全局安装（一次配置，所有项目可用）

```bash
# 1. 克隆仓库
git clone <repo-url> ~/opencode-vibe

# 2. 将 skills 和 commands 部署到全局 opencode 配置
xcopy ~/opencode-vibe/.opencode/skills %USERPROFILE%\.config\opencode\skills\ /E /I /Y
xcopy ~/opencode-vibe/.opencode/commands %USERPROFILE%\.config\opencode\commands\ /E /I /Y
copy ~/opencode-vibe/AGENTS.md %USERPROFILE%\.config\opencode\AGENTS.md /Y
copy ~/opencode-vibe/opencode.json %USERPROFILE%\.config\opencode\opencode.jsonc /Y
```

或者手动复制对应文件到 `~/.config/opencode/`。

### 项目使用

```bash
# 首次初始化（技术栈 + Git + 服务器配置）
opencode /vibe-init

# 开始开发——加载 vibe-core 后按工作流引导
# 或在项目根目录放 opencode.json 引用 AGENTS.md
```

已有 opencode 的项目只需将本仓库的 `AGENTS.md` 和 `.opencode/` 目录放入项目根目录即可生效。

## 命令

```bash
opencode /vibe-init     # 项目初始化：技术栈 → Git → 服务器配置
opencode /pr            # 按 PR 推送：自动分析 diff → 分支 → commit → PR
```

## 使用

每次新会话先加载 `vibe-core` skill，工作流 6 步自动引导：

```
Step 1  需求确认          使用 question 工具澄清需求
Step 2  方案与计划         文档 + 3 轮多角度评审
Step 3  许可门禁           问你是否可以开始
Step 4  开发与自审         编码 → 验证 → 发现问题回 Step 2
Step 5  验收测试           本地启动 / 测试容器 → 你确认
Step 6  兼容性测试         全栈回归，发现问题回 Step 2
```

## 结构

```
├── AGENTS.md                    项目级规则入口
├── opencode.json                配置（全部 skill 预放行）
└── .opencode/
    ├── skills/                  24 个 SKILL.md
    │   ├── vibe-core/           6 步主工作流（每次加载）
    │   ├── git-workflow/        Git 分支/提交/PR 规范
    │   ├── feature-dev-*/       新功能开发
    │   ├── optimization-*/      性能优化
    │   ├── acceptance-*/        验收测试
    │   ├── bugfix/              问题修复
    │   ├── refactoring/         重构
    │   ├── code-review/         代码审查
    │   ├── hotfix/              紧急修复
    │   ├── ci-cd/               CI/CD 管道
    │   ├── docs/                文档编写
    │   ├── architecture/        架构决策（ADR）
    │   └── ...                  database-change, migration, integration,
    │                              security-audit, dependency-update,
    │                              prototype, project-init, compatibility-test
    └── prompts/                 自定义提示词（可选）
```

## 场景

| Skill | 用途 |
|-------|------|
| `vibe-core` | **主工作流**（每次必加载） |
| `feature-dev-*` | 全栈/前后端新功能 |
| `bugfix` | Bug 修复 |
| `refactoring` | 重构 |
| `code-review` | 代码审查 |
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
- git-workflow skill 创建的分支在合并后可删除（`git branch -d`）
