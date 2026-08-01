import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const skillsRoot = path.join(root, '.agents', 'skills');
const expected = {
  backend: 18,
  frontend: 17,
  integration: 17,
};
const roles = ['backend', 'frontend', 'integration'];
const specializedWorkflows = {
  backend: ['workflows/pr-flow.md'],
  frontend: ['workflows/pr-flow.md'],
  integration: ['workflows/integrate-flow.md', 'workflows/pr-flow.md', 'workflows/release-flow.md'],
};
const legacyNames = [
  'feature-dev-backend',
  'feature-dev-frontend',
  'feature-dev-integration',
  'api-design-backend',
  'api-contract-integration',
  'testing-backend',
  'testing-frontend',
  'review-backend-arch',
  'review-frontend-arch',
  'optimization-backend',
  'optimization-frontend',
  'accessibility-frontend',
  'design-frontend',
  'migration-backend',
  'migration-frontend',
];
const errors = [];

function fail(message) {
  errors.push(message);
}

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

function referencedPaths(text) {
  return [...text.matchAll(/`(references\/[A-Za-z0-9_./-]+\.md)`/g)].map((match) => match[1]);
}

function section(text, heading, nextHeading) {
  const start = text.indexOf(heading);
  if (start === -1) return '';
  const end = nextHeading ? text.indexOf(nextHeading, start + heading.length) : -1;
  return text.slice(start, end === -1 ? text.length : end);
}

if (!fs.existsSync(skillsRoot)) fail('missing .agents/skills');

const topLevel = fs.existsSync(skillsRoot) ? fs.readdirSync(skillsRoot).sort() : [];
for (const role of roles) {
  if (!topLevel.includes(role)) fail(`missing role package: ${role}`);
}
for (const name of topLevel) {
  if (!['backend', 'frontend', 'integration'].includes(name)) fail(`unexpected top-level skill: ${name}`);
}

for (const [role, referenceCount] of Object.entries(expected)) {
  const packageRoot = path.join(skillsRoot, role);
  const entry = path.join(packageRoot, 'SKILL.md');
  const references = path.join(packageRoot, 'references');
  if (!fs.existsSync(entry)) {
    fail(`${role}: missing SKILL.md`);
    continue;
  }
  const entryText = read(entry);
  const name = entryText.match(/^name:\s*(\S+)$/m)?.[1];
  const description = entryText.match(/^description:\s*(.+)$/m)?.[1];
  if (name !== role) fail(`${role}: frontmatter name must be ${role}`);
  if (!description) fail(`${role}: missing description`);
  if (description && description.length > 1024) fail(`${role}: description exceeds 1024 characters`);
  if (!/^---\r?\n[\s\S]*?\r?\n---/.test(entryText)) fail(`${role}: missing YAML frontmatter`);
  if (!fs.existsSync(references)) {
    fail(`${role}: missing references directory`);
    continue;
  }

  const roleFlow = path.join(references, 'workflows', 'role-flow.md');
  if (!fs.existsSync(roleFlow)) {
    fail(`${role}: missing references/workflows/role-flow.md`);
  } else {
    const roleFlowText = read(roleFlow);
    for (const section of [
      '## Step 1:',
      '## Step 2:',
      '## Step 3:',
      '## Step 4:',
      '## Step 5:',
      '## Step 6:',
      '## Loop Rules',
      '## Delivery Checklist',
    ]) {
      if (!roleFlowText.includes(section)) fail(`${role}: role-flow.md missing ${section}`);
    }
  }
  if (!entryText.includes('references/workflows/role-flow.md')) {
    fail(`${role}: SKILL.md must route tasks through role-flow.md`);
  }

  for (const workflow of specializedWorkflows[role]) {
    if (!fs.existsSync(path.join(references, workflow))) {
      fail(`${role}: missing specialized workflow references/${workflow}`);
    }
  }

  const files = [];
  function collect(directory) {
    for (const item of fs.readdirSync(directory, { withFileTypes: true })) {
      const full = path.join(directory, item.name);
      if (item.isDirectory()) collect(full);
      else if (item.name.endsWith('.md')) files.push(full);
    }
  }
  collect(references);
  const normalReferences = files.filter((file) => !file.includes(`${path.sep}workflows${path.sep}`));
  if (normalReferences.length !== referenceCount) {
    fail(`${role}: expected ${referenceCount} references, found ${normalReferences.length}`);
  }
  for (const file of files) {
    const text = read(file);
    const relative = path.relative(root, file);
    if (/^---\r?\n/.test(text)) fail(`${relative}: reference must not have Skill frontmatter`);
    if (/skill\s*\(\s*\{|subagent_type|question\s+工具|使用 question|OPENCODE_TEST_|~\/\.config\/opencode|\.opencode\/roles|\/vibe-role|\/backend-|\/frontend-|\/integration-(?:vibe|pr|integrate|release)/.test(text)) {
      fail(`${relative}: contains OpenCode command/runtime residue`);
    }
    for (const legacyName of legacyNames) {
      const legacyPattern = new RegExp(`(?<![\\w-])${legacyName}(?![\\w-])`);
      if (legacyPattern.test(text)) fail(`${relative}: contains legacy skill name ${legacyName}`);
    }
    if (/\.agents\/skills\/(?:backend|frontend|integration)\/references\/workflows/.test(text)) {
      fail(`${relative}: use package-relative reference paths instead of repository absolute paths`);
    }
    if (/向向|使向|经\s+向用户|用户确认\s+向用户|通过\s+用户确认|角色入口 Skill|我可以展示报告吗|我可以呈现全部发现吗/.test(text)) {
      fail(`${relative}: contains malformed or obsolete workflow wording`);
    }
    if (/^\s*git (?:push origin develop|add -A)\s*$/m.test(text)) {
      fail(`${relative}: contains a forbidden broad stage or direct develop push command`);
    }
    for (const reference of referencedPaths(text)) {
      const target = path.join(packageRoot, reference);
      if (!fs.existsSync(target)) fail(`${relative}: missing referenced file ${reference}`);
    }
  }


  const reachable = new Set();
  const queue = [entry];
  while (queue.length) {
    const current = queue.shift();
    for (const reference of referencedPaths(read(current))) {
      const target = path.join(packageRoot, reference);
      if (!fs.existsSync(target) || reachable.has(target)) continue;
      reachable.add(target);
      queue.push(target);
    }
  }
  for (const file of files) {
    if (!reachable.has(file)) fail(`${path.relative(root, file)}: reference is unreachable from ${role}/SKILL.md`);
  }

  const roleFlowText = read(roleFlow);
  if (/退出条件：(?:规格|计划)已保存|契约初稿已落盘/.test(roleFlowText)) {
    fail(`${role}: role flow requires document writes before write approval`);
  }

  for (const feature of ['feature-development.md']) {
    const featurePath = path.join(references, feature);
    if (!fs.existsSync(featurePath)) continue;
    const featureText = read(featurePath);
    const acceptance = section(featureText, '### 第 5 步', '### 第 6 步');
    if (/提交\s*PR|PR\s*提交/.test(acceptance)) {
      fail(`${role}: ${feature} submits a PR before Step 6 compatibility testing`);
    }
    const specification = section(featureText, '### 第 2 步', '### 第 3 步');
    if (/(?:写入|落盘|产出.{0,12}(?:到|至))\s*`?docs\//.test(specification) && !/批准后/.test(specification)) {
      fail(`${role}: ${feature} writes documentation before Step 3 approval`);
    }
  }

  const prototype = path.join(references, 'prototype.md');
  if (fs.existsSync(prototype)) {
    const prototypeText = read(prototype);
    if (/第\s*5-6\s*步可完全跳过/.test(prototypeText)) {
      fail(`${role}: prototype may not skip acceptance completely`);
    }
    const compatibility = section(prototypeText, '### 第 6 步', '## 验证');
    if (!/用户明确同意/.test(compatibility) || !/残余风险/.test(compatibility)) {
      fail(`${role}: prototype Step 6 exemption requires explicit consent and residual risks`);
    }
  }
}

const forbidden = [
  '.opencode/commands',
  '.opencode/roles',
  '.opencode/docs/role-flow',
  'opencode.jsonc',
  '~/.config/opencode',
  'skill({ name:',
];
for (const item of forbidden) {
  if (fs.existsSync(path.join(root, item))) fail(`legacy path still exists: ${item}`);
}

if (errors.length) {
  console.error(`FAIL: ${errors.length} issue(s)`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('PASS: three standard role packages');
console.log('PASS: 3 entry skills, 52 references, 3 role workflows, 5 specialized workflows');
console.log('PASS: frontmatter, routing reachability, workflow semantics, paths, and legacy residue checks');
