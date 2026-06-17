#!/usr/bin/env node

import { readFileSync, readdirSync, statSync, existsSync } from 'fs'
import { join } from 'path'

const ROOT = new URL('..', import.meta.url).pathname.replace(/^\/([a-zA-Z]:)/, '$1')

const IGNORE_DIRS = new Set([
  'node_modules', '.next', '.git', '.vercel', 'out', 'build', 'coverage',
])

const ALLOWED_PATTERNS = [
  /process\.env\./,
  /process\.env\[/,
  /import\.meta\.env\./,
]

const SECRET_PATTERNS = [
  { pattern: /sk_live_[0-9a-zA-Z]+/, name: 'Stripe live secret key' },
  { pattern: /sk_test_[0-9a-zA-Z]+/, name: 'Stripe test secret key' },
  { pattern: /ghp_[0-9a-zA-Z]{36}/, name: 'GitHub personal access token' },
  { pattern: /gho_[0-9a-zA-Z]{36}/, name: 'GitHub OAuth token' },
  { pattern: /xox[bp]-[0-9a-zA-Z-]{20,}/, name: 'Slack token' },
  { pattern: /AKIA[0-9A-Z]{16}/, name: 'AWS access key' },
  { pattern: /-----BEGIN (RSA |EC )?PRIVATE KEY-----/, name: 'Private key' },
  { pattern: /SG\.[0-9a-zA-Z_-]{20,}\.[0-9a-zA-Z_-]{20,}/, name: 'SendGrid API key' },
]

function shouldIgnore(filePath) {
  const parts = filePath.replace(/\\/g, '/').split('/')
  return parts.some(p => IGNORE_DIRS.has(p))
}

function isAllowedLine(line) {
  return ALLOWED_PATTERNS.some(p => p.test(line))
}

function scanFile(filePath) {
  if (shouldIgnore(filePath)) return []
  if (!existsSync(filePath)) return []

  const findings = []
  const content = readFileSync(filePath, 'utf-8')
  const lines = content.split('\n')

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (isAllowedLine(line)) continue

    for (const { pattern, name } of SECRET_PATTERNS) {
      if (pattern.test(line)) {
        findings.push({ file: filePath, line: i + 1, secret: name, snippet: line.trim().slice(0, 80) })
      }
    }
  }

  return findings
}

function getAllFiles(dir) {
  const files = []
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry)
    if (shouldIgnore(fullPath)) continue
    if (statSync(fullPath).isDirectory()) {
      files.push(...getAllFiles(fullPath))
    } else if (/\.(ts|tsx|js|mjs|json|yml|yaml)$/.test(fullPath)) {
      files.push(fullPath)
    }
  }
  return files
}

console.log('Scanning for secrets...\n')

const allFiles = getAllFiles(ROOT)
let totalFindings = 0

for (const file of allFiles) {
  const findings = scanFile(file)
  if (findings.length > 0) {
    for (const f of findings) {
      console.log(`  [WARN] ${f.file}:${f.line} - ${f.secret}`)
      console.log(`         ${f.snippet}`)
      totalFindings++
    }
  }
}

if (totalFindings > 0) {
  console.log(`\nFound ${totalFindings} potential secrets. Review and remove them.`)
  process.exit(1)
} else {
  console.log('No secrets detected.')
}
