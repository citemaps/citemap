# @citemap/validator

Validate [citemap.json](https://citemaps.org) files against the official schema, with quality scoring, level assessment, and diagnostic recommendations.

Supports CiteMap v2.0 and v3.0.

## Install

```bash
npm install @citemap/validator
```

## Usage

### Basic Validation

```typescript
import { validate } from '@citemap/validator';

const result = validate(myCitemapData);

console.log(result.valid);          // true/false
console.log(result.version);        // "3.0"
console.log(result.level.badge);    // "Level 2 ★★☆"
console.log(result.score.overall);  // 0-100

if (result.warnings.length > 0) {
  result.warnings.forEach(w => {
    console.log(`${w.path}: ${w.message}`);
    console.log(`  → ${w.suggestion}`);
  });
}
```

### Full Diagnosis

```typescript
import { diagnose } from '@citemap/validator';

const diagnosis = diagnose(myCitemapData);

console.log(diagnosis.siteType);        // "local-business"
console.log(diagnosis.presentModules);  // ["localBusiness"]
console.log(diagnosis.missingModules);  // []
console.log(diagnosis.fieldCoverage);   // { total: 173, filled: 173, percentage: 100 }
console.log(diagnosis.level.badge);     // "Level 3 ★★★"

// Next-level coaching
diagnosis.level.nextLevelHints.forEach(hint => {
  console.log(`To reach Level ${diagnosis.level.current + 1}: ${hint}`);
});
```

### Validate + Diagnose in One Call

```typescript
import { validateAndDiagnose } from '@citemap/validator';

const result = validateAndDiagnose(myCitemapData);
// result.valid, result.errors, result.warnings, result.score, result.level
// result.diagnosis.siteType, result.diagnosis.recommendations, etc.
```

## API Reference

### `validate(data: unknown): ValidationResult`

Validates a citemap against the schema and returns errors, warnings, quality score, and level assessment.

### `diagnose(data: unknown): Diagnosis`

Deep analysis with module coverage, field coverage, recommendations, and level assessment.

### `validateAndDiagnose(data: unknown): ValidationResult & { diagnosis: Diagnosis }`

Combines both in a single call.

### `getApplicableModules(siteType: string): string[]`

Returns module names applicable to a given site type (e.g., `"restaurant"` → `["localBusiness", "events"]`).

## ValidationResult

| Field | Type | Description |
|-------|------|-------------|
| `valid` | `boolean` | Whether the citemap passes schema validation |
| `errors` | `ValidationError[]` | Schema errors (path, message, keyword) |
| `warnings` | `ValidationWarning[]` | Quality warnings with suggestions |
| `score` | `QualityScore` | Breakdown: overall, completeness, modules, trust (0-100 each) |
| `level` | `LevelAssessment` | Current level (1/2/3), claimed vs. actual, badge, next-level hints |
| `version` | `string` | Detected citemapVersion |

## LevelAssessment

| Field | Type | Description |
|-------|------|-------------|
| `current` | `1 \| 2 \| 3` | Computed level based on field presence |
| `claimed` | `1 \| 2 \| 3 \| undefined` | The `citemapLevel` declared in the file |
| `claimAccurate` | `boolean` | Whether claimed matches actual |
| `nextLevelHints` | `string[]` | What to add to reach the next level |
| `badge` | `string` | Display string like `"Level 2 ★★☆"` |

## Quality Scoring

```
Overall = (Completeness × 0.4) + (Module Coverage × 0.3) + (Trust Signals × 0.3)
```

- **Completeness (0-100)** — Required + recommended root fields filled
- **Module Coverage (0-100)** — Applicable modules present for the site type
- **Trust Signals (0-100)** — Verification block, authorized-by, answer content, verified claims, citations

## v3-Specific Validation

When `citemapVersion` is `"3.0"`, the validator also checks:

- Missing `citationContract` (warning with suggestion)
- Entity ID format validation (`type:slug` regex pattern)
- `citemapLevel` claim accuracy vs. actual computed level
- `verifiedClaims` type enum values

## Site Type → Module Mapping

| Site Type | Applicable Modules |
|-----------|-------------------|
| ecommerce | ecommerce |
| local-business | localBusiness |
| restaurant | localBusiness, events |
| saas | software |
| content-publisher | content |
| nonprofit | nonprofit |
| healthcare | health |
| education | education |
| real-estate | realEstate |
| legal | legal |
| financial | finance |
| events-venue | events |
| creative-artist | creative |
| government | government |
| science-research | science |
| person | person |
| places | places |
| general | (none) |

## Links

- [CiteMap Spec](https://citemaps.org)
- [GitHub](https://github.com/citemaps/citemap)
- [@citemap/schema](https://www.npmjs.com/package/@citemap/schema) — Schema + TypeScript types
- [@citemap/cli](https://www.npmjs.com/package/@citemap/cli) — Command-line tool

## License

MIT
