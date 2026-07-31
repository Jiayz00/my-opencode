---
description: 发布新版本。从 main 创建 release 分支，更新版本号与 CHANGELOG，打 tag，合并回 main，创建 GitHub Release。
---

## Overview

在功能全部合入 main 后执行本命令发布新版本。它：
1. 校验仓库、工作区与远程同步状态
2. 探测项目类型并确认版本号
3. 从 main 创建 `release/vX.Y.Z` 分支
4. 更新版本号、lockfile 与 CHANGELOG（提交前脱敏扫描）
5. 打 annotated tag（需用户确认）
6. 合并回 main 并验证（需用户确认）
7. 创建 GitHub Release
8. 报告结果与回滚指引

流程顺序对齐 git-workflow 的 Release 流程：tag 打在 release 分支上，之后合并到 main。

## Process

### 1. Pre-flight Checks

逐项验证，任一失败则停止并报告：

- [ ] 当前目录是 Git 仓库（`git status`）
- [ ] `gh` 已安装并认证（`gh auth status`）
- [ ] 工作区无未提交改动（`git status --porcelain`，**先于分支检查**）
- [ ] 当前在 `main` 分支（`git branch --show-current`；不在则先切回并确认）
- [ ] main 与远程同步（`git fetch origin && git status -sb`；behind → `git pull --ff-only origin main`，冲突则停止报告）
- [ ] 探测是否有上一个 tag：`git tag --sort=-v:refname | head -1`
  - 有 → 记录为 `<上一个tag>`
  - 无 → 标记"首次发布"，后续步骤跳过 tag 对比
- [ ] CHANGELOG.md 是否存在：
  - 不存在 → **降级为警告**（记录"无 CHANGELOG"，不阻断；步骤 4 会创建）

### 2. 确定版本号

- 查看最近 tag：`git tag --sort=-v:refname | head -5`
- 探测项目版本号位置：

  | 文件 | 位置 |
  |---|---|
  | `package.json` | `"version"` 字段 |
  | `pyproject.toml` | `version = "x.y.z"` |
  | `Cargo.toml` | `version = "x.y.z"` |
  | `CHANGELOG.md` | 顶部版本标题 |
  | 以上皆无 | 直接询问 |

- 用 `question` 确认新版本号（建议值：最新 tag 的递增，如 v1.0.0 → v1.1.0）
- **机械校验**：版本号必须匹配 `grep -E '^v?[0-9]+\.[0-9]+\.[0-9]+$'`；不匹配（或含预发布后缀）立即停止并说明本命令仅支持正式版本
- **预检 tag 未存在**：`git tag -l vX.Y.Z` 与 `git ls-remote --tags origin vX.Y.Z` 均应为空；已存在则停止并 `question` 确认意图：
  - 该 tag 属于本次发布（断点续跑）→ 跳过步骤 5，从步骤 6 继续
  - 确认删除 → 删除本地/远程 tag 后继续；其他 → 停止并报告

### 3. 创建 release 分支

- 检查是否已有 `release/*` 分支（`git branch -a | grep release/`）：有残留 → 用 `question` 确认删除或复用
- 创建：

```bash
git checkout -b release/vX.Y.Z origin/main
```

分支名全小写，如 `release/v1.1.0`（git-workflow 约定）。

### 4. 更新版本号与 CHANGELOG

**版本文件白名单**（只允许以下文件改动）：

| 项目类型 | 需同步的文件 |
|---|---|
| npm | `package.json` + `package-lock.json`（仅 version 字段） |
| Cargo | `Cargo.toml` + `Cargo.lock`（仅 version 字段） |
| pyproject | `pyproject.toml`（仅 version 字段） |
| 无版本文件 | 不更新版本文件，仅维护 CHANGELOG（报告时提示用户手动维护版本号载体） |

- 用 `npm version --no-git-tag-version` 或手动编辑更新版本号；只改 version 字段，禁止夹带其他改动
- 生成改动摘要：

```bash
git log <上一个tag>..HEAD --oneline --no-merges   # 有上一个 tag
git log --oneline --no-merges                     # 首次发布（无 tag）
```

- **扫描摘要**：按 /pr 命令 Step 2b 的内容正则表扫描 git log 输出，命中即 **STOP**（防凭据经 CHANGELOG 泄漏到仓库与公开 Release 页）
- 更新 `CHANGELOG.md`：
  - 新增节 `## [vX.Y.Z] - YYYY-MM-DD`
  - 按类型分组（新增 / 修复 / 重构 / 其他），内容取自 git log 摘要
  - 若存在 `Unreleased` 节，将内容移入新版本节
- `CHANGELOG.md` 不存在则创建（含首个版本节）
- 工作区出现白名单之外的其他改动：**停止**，请用户确认这些改动是否应随发布一起提交
- **提交前脱敏扫描（硬门禁，复用 /pr 命令 Step 2 完整扫描）**：
  - 2a 文件名扫描：按 /pr 的 blocklist 检查改动文件
  - 2b 内容扫描：按 /pr 的内容正则表检查改动内容
  - 任一命中 → **STOP**，处理后再继续
- **显式暂存**（不用 `git add -A`，只列白名单文件）：
  ```bash
  git add package.json package-lock.json CHANGELOG.md   # 以实际白名单为准
  ```
- 提交：`git commit -m "release: 发布 vX.Y.Z"`

### 5. 打 tag（release 分支上）

- **步骤内确认**：用 `question` 展示 tag 名 `vX.Y.Z` 并请求确认，未确认不得继续
- 打 annotated tag：

```bash
git tag -a vX.Y.Z -m "release: vX.Y.Z"
git push origin vX.Y.Z
```

- push 失败且报网络错误（`Failed to connect` / `Could not connect`）：按 `git-workflow` skill 的网络故障处理流程处理（先查 AGENTS.md 有无代理端口 → 没有则问用户 → 成功则写入 AGENTS.md 持久化）
- push 失败（其他原因）：**停止**，报告"tag 已打/未推"状态，不得进入下一步

### 6. 合并回 main

- **步骤内确认**：用 `question` 明确请求合并许可，未确认不得继续
- 执行：

```bash
git checkout main
git merge --no-ff release/vX.Y.Z -m "merge: 发布 vX.Y.Z"
```

- 合并冲突 → 按 `git-workflow` skill 的冲突解决流程（SKILL.md:73-127）处理，禁止跳过；解决后重新测试再继续
- 推送：

```bash
git push origin main
```

- push 被拒：
  - 远程 main 有他人提交 → 停止并报告，不得 force push
  - 分支保护规则拦截 → 请用户临时关闭该规则（含 "Do not allow bypass"）或由管理员放行，push 成功后恢复
- push 网络失败 → 按 git-workflow 网络故障处理流程处理
- **校验远程同步**：`git status -sb` 应显示与 `origin/main` 同步
- **合并后验证**：等待 CI 对 main 的检查通过（本仓库无 CI 则运行测试命令）；失败 → **停止**并报告，不得进入下一步

### 7. 创建 GitHub Release

- 提取 CHANGELOG 中 `## [vX.Y.Z]` 节内容作为 notes；无 CHANGELOG 时用 `--generate-notes` 生成草稿并**人工审阅后发布**
- **组装前再扫描**：按 /pr 命令 Step 2b 的内容正则表对 notes 内容再校验，命中即 STOP
- 写入临时文件（避免引号/反引号/`$` 转义问题），用 `--notes-file`：

```bash
gh release create vX.Y.Z --title "vX.Y.Z" --notes-file <临时文件>
```

- 失败 → 停止并报告，指引手动补建（tag 已推，`gh release create vX.Y.Z` 可重跑）

### 8. 报告

用 `question` 呈现结果：
- 版本号、tag 名、GitHub Release URL
- release 分支名（已合并，可删除：`git branch -d release/vX.Y.Z`）
- 若中途某步失败：报告已完成/未完成的操作清单与恢复指引（断点续跑：从失败步骤重跑，tag 预检保证幂等）
- 无版本文件项目：提示用户手动维护版本号载体
- 提醒：后续发版从新的 main 开始

## 回滚

发布后发现问题时：

- **发布物错误**：`gh release delete vX.Y.Z`（删除 GitHub Release 不影响代码与 tag）
- **代码错误**：`git revert -m 1 <merge-commit>` 生成回滚提交，按 /pr 流程合回 main，发补丁版本
- **tag 处理**：保留 tag（历史不可变）或删除并说明风险；**禁止 force push、禁止强删远程历史**

## Safety Rules

- 合并 main 与打 tag 必须在对应步骤内 `question` 确认（不依赖本节兜底）
- 禁止 force push、禁止删除远程 tag、禁止重写已发布历史
- 版本号必须匹配 `^v?[0-9]+\.[0-9]+\.[0-9]+$`，不接受预发布后缀
- release 分支只允许版本文件白名单 + CHANGELOG 改动；夹带其他改动必须停止
- 提交前必须完成脱敏扫描（文件名 + 内容 + git log 摘要），命中即停
- 任何步骤失败：停止并报告当前完成状态，不得静默跳过
- 不做发布之外的事（不修复功能、不改配置）
