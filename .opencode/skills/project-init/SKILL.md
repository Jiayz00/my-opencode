---
name: project-init
description: Initialize a new project or set up a development environment. First-time setup including scaffolding, configuration, and tooling.
---

# Project Init

## Overview

Setting up a new project from scratch or cloning an existing one. The focus is on getting a working development environment with all tooling configured.

## Step Adjustments

### Step 1 — Requirements Clarification
Ask for:
- Project type (frontend/backend/fullstack)
- Tech stack preferences (framework, language, database, etc.)
- Any specific project scaffolding tool to use
- Package manager preference
- Testing framework preference
- Git initialization (new repo or clone)

### Step 2 — Spec & Plan
Plan must include:
- Project structure (directories, configuration files)
- Dependencies to install
- Tooling configuration (linter, formatter, type checker, test runner)
- Initial CI/CD setup if needed
- README/documentation plan
- `.gitignore` 覆盖所有禁止提交的模式（密钥、凭据、构建产物、IDE 配置等）

### Step 4 — Development
- Scaffold project structure
- 创建 `.gitignore`（按 git-workflow 的禁止提交列表生成，覆盖密钥、凭据、构建产物、IDE 配置、系统文件等）
- Configure all tooling
- Verify the dev experience (build, test, lint all work)
- Initialize git if applicable

### Step 5 — Acceptance
Use `question` tool:
- "The project is initialized. Build passes, tests pass, lint passes. Dev server starts at [URL]. Does everything look good?"

### Step 6 — Compatibility
- Only relevant if cloning/extending an existing project
- Verify no conflicts with existing tooling

## Verification

- [ ] `npm run build` (or equivalent) passes
- [ ] `npm test` (or equivalent) passes
- [ ] `npm run lint` (or equivalent) passes
- [ ] Dev server starts successfully
- [ ] Tooling config matches project requirements
