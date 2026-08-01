
# 前端验收

## 概述

这是在第 4 步（开发）通过后触发的专项验收工作流。它处理核心工作流第 5 步中前端特定的验收路径。

## 使用时机

当核心工作流的第 5 步需要前端验收测试时使用。通常是在前端功能、优化或缺陷修复之后。

## 流程

### 1. 预检查
- 构建无错误通过
- 开发服务器正常启动
- 所有自动化测试通过

### 2. 本地启动
- 启动本地开发服务器（`npm run dev` 或等效命令）
- 在浏览器中验证功能可用
- 检查：正确渲染、交互、数据展示、错误状态

### 2.5 自动化验证（Playwright 或等效工具）

手动目测之前，先用自动化脚本快速过一遍（模式来源：reconnaissance-then-action）：

1. **侦察**：启动服务器 → 导航到目标页面 → 等待具体可见元素、URL、响应或业务就绪标志 → 截屏 + 抓取渲染后 DOM。仅在页面没有 WebSocket、SSE、轮询等常驻连接时使用 `networkidle`
2. **确认选择器**：从渲染状态确定选择器（`getByRole`/`getByLabel` 优先），再执行交互动作
3. **断言清单**：
   - 页面正常渲染（无空白屏、无骨架屏卡死）
   - 控制台无错误（`console.error` / 未捕获异常 / 未处理 promise rejection）
   - 网络请求无失败（4xx/5xx 响应）
   - 加载/成功/空/错误及场景适用的 stale/partial 状态切换正确
4. **证据**：截图保存为验收证据；关键流程跑通后向用户汇报

参考实现（Node）：

```js
import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage();
const errors = [];
page.on('console', m => m.type() === 'error' && errors.push(m.text()));
page.on('pageerror', e => errors.push(String(e)));
await page.goto('http://localhost:5173/');
await page.getByRole('main').waitFor(); // Use a project-specific readiness signal.
await page.screenshot({ path: 'verify.png', fullPage: true });
// 交互：getByRole('button', { name: 'xxx' }).click() → 断言 UI 状态
await browser.close();
```

- 面向用户的动态交互和关键流程必须自动化验证；仅纯静态或技术上不适用时可记录理由并提供等价证据
- 自动化验证不替代下面的用户报告与用户验收

### 3. 自我验证
- 逐项核对规格中的验收标准
- 记录发现的问题
- 如果发现问题：
  - 局部问题：记录并返回核心工作流第 4 步；重新说明文件和方案并取得写入许可后修复
  - 大问题（方案问题）：报告证据并返回核心工作流第 2 步

### 4. 用户报告
先呈现测试执行证据，再按核心工作流单独取得呈现最终验收结论的许可。报告包含：
- 构建/更改内容的摘要
- 本地 URL（例如 `http://localhost:5173`）
- 需要用户检查的具体区域/功能
- 任何已知限制或注意事项

### 5. 用户验收
- 等待用户确认验收
- 如果用户反馈问题 → 判断问题级别：局部修复返回核心工作流第 4 步；方案问题返回第 2 步；需求变更返回第 1 步
- 如果用户接受 → 进入第 6 步

## 验证

- [ ] 开发服务器启动且功能可访问
- [ ] 自动化验证已跑（Playwright：无控制台错误、无失败请求、状态切换正确）或已说明不适用原因
- [ ] 功能符合验收标准
- [ ] 已按核心工作流取得最终验收报告许可并通知用户
- [ ] 用户已接受（或问题已返回处理）
