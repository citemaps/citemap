# @citemap/schema

JSON Schema and TypeScript types for [citemap.json](https://citemaps.org) — the machine-readable business identity file for AI citation accuracy.

Supports CiteMap v2.0 and v3.0.

## Install

```bash
npm install @citemap/schema
```

## Usage

### TypeScript Types

```typescript
import { Citemap, Brand, isCitemap } from '@citemap/schema';

const data: Citemap = {
  "@type": "Citemap",
  citemapVersion: "3.0",
  brand: {
    name: "Acme Corp",
    url: "https://acme.com",
    siteType: "local-business",
    aiSummary: "Acme Corp is a leading provider of..."
  },
  lastVerified: "2026-03-14"
};

if (isCitemap(data)) {
  console.log(data.brand.name); // Type-safe access
}
```

### JSON Schema (for validation)

```typescript
import { schema } from '@citemap/schema';
// schema is the raw JSON Schema object — pass it to AJV or any validator
```

Or import the schema file directly:

```typescript
import schema from '@citemap/schema/schema.json';
```

### v3 Level Assessment

```typescript
import { calculateLevel, nextLevelHints } from '@citemap/schema';

const level = calculateLevel(myCitemap); // 1, 2, or 3
const hints = nextLevelHints(myCitemap); // ["Add answerContent with Q&A pairs", ...]
```

## What's in v3.0

CiteMap v3.0 adds five backward-compatible features to v2.0:

| Feature | Description |
|---------|-------------|
| **Citation Contract** | `citationContract` with `preferredName`, `shortDescription`, `disambiguation` — tells AI how to introduce your brand |
| **Formal Levels** | `citemapLevel` (1/2/3) — Level 1 is core profile, Level 2 adds modules + Q&A + contract, Level 3 adds verification + claims |
| **Entity IDs** | Optional `id` field on nested objects (services, people, products, etc.) using `type:slug` format |
| **Module Meta** | Optional `meta` block on every module with `lastUpdated` and `updateFrequency` |
| **Verified Claims** | `verifiedClaims[]` for externally checkable identifiers (NPI, EIN, DUNS, bar licenses, DOIs, etc.) |

Every valid v2.0 citemap also validates against the v3.0 schema.

## Exports

- `schema` — The JSON Schema object
- `Citemap` — Root TypeScript interface
- `isCitemap()` — Type guard
- `calculateLevel()` — Compute Level 1/2/3 from field presence
- `nextLevelHints()` — Get coaching hints for the next level
- All module interfaces (`EcommerceModule`, `LocalBusinessModule`, etc.)
- All entity interfaces (`HeroProduct`, `Service`, `Practitioner`, etc.)
- All enums (`SiteType`, `UpdateFrequency`, `VerifiedClaimType`, etc.)

## Links

- [CiteMap Spec](https://citemaps.org)
- [GitHub](https://github.com/citemaps/citemap)
- [@citemap/validator](https://www.npmjs.com/package/@citemap/validator) — Validation + quality scoring
- [@citemap/cli](https://www.npmjs.com/package/@citemap/cli) — Command-line tool

## License

MIT
