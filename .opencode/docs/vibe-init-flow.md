<!-- flow-v0.2 --> 以项目内版本为准（~/.config/opencode/docs/ 为全局副本）

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

6. **Proxy setup** — 检测并配置 git 网络通路（提交方式 = gh 认证 + git 跟随系统代理，见 git-workflow 网络故障处理节）：
   ```
   ① 检测系统代理（优先级：环境变量 > WinINET 注册表 > WinHTTP）：
      - 环境变量：env | grep -iE 'https?_proxy|all_proxy'（含小写）
      - Windows 注册表（WinINET，浏览器/gh 同源）：
        reg query "HKCU\Software\Microsoft\Windows\CurrentVersion\Internet Settings" /v ProxyEnable
        （为 1 时再查 /v ProxyServer；值可能为 host:port 或 http=host:port;https=host:port 分段，取 http 段；
          ProxyEnable=0 或 ProxyServer 空 → 无系统代理；PAC 模式 → 报告无法自动处理，不询问）
      - WinHTTP 兜底：netsh winhttp show proxy
      - macOS：scutil --proxies（可选）；Linux：环境变量
   ② 检测到系统代理 → 用 question 展示完整代理地址请用户确认（默认拒绝自动改道，防误路由）
   ③ 无系统代理 → question 询问端口；直接回车则不配置（跳过 → 不配置不验证，仅说明 gh 通路）
   ④ 用户确认后 URL 级配置（仅影响 github.com 远程，不覆盖既有 http.proxy）：
      git config --global http.https://github.com/.proxy http://<完整host:port>
      禁止在代理 URL 内嵌 user:pass@ 凭据；需认证代理 → git config --global http.proxyAuthMethod negotiate
   ⑤ 分场景验证（与仓库解耦）：
      - 无 origin remote 或非 git 仓库 → curl.exe -x http://<host>:<port> -m 10 -sI https://github.com 返回 200 即通过
      - 有 origin remote → git ls-remote origin HEAD（Git Bash 下执行，timeout 15 包裹）
      - 失败 → question 询问备选端口或跳过 → 重配置重验 → 仍失败才报告
      - 失败回退：git config --global --unset http.https://github.com/.proxy（如写入过 authMethod 一并 unset）
   ⑥ 写入 AGENTS.md"网络"节（默认项目 AGENTS.md，无则全局），注明"本机专用，换机器/系统代理变更需重新检测"
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
