# @citemap/cli

Command-line tool for validating [citemap.json](https://citemaps.org) files — schema checks, quality scoring, level assessment, and diagnostic recommendations.

Supports CiteMap v2.0 and v3.0.

## Install

```bash
npm install -g @citemap/cli
```

Or use with npx:

```bash
npx @citemap/cli validate ./citemap.json
```

## Commands

### `citemap validate <path>`

Validate a citemap.json file against the schema. Shows errors, warnings, quality score, and level badge.

```
$ citemap validate .well-known/citemap.json

✓ Valid citemap.json  v3.0
  Level 3 ★★★

Quality Score: 85%
  Completeness  100% [████████████████████]
  Modules       100% [████████████████████]
  Trust          50% [██████████░░░░░░░░░░]

All validations passed.
```

### `citemap diagnose <path>`

Full diagnostic analysis with module coverage, field coverage, next-level hints, and recommendations.

```
$ citemap diagnose .well-known/citemap.json

✓ Valid citemap.json  v3.0
  Level 2 ★★☆

Quality Scores:
  Overall        78% [████████████████░░░░]
  Completeness  100% [████████████████████]
  Modules       100% [████████████████████]
  Trust          25% [█████░░░░░░░░░░░░░░░]

Diagnosis:
  Site type:       local-business
  Field coverage:  135/135 (100%)
  Modules present: localBusiness

To reach Level 3:
  → Add a verification block with externalVerifiers or fieldConfidence
  → Add verifiedClaims with externally checkable identifiers (NPI, EIN, etc.)

Recommendations:
  • Add a verification block with externalVerifiers or fieldConfidence to build trust
  • To reach Level 3: Add verifiedClaims with externally checkable identifiers

✓ All validations passed.
```

### Other

```bash
citemap --version    # Show version
citemap --help       # Show usage
```

## Exit Codes

- `0` — Valid citemap
- `1` — Invalid citemap or error

## Level System

The CLI displays the computed CiteMap Level as a badge:

| Level | Badge | Requirements |
|-------|-------|-------------|
| 1 | `Level 1 ★☆☆` | Core profile (brand, lastVerified) |
| 2 | `Level 2 ★★☆` | + at least 1 module + answerContent + citationContract |
| 3 | `Level 3 ★★★` | + verification + verifiedClaims |

If a citemap claims a level via `citemapLevel` that doesn't match actual content, the CLI flags the mismatch.

## Links

- [CiteMap Spec](https://citemaps.org)
- [GitHub](https://github.com/citemaps/citemap)
- [@citemap/schema](https://www.npmjs.com/package/@citemap/schema) — Schema + TypeScript types
- [@citemap/validator](https://www.npmjs.com/package/@citemap/validator) — Validation + quality scoring

## License

MIT


## 0.5.0

- Uses @citemap/validator 0.5.0: v3.5 schema and rules (v3.3 / v3.4 files get v3.5 findings as warnings), the v3.5 level formula, reachability on the joined record.
- After reading content files, prints the joined record's level.

## 0.4.1

- The `citemap` command runs the current build (0.4.0's bin still loaded an old 0.3.x file, so URLs read as "File not found").

## 0.4.0

- `citemap validate <url>` reads a citemap over https.
- Content files: when a citemap lists `contentFiles`, the CLI reads each one (https only, up to 50, 4 MB each), checks it, and checks the joined record (duplicate `@id`s, relationship endpoints). `--no-follow` skips them.
- v3.3 / v3.4 files are checked against the spec's structural rules instead of the strict v3.0 schema.
