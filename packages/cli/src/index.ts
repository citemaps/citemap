#!/usr/bin/env node

import { readFileSync } from 'fs';
import { resolve } from 'path';
import { validate, validateAndDiagnose, validateContentFile, checkAcrossFiles } from '@citemap/validator';

const VERSION = '0.4.0';

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function printUsage() {
  console.log(`
${colors.bright}citemap${colors.reset} — Validate citemap.json files for AI accuracy

${colors.bright}Usage:${colors.reset}
  citemap validate <path|url>   Validate a citemap.json file or URL
  citemap diagnose <path|url>   Run detailed analysis with scores and level assessment

${colors.bright}Options:${colors.reset}
  --no-follow   Don't read the content files a citemap lists in contentFiles
                (followed by default: https only, up to 50 files)
  citemap --help             Show this help message
  citemap --version          Show version number

${colors.bright}Examples:${colors.reset}
  citemap validate ./citemap.json
  citemap validate https://example.com/citemap.json
  citemap diagnose .well-known/citemap.json

${colors.bright}Learn more:${colors.reset}
  https://github.com/citemaps/citemap
`);
}

function printVersion() {
  console.log(`citemap v${VERSION}`);
}

function loadJSON(filePath: string): unknown {
  try {
    const absolutePath = resolve(filePath);
    const content = readFileSync(absolutePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    if (error instanceof SyntaxError) {
      console.error(`${colors.red}✗ Invalid JSON${colors.reset}: ${error.message}`);
      process.exit(1);
    }
    if (error instanceof Error && 'code' in error && (error as any).code === 'ENOENT') {
      console.error(`${colors.red}✗ File not found${colors.reset}: ${filePath}`);
      process.exit(1);
    }
    console.error(`${colors.red}✗ Error reading file${colors.reset}: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
}

function getProgressBar(percentage: number, width: number = 20): string {
  const filled = Math.round((percentage / 100) * width);
  const empty = width - filled;
  return `[${colors.green}${'█'.repeat(filled)}${colors.reset}${colors.dim}${'░'.repeat(empty)}${colors.reset}]`;
}

function scoreColor(score: number): string {
  if (score >= 80) return colors.green;
  if (score >= 60) return colors.yellow;
  return colors.red;
}

function formatValidationOutput(result: ReturnType<typeof validate>): boolean {
  const statusIcon = result.valid ? `${colors.green}✓${colors.reset}` : `${colors.red}✗${colors.reset}`;
  const statusText = result.valid ? `${colors.green}Valid${colors.reset}` : `${colors.red}Invalid${colors.reset}`;

  console.log(`\n${statusIcon} ${statusText} citemap.json  ${colors.dim}v${result.version}${colors.reset}`);

  // Level badge
  const lvl = result.level;
  const levelColor = lvl.current === 3 ? colors.green : lvl.current === 2 ? colors.cyan : colors.yellow;
  console.log(`  ${levelColor}${colors.bright}${lvl.badge}${colors.reset}`);
  if (!lvl.claimAccurate && lvl.claimed != null) {
    console.log(`  ${colors.yellow}⚠ Claimed Level ${lvl.claimed}, actual Level ${lvl.current}${colors.reset}`);
  }
  console.log();

  // Errors
  if (result.errors.length > 0) {
    console.log(`${colors.red}${colors.bright}Errors (${result.errors.length}):${colors.reset}`);
    result.errors.forEach((error) => {
      console.log(`  ${colors.red}•${colors.reset} ${error.path}: ${error.message}`);
    });
    console.log();
  }

  // Warnings
  if (result.warnings.length > 0) {
    console.log(`${colors.yellow}${colors.bright}Warnings (${result.warnings.length}):${colors.reset}`);
    result.warnings.forEach((warning) => {
      console.log(`  ${colors.yellow}•${colors.reset} ${warning.path}: ${warning.message}`);
      console.log(`    ${colors.dim}→ ${warning.suggestion}${colors.reset}`);
    });
    console.log();
  }

  // Quality score
  const s = result.score;
  console.log(`${colors.bright}Quality Score: ${scoreColor(s.overall)}${s.overall}%${colors.reset}`);
  console.log(`  Completeness  ${scoreColor(s.completeness)}${s.completeness.toString().padStart(3)}%${colors.reset} ${getProgressBar(s.completeness)}`);
  console.log(`  Modules       ${scoreColor(s.modules)}${s.modules.toString().padStart(3)}%${colors.reset} ${getProgressBar(s.modules)}`);
  console.log(`  Trust         ${scoreColor(s.trust)}${s.trust.toString().padStart(3)}%${colors.reset} ${getProgressBar(s.trust)}`);
  console.log();

  if (result.valid) {
    console.log(`${colors.green}All validations passed.${colors.reset}\n`);
  }

  return result.valid;
}

function formatDiagnosticOutput(data: unknown): boolean {
  const result = validateAndDiagnose(data);
  const diag = result.diagnosis;

  const statusIcon = result.valid ? `${colors.green}✓${colors.reset}` : `${colors.red}✗${colors.reset}`;
  const statusText = result.valid ? `${colors.green}Valid${colors.reset}` : `${colors.red}Invalid${colors.reset}`;

  console.log(`\n${statusIcon} ${statusText} citemap.json  ${colors.dim}v${result.version}${colors.reset}`);

  // Level badge
  const lvl = result.level;
  const levelColor = lvl.current === 3 ? colors.green : lvl.current === 2 ? colors.cyan : colors.yellow;
  console.log(`  ${levelColor}${colors.bright}${lvl.badge}${colors.reset}`);
  if (!lvl.claimAccurate && lvl.claimed != null) {
    console.log(`  ${colors.yellow}⚠ Claimed Level ${lvl.claimed}, actual Level ${lvl.current}${colors.reset}`);
  }
  console.log();

  // Errors
  if (result.errors.length > 0) {
    console.log(`${colors.red}${colors.bright}Errors (${result.errors.length}):${colors.reset}`);
    result.errors.forEach((error) => {
      console.log(`  ${colors.red}•${colors.reset} ${error.path}: ${error.message}`);
    });
    console.log();
  }

  // Warnings
  if (result.warnings.length > 0) {
    console.log(`${colors.yellow}${colors.bright}Warnings (${result.warnings.length}):${colors.reset}`);
    result.warnings.forEach((warning) => {
      console.log(`  ${colors.yellow}•${colors.reset} ${warning.path}: ${warning.message}`);
      console.log(`    ${colors.dim}→ ${warning.suggestion}${colors.reset}`);
    });
    console.log();
  }

  // Quality score
  const s = result.score;
  console.log(`${colors.bright}Quality Scores:${colors.reset}`);
  console.log(`  Overall       ${scoreColor(s.overall)}${s.overall.toString().padStart(3)}%${colors.reset} ${getProgressBar(s.overall)}`);
  console.log(`  Completeness  ${scoreColor(s.completeness)}${s.completeness.toString().padStart(3)}%${colors.reset} ${getProgressBar(s.completeness)}`);
  console.log(`  Modules       ${scoreColor(s.modules)}${s.modules.toString().padStart(3)}%${colors.reset} ${getProgressBar(s.modules)}`);
  console.log(`  Trust         ${scoreColor(s.trust)}${s.trust.toString().padStart(3)}%${colors.reset} ${getProgressBar(s.trust)}`);
  console.log();

  // Diagnosis details
  console.log(`${colors.bright}Diagnosis:${colors.reset}`);
  console.log(`  Site type:       ${colors.cyan}${diag.siteType}${colors.reset}`);
  console.log(`  Field coverage:  ${scoreColor(diag.fieldCoverage.percentage)}${diag.fieldCoverage.filled}/${diag.fieldCoverage.total} (${diag.fieldCoverage.percentage}%)${colors.reset}`);

  if (diag.presentModules.length > 0) {
    console.log(`  Modules present: ${colors.green}${diag.presentModules.join(', ')}${colors.reset}`);
  }
  if (diag.missingModules.length > 0) {
    console.log(`  Modules missing: ${colors.yellow}${diag.missingModules.join(', ')}${colors.reset}`);
  }
  console.log();

  // Next level hints
  if (lvl.nextLevelHints.length > 0) {
    const nextLevel = lvl.current + 1;
    console.log(`${colors.bright}To reach Level ${nextLevel}:${colors.reset}`);
    lvl.nextLevelHints.forEach((hint) => {
      console.log(`  ${colors.magenta}→${colors.reset} ${hint}`);
    });
    console.log();
  }

  // Recommendations
  if (diag.recommendations.length > 0) {
    console.log(`${colors.bright}Recommendations:${colors.reset}`);
    diag.recommendations.forEach((rec) => {
      console.log(`  ${colors.blue}•${colors.reset} ${rec}`);
    });
    console.log();
  }

  if (result.valid) {
    console.log(`${colors.green}✓ All validations passed.${colors.reset}\n`);
  } else {
    console.log(`${colors.red}✗ Validation failed. See errors above.${colors.reset}\n`);
  }

  return result.valid;
}

// ── Content files (0.4.0) ──────────────────────────────────
// A citemap may list Media and products in separate files
// (contentFiles[], each "@type": "CitemapContentFile"). Read them (https
// only, capped) and check each file plus the joined record.
const MAX_FILES = 50;
const MAX_BYTES = 4 * 1024 * 1024;

async function fetchJSON(url: string): Promise<unknown> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 15000);
  try {
    const res = await fetch(url, { signal: ctrl.signal, headers: { Accept: 'application/json', 'User-Agent': `citemap-cli/${VERSION}` } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const text = await res.text();
    if (text.length > MAX_BYTES) throw new Error('larger than 4 MB');
    return JSON.parse(text);
  } finally {
    clearTimeout(t);
  }
}

async function checkContentFiles(main: any): Promise<boolean> {
  const refs: any[] = Array.isArray(main?.contentFiles) ? main.contentFiles : [];
  if (!refs.length) return true;
  console.log(`${colors.bright}Content files${colors.reset} ${colors.dim}(${refs.length} listed)${colors.reset}`);
  const read: Array<{ url: string; data: unknown }> = [];
  let ok = true;
  for (const ref of refs.slice(0, MAX_FILES)) {
    const label = `${ref?.type ?? '?'}${ref?.year ? ' ' + ref.year : ''}${ref?.category ? ' · ' + ref.category : ''}`;
    if (typeof ref?.url !== 'string' || !/^https:\/\//i.test(ref.url)) { console.log(`  ${colors.red}✗${colors.reset} ${label}: url isn't https`); ok = false; continue; }
    try {
      const data = await fetchJSON(ref.url);
      const r = validateContentFile(data, ref);
      read.push({ url: ref.url, data });
      if (r.valid) console.log(`  ${colors.green}✓${colors.reset} ${label} ${colors.dim}(${r.count} item${r.count === 1 ? "" : "s"})${colors.reset}`);
      else { ok = false; console.log(`  ${colors.red}✗${colors.reset} ${label}: ${r.errors.map((e: any) => e.message).join('; ')}`); }
      for (const w of r.warnings) console.log(`    ${colors.yellow}⚠${colors.reset} ${w.message}`);
    } catch (e) {
      ok = false;
      console.log(`  ${colors.red}✗${colors.reset} ${label}: couldn't read ${ref.url} (${e instanceof Error ? e.message : String(e)})`);
    }
  }
  if (refs.length > MAX_FILES) console.log(`  ${colors.yellow}⚠${colors.reset} ${refs.length - MAX_FILES} more listed; only ${MAX_FILES} read`);
  const across = checkAcrossFiles(main, read);
  for (const e of across.errors) { ok = false; console.log(`  ${colors.red}✗${colors.reset} ${e.message}`); }
  for (const w of across.warnings) console.log(`  ${colors.yellow}⚠${colors.reset} ${w.message}`);
  console.log('');
  return ok;
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === '--help') {
    printUsage();
    process.exit(0);
  }

  if (args[0] === '--version') {
    printVersion();
    process.exit(0);
  }

  const command = args[0];
  const follow = !args.includes('--no-follow');
  const filePath = args.slice(1).find(a => !a.startsWith('--'));

  if (!filePath) {
    console.error(`${colors.red}Error: File path required${colors.reset}\n`);
    printUsage();
    process.exit(1);
  }

  if (command !== 'validate' && command !== 'diagnose') {
    console.error(`${colors.red}Error: Unknown command '${command}'${colors.reset}\n`);
    console.error(`Supported commands: ${colors.cyan}validate${colors.reset}, ${colors.cyan}diagnose${colors.reset}\n`);
    process.exit(1);
  }

  let data: unknown;
  if (/^https?:\/\//i.test(filePath)) {
    try { data = await fetchJSON(filePath); }
    catch (e) { console.error(`${colors.red}✗ Couldn't read ${filePath}${colors.reset}: ${e instanceof Error ? e.message : String(e)}`); process.exit(1); }
  } else data = loadJSON(filePath);

  // A content file given directly: check it on its own.
  if ((data as any)?.['@type'] === 'CitemapContentFile') {
    const r = validateContentFile(data);
    console.log(`\n${r.valid ? colors.green + '✓ Valid' : colors.red + '✗ Invalid'}${colors.reset} content file ${colors.dim}(${r.contentType ?? '?'}, ${r.count} items)${colors.reset}`);
    for (const e of r.errors) console.log(`  ${colors.red}✗${colors.reset} ${e.path}: ${e.message}`);
    for (const w of r.warnings) console.log(`  ${colors.yellow}⚠${colors.reset} ${w.path}: ${w.message}`);
    console.log('');
    process.exit(r.valid ? 0 : 1);
  }

  const valid = command === 'validate' ? formatValidationOutput(validate(data)) : formatDiagnosticOutput(data);
  const filesOk = follow ? await checkContentFiles(data) : true;
  process.exit(valid && filesOk ? 0 : 1);
}

main().catch((error) => {
  console.error(`${colors.red}Fatal error:${colors.reset}`, error instanceof Error ? error.message : String(error));
  process.exit(1);
});
