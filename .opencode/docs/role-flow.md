<!-- flow-v1.0 --> 角色安装/切换流程

## Overview

将角色工作流（`frontend` / `backend` / `integration`）从项目 `.opencode/roles/<角色>/` 安装到全局 `~/.config/opencode/`，使本机激活该角色。

- 三人各用一台机器：每台机器运行一次本命令安装自己的角色
- 单机切换角色：重新运行本命令选择另一角色（会替换当前激活的角色）
- 安装是**写入全局配置**的操作，必须在用户明确要求全局同步后才能执行；未获许可前只允许只读检查（列出角色清单、对比内容差异）

## Process

### 1. 校验角色名

角色名必须是 `frontend` / `backend` / `integration` 之一，其他 → **停止**并报告。

```bash
ls .opencode/roles/   # 展示可用角色
```

### 2. 校验源目录

- `.opencode/roles/<角色>/skills/`、`commands/`、`docs/` 存在
- `.opencode/roles/<角色>/AGENTS.md` 存在
- 缺失 → **停止**并报告

### 3. 全局同步门禁（强制）

**在用户明确要求全局同步之前，禁止执行任何全局写入操作。** 执行安装前必须：

- `question` 确认："将安装 `<角色>` 角色到全局 ~/.config/opencode/，替换全局 skills/commands/docs/AGENTS.md 并合并技能权限。确认执行？"
- 用户拒绝 → **停止**，报告未做任何全局修改
- 用户同意 → 继续

### 4. 备份全局配置

```bash
cp ~/.config/opencode/opencode.jsonc ~/.config/opencode/opencode.jsonc.bak
```

### 5. 清除全局旧内容

```bash
rm -rf ~/.config/opencode/skills ~/.config/opencode/commands ~/.config/opencode/docs
rm -f ~/.config/opencode/AGENTS.md
```

**注意：** 不动 `~/.config/opencode/node_modules`、`package.json`、`opencode.jsonc`（本体保留，仅下一步合并权限）。

### 6. 拷贝角色内容

```bash
cp -r .opencode/roles/<角色>/skills ~/.config/opencode/skills
cp -r .opencode/roles/<角色>/commands ~/.config/opencode/commands
cp -r .opencode/roles/<角色>/docs ~/.config/opencode/docs
cp .opencode/roles/<角色>/AGENTS.md ~/.config/opencode/AGENTS.md
```

### 7. 合并技能权限到全局配置

读取角色 `opencode.jsonc` 的 `permission.skill`，合并进全局 `~/.config/opencode/opencode.jsonc`（保留全局既有设置：question 等；同名技能以角色配置为准；不存在的技能条目移除）。

### 8. 验证安装

- [ ] `~/.config/opencode/skills` 与角色源目录一致（`diff -r`）
- [ ] `~/.config/opencode/commands`、`docs` 一致
- [ ] 每个技能目录 frontmatter 的 `name` 与目录名一致
- [ ] 全局 `opencode.jsonc` JSON 语法有效
- [ ] 角色 AGENTS.md 已就位

失败 → 停止并报告；必要时从备份恢复。

### 9. 报告

用 `question` 呈现：

- 当前激活角色
- 可用命令：`/vibe`（加载角色工作流）、`/pr`（提交 PR，base 按角色而定）、`/integrate`（仅结合角色）、`/release`（仅结合角色）
- 提示：其他角色文件保留在项目 `.opencode/roles/` 中，切换角色时重新运行本命令

## Safety Rules

- **未经用户明确要求全局同步，禁止任何全局写入**（本命令是唯一允许的全局写入入口）
- 安装前必须备份全局 opencode.jsonc
- 不动全局 node_modules / package.json
- 禁 force push、禁修改远程历史
- 安装失败时从备份恢复并报告
