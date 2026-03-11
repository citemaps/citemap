# @citemap/validator

Validate citemap.json files with schema validation, quality scoring, and field diagnostics.

## Features

- **Schema Validation**: Uses AJV to validate against the official citemap.json schema
- **Quality Scoring**: Calculates overall quality (0-100) across completeness, module coverage, and trust signals
- **Diagnostics**: Deep analysis of module coverage and recommendations
- **Warning System**: Identifies quality issues and suggests improvements
- **Type-Safe**: Full TypeScript support with comprehensive interfaces

## Installation

```bash
npm install @citemap/validator
```

## Usage

### Basic Validation

```typescript
import { validate } from '@citemap/validator';

const citemap = {
  "@type": "Citemap",
  "citemapVersion": "2.0",
  "brand": {
    "name": "My Business",
    "url": "https://example.com",
    "siteType": "local-business",
    "aiSummary": "..."
  },
  "lastVerified": "2024-03-11"
};

const result = validate(citemap);

if (result.valid) {
  console.log(`Quality Score: ${result.score.overall}/100`);
  console.log(`Completeness: ${result.score.completeness}/100`);
  console.log(`Module Coverage: ${result.score.modules}/100`);
  console.log(`Trust Signals: ${result.score.trust}/100`);
} else {
  console.error('Validation errors:', result.errors);
}

if (result.warnings.length > 0) {
  console.log('Quality warnings:', result.warnings);
}
```

### Deep Diagnostics

```typescript
import { diagnose } from '@citemap/validator';

const diagnosis = diagnose(citemap);

console.log(`Site Type: ${diagnosis.siteType}`);
console.log(`Applicable Modules: ${diagnosis.applicableModules.join(', ')}`);
console.log(`Present Modules: ${diagnosis.presentModules.join(', ')}`);
console.log(`Missing Modules: ${diagnosis.missingModules.join(', ')}`);
console.log(`Field Coverage: ${diagnosis.fieldCoverage.percentage}%`);

if (diagnosis.recommendations.length > 0) {
  console.log('Recommendations:');
  diagnosis.recommendations.forEach((rec) => console.log(`  - ${rec}`));
}
```

### Combined Validation & Diagnosis

```typescript
import { validateAndDiagnose } from '@citemap/validator';

const result = validateAndDiagnose(citemap);

console.log(`Valid: ${result.valid}`);
console.log(`Quality Score: ${result.score.overall}/100`);
console.log(`Diagnosis: ${result.diagnosis.siteType}`);
```

### Get Applicable Modules for a Site Type

```typescript
import { getApplicableModules } from '@citemap/validator';

const modules = getApplicableModules('ecommerce');
console.log(modules); // ['ecommerce']

const restaurantModules = getApplicableModules('restaurant');
console.log(restaurantModules); // ['localBusiness', 'events']
```

## API Reference

### `validate(data: unknown): ValidationResult`

Validates a citemap.json file against the schema and calculates quality scores.

**Returns:**
- `valid`: Boolean indicating if the schema validation passed
- `errors`: Array of schema validation errors
- `warnings`: Array of quality/completeness warnings
- `score`: Quality score breakdown (overall, completeness, modules, trust)

### `diagnose(data: unknown): Diagnosis`

Performs deep analysis of a citemap file.

**Returns:**
- `siteType`: The detected site type
- `applicableModules`: Modules that should be present for this site type
- `presentModules`: Modules currently present
- `missingModules`: Modules that are missing
- `fieldCoverage`: Percentage of fields filled out
- `recommendations`: Array of improvement suggestions

### `validateAndDiagnose(data: unknown): ValidationResult & { diagnosis: Diagnosis }`

Combines validation and diagnosis in a single call.

### `getApplicableModules(siteType: string): string[]`

Helper function to get the list of modules applicable for a given site type.

## Quality Scoring

The overall quality score (0-100) is calculated as:

```
Overall = (Completeness × 0.4) + (Module Coverage × 0.3) + (Trust Signals × 0.3)
```

### Completeness Score (0-100)
- Based on percentage of required and recommended fields filled
- Required fields are weighted more heavily than recommended fields

### Module Coverage Score (0-100)
- Based on presence of applicable modules for the site type
- Each module present increases the score proportionally

### Trust Signals Score (0-100)
- External verifiers: +30 points
- Field confidence data: +20 points
- Self-authorized citemap: +20 points
- Answer content: +15 points
- Citation preferences or awards: +15 points

## Site Type to Module Mapping

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

## Types

```typescript
interface ValidationError {
  path: string;
  message: string;
  keyword: string;
}

interface ValidationWarning {
  path: string;
  message: string;
  suggestion: string;
}

interface QualityScore {
  overall: number;
  completeness: number;
  modules: number;
  trust: number;
  breakdown: Record<string, number>;
}

interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  score: QualityScore;
}

interface FieldCoverage {
  total: number;
  filled: number;
  percentage: number;
}

interface Diagnosis {
  siteType: string;
  applicableModules: string[];
  presentModules: string[];
  missingModules: string[];
  fieldCoverage: FieldCoverage;
  recommendations: string[];
}
```

## License

MIT
