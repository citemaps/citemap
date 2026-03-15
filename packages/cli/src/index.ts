#!/usr/bin/env node

import { readFileSync } from 'fs';
import { resolve } from 'path';
import { validate, validateAndDiagnose } from '@citemap/validator';

const VERSION = '0.3.3';

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
  citemap validate <path>    Validate a citemap.json file
  citemap diagnose <path>    Run detailed analysis with scores and level assessment
  citemap --help             Show this help message
  citemap --version          Show version number

${colors.bright}Examples:${colors.reset}
  citemap validate ./citemap.json
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

function formatValidationOutput(result: ReturnType<typeof validate>) {
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

  process.exit(result.valid ? 0 : 1);
}

function formatDiagnosticOutput(data: unknown) {
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

  process.exit(result.valid ? 0 : 1);
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
  const filePath = args[1];

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

  const data = loadJSON(filePath);

  if (command === 'validate') {
    const result = validate(data);
    formatValidationOutput(result);
  } else if (command === 'diagnose') {
    formatDiagnosticOutput(data);
  }
}

main().catch((error) => {
  console.error(`${colors.red}Fatal error:${colors.reset}`, error instanceof Error ? error.message : String(error));
  process.exit(1);
});
