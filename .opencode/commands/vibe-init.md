---
description: 在当前项目初始化 vibe 编码工作流。创建 AGENTS.md、opencode.json，并配置服务器访问。
---

执行 /vibe-init 流程。**读取强制门禁（最高优先级）**：
1. **先检测并完整读取流程文档（禁止跳过；未完成读取前，禁止执行任何写入操作——git 写/push/tag/merge/GitHub 写/文件创建/配置修改）**：
   - `test -f .opencode/docs/vibe-init-flow.md && cat .opencode/docs/vibe-init-flow.md`
   - 失败则：`test -f ~/.config/opencode/docs/vibe-init-flow.md && cat ~/.config/opencode/docs/vibe-init-flow.md`
   - 两条均失败 → **停止并报告，禁止继续**
2. 读取成功后先输出："已读取 <文档名>，共 N 个步骤，本命令关键门禁：<门禁摘要>"，再开始执行。严格按文档执行，不得跳过任何步骤与门禁。文档要求加载 skill 时按需加载。
3. **内嵌最小规则集（不依赖读取，任何写入前先扫）**：`-----BEGIN [A-Z ]*KEY-----`、`AKIA[0-9A-Z]{16}`、`gh[pousr]_[a-zA-Z0-9_]{36,}`、`sk-[a-zA-Z0-9]{20,}`、`[a-z]+://[^:]+:[^@]+@`、文件名 `.env*`/`*.pem`/`id_rsa`/`id_ed25519`/`*.p12`/`*.key` → 命中 STOP（完整表以 pr-flow.md Step 2a/2b 为准）
4. **流程门禁摘要**：代理配置须 question 确认，禁止 URL 内嵌凭据（`user:pass@`）；git 配置改动（git config --global）前须告知用户并确认。
