---
description: 发布新版本。从 main 创建 release 分支，更新版本号与 CHANGELOG，打 tag，合并回 main，创建 GitHub Release。
---

执行 /release 流程。**读取强制门禁（最高优先级）**：
1. **先检测并完整读取流程文档（禁止跳过；未完成读取前，禁止执行任何写入操作——git 写/push/tag/merge/GitHub 写/文件创建/配置修改）**：
   - `test -f .opencode/roles/integration/docs/release-flow.md && cat .opencode/roles/integration/docs/release-flow.md`
   - 失败则：`test -f ~/.config/opencode/docs/release-flow.md && cat ~/.config/opencode/docs/release-flow.md`（**校验首行版本标记 `flow-v0.3`，版本不符 → STOP 并提示用 /vibe-role 重新安装角色**）
   - 两条均失败 → **停止并报告，禁止继续**
2. 读取成功后先输出："已读取 <文档名>，共 N 个步骤，本命令关键门禁：<门禁摘要>"，再开始执行。严格按文档执行，不得跳过任何步骤与门禁。文档要求加载 skill 时按需加载（如 git-workflow）。
3. **内嵌最小规则集（不依赖读取，任何写入前先扫）**：`-----BEGIN [A-Z ]*KEY-----`、`AKIA[0-9A-Z]{16}`、`gh[pousr]_[a-zA-Z0-9_]{36,}`、`sk-[a-zA-Z0-9]{20,}`、`[a-z]+://[^:]+:[^@]+@`、`OPENCODE_TEST_`、`xox[baprs]-`、文件名 `.env*`/`*.pem`/`id_rsa`/`id_ed25519`/`*.p12`/`*.key` → 命中 STOP（完整表以 pr-flow.md Step 3 为准）
4. **流程门禁摘要**：版本号机械校验 `^v?[0-9]+\.[0-9]+\.[0-9]+$`（自包含）；打 tag 须 question 确认；**合入 main 只提交 merge PR（base=main，head=release/vX.Y.Z），Do NOT merge、禁止直接 push main**；禁 force push/删远程 tag；提交前与 Release notes 组装前脱敏扫描（表在 pr-flow.md Step 3）；人工 merge 后验证 CI/测试通过方可创建 Release；任何步骤失败停止并报告；失败回滚指引见 release-flow.md 回滚节。
