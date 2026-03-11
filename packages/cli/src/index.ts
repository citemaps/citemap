#!/usr/bin/env node

import { readFileSync } from 'fs';
import { resolve } from 'path';
import { validate, diagnose } from '@citemap/validator';

const VERSION = '0.2.0';

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function printUsage() {
  console.log(`
${colors.bright}citemap${colors.reset} — Validate citemap.json files for AI accuracy

${colors.bright}Usage:${colors.reset}
  citemap validate <path>    Validate a citemap.json file
  citemap diagnose <path>    Run detailed analysis with scores
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
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      console.error(`${colors.red}✗ File not found${colors.reset}: ${filePath}`);
      process.exit(1);
    }
    console.error(`${colors.red}✗ Error reading file${colors.reset}: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
}

function formatValidationOutput(result: ReturnType<typeof validate>) {
  const statusIcon = result.valid ? `${colors.green}✓${colors.reset}` : `${colors.red}✗${colors.reset}`;
  const statusText = result.valid ? `${colors.green}Valid${colors.reset}` : `${colors.red}Invalid${colors.reset}`;

  console.log(`\n${statusIcon} ${statusText} citemap.json\n`);

  if (result.errors && result.errors.length > 0) {
    console.log(`${colors.red}${colors.bright}Errors (${result.errors.length}):${colors.reset}`);
    result.errors.forEach((error) => {
      console.log(`  ${colors.red}•${colors.reset} ${error}`);
    });
    console.log();
  }

  if (result.warnings && result.warnings.length > 0) {
    console.log(`${colors.yellow}${colors.bright}Warnings (${result.warnings.length}):${colors.reset}`);
    result.warnings.forEach((warning) => {
      console.log(`  ${colors.yellow}•${colors.reset} ${warning}`);
    });
    console.log();
  }

  if (result.valid) {
    console.log(`${colors.green}All validations passed.${colors.reset}\n`);
  }

  process.exit(result.valid ? 0 : 1);
}

function formatDiagnosticOutput(result: ReturnType<typeof diagnose>) {
  const statusIcon = result.valid ? `${colors.green}✓${colors.reset}` : `${colors.red}✗${colors.reset}`;
  const statusText = result.valid ? `${colors.green}Valid${colors.reset}` : `${colors.red}Invalid${colors.reset}`;

  console.log(`\n${statusIcon} ${statusText} citemap.json\n`);

  // Errors
  if (result.errors && result.errors.length > 0) {
    console.log(`${colors.red}${colors.bright}Errors (${result.errors.length}):${colors.reset}`);
    result.errors.forEach((error) => {
      console.log(`  ${colors.red}•${colors.reset} ${error}`);
    });
    console.log();
  }

  // Warnings
  if (result.warnings && result.warnings.length > 0) {
    console.log(`${colors.yellow}${colors.bright}Warnings (${result.warnings.length}):${colors.reset}`);
    result.warnings.forEach((warning) => {
      console.log(`  ${colors.yellow}•${colors.reset} ${warning}`);
    });
    console.log();
  }

  // Score breakdown
  if (result.scores) {
    console.log(`${colors.bright}Quality Scores:${colors.reset}`);
    const scores = result.scores as Record<string, number>;

    Object.entries(scores).forEach(([key, score]) => {
      const percentage = Math.round(score * 100);
      const scoreColor = percentage >= 80 ? colors.green : percentage >= 60 ? colors.yellow : colors.red;
      const bar = getProgressBar(percentage);
      console.log(`  ${key.padEnd(20)} ${scoreColor}${percentage.toString().padStart(3)}%${colors.reset} ${bar}`);
    });
    console.log();
  }

  // Overall assessment
  if (result.valid) {
    console.log(`${colors.green}✓ All validations passed.${colors.reset}\n`);
  } else {
    console.log(`${colors.red}✗ Validation failed. See errors above.${colors.reset}\n`);
  }

  process.exit(result.valid ? 0 : 1);
}

function getProgressBar(percentage: number, width: number = 20): string {
  const filled = Math.round((percentage / 100) * width);
  const empty = width - filled;
  return `[${colors.green}${'█'.repeat(filled)}${colors.reset}${colors.bright}${'░'.repeat(empty)}${colors.reset}]`;
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
    const result = diagnose(data);
    formatDiagnosticOutput(result);
  }
}

main().catch((error) => {
  console.error(`${colors.red}Fatal error:${colors.reset}`, error instanceof Error ? error.message : String(error));
  process.exit(1);
});
