---
description: 在当前项目初始化 vibe 编码工作流。创建 AGENTS.md、opencode.json，并配置服务器访问。
---

## Overview

This command bootstraps the vibe coding workflow into the current project directory. Run this in any empty or new project to set up the workflow.

## Process

1. **Check project state** — is this an empty directory or an existing project?

2. **If empty directory:**
   - Create `AGENTS.md` with project info + server access
   - Create `opencode.json`
   - Use `question` to ask about tech stack
   - Scaffold the project (create-next-app, etc.)
   - Run `/init` to capture project context

3. **If existing project:**
   - Check if `AGENTS.md` already exists; if not, create it
   - Run `/init` to scan the project

4. **Server access setup** — use `question` to ask:
   ```
   是否有 SSH config 别名用于测试服务器？(如 test-server)
   如有，写入 AGENTS.md
   如无，询问服务器信息并用环境变量方式提示用户配置
   测试服务器的部署目录是什么？(如 /opt/test-app)
   直接回车则留空
   ```
   两者均写入 AGENTS.md 的"服务器访问"节。

5. **Git workflow setup** — use `question` to ask:
   ```
   Git 配置偏好：
   - 分支前缀风格？(feature/bugfix/hotfix/refactor/chore)
   - Commit 提交类型偏好？(feat/fix/refactor/perf/docs/chore)
   - PR 是否需要自动添加标签或 Reviewers？
   ```
   写入 AGENTS.md 的 Git 配置节。

6. **Proxy setup** — use `question` to ask:
   ```
   你是否需要走 HTTP 代理才能访问 GitHub？
   如需要，输入代理端口（如 7890），直接回车则不配置。
   ```
   如果用户输入端口，写入 AGENTS.md：

   ```
   代理端口: <端口>
   ```

7. **Verify gh CLI** — check if `gh` is installed and authenticated:
   ```
   gh auth status
   ```
   If not, guide the user to install and authenticate.

8. **Final:** confirm everything is ready — "Vibe coding workflow is now active."

## AGENTS.md 模板（由本命令创建）

```markdown
# [项目名称]

## 技术栈
[框架、语言、数据库等]

## 命令
- 构建: `npm run build`
- 开发: `npm run dev`
- 测试: `npm test`
- 检查: `npm run lint`

## 服务器访问
测试服务器 SSH 别名: [用户输入]
部署目录: [用户输入]

## 网络
代理端口: [用户输入]

## 备注
[初始化时记录的备注]
```

注意：SSH 别名不是敏感信息——它只是 `~/.ssh/config` 里的一个标签，真正的凭据保存在用户私有的 SSH 配置中。

## Output

After running this command, the project will have:
- `AGENTS.md` — project-level rules with server access info
- `opencode.json` — project config
- The vibe coding workflow is fully active

The global skills in `~/.config/opencode/skills/` are already available without any copying.
