---
name: security-audit
description: Targeted security review. Read-only analysis focusing on vulnerabilities, auth patterns, and data protection.
---

# Security Audit

## Overview

A read-only security review. You analyze code for vulnerabilities and provide findings. Do NOT modify any code.

## Workflow Adaptation

### Step 1 — Clarify
Ask the user:
- Scope: what to audit (specific files, modules, or entire codebase)
- Threat model: what's the risk profile? (public-facing? handles sensitive data? PCI/HIPAA/etc.?)
- Any previous audit findings to follow up on

### Step 2 — Analysis (replaces Spec & Plan)
Review across these security dimensions:
- **Authentication:** Session management, password handling, MFA, token validation
- **Authorization:** Access control checks, privilege escalation paths
- **Input Validation:** SQL injection, XSS, command injection, SSRF
- **Data Protection:** Encryption (at rest and in transit), secrets management
- **Dependencies:** Known vulnerable versions, supply chain risks
- **Configuration:** Default credentials, debug endpoints, CORS, security headers

Write findings document:
- Severity: Critical / High / Medium / Low / Info
- Location: file:line for each finding
- Impact: what an attacker could do
- Fix: specific remediation steps

### Step 3 — Gate
Present: "Audit complete. [X critical, Y high, Z medium] findings. May I present the report?"

### Step 4 — Not applicable (read-only)

### Step 5 — Present findings and wait for user feedback.

## Verification

- [ ] All security dimensions covered
- [ ] Each finding has severity, location, impact, and fix
- [ ] No code was modified during audit
- [ ] Report is actionable (user can act on findings)
