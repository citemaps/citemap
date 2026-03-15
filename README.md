# citemap.json

> Machine-readable business identity for AI citation accuracy.

`citemap.json` is an open standard that lets businesses tell AI assistants the accurate, verified facts about themselves. Place it on your website, and AI tools like ChatGPT, Perplexity, and Gemini can read it to give customers correct information—no hallucinations, no outdated data, no competitor confusion.

## The Problem

AI assistants hallucinate business details. They recommend competitors instead of you. They cite information that's years out of date. There's no standard way for businesses to push back and say, "Here's what's actually true about us."

## The Solution

`citemap.json` — a structured file you place on your website, similar to `robots.txt` for AI accuracy. AI assistants can read it to get verified, current, authoritative information about your business. Think of it as a "citation map" that helps AI understand your business identity.

## Quick Start

### Validate your citemap.json

```bash
# Using npx (no install required)
npx @citemap/cli validate ./citemap.json

# Install globally for repeated use
npm install -g @citemap/cli
citemap validate ./citemap.json

# Full diagnostic with level assessment
citemap diagnose ./citemap.json
```

### Use the validator in your code

```bash
npm install @citemap/validator
```

```javascript
import { validate, diagnose } from '@citemap/validator';
import data from './citemap.json';

// Quick validation with level assessment
const result = validate(data);
console.log(result.valid);        // true or false
console.log(result.level.badge);  // "Level 2 ★★☆"
console.log(result.score.overall); // 0-100

// Detailed analysis with next-level coaching
const analysis = diagnose(data);
console.log(analysis.level.nextLevelHints); // ["Add verifiedClaims with..."]
```

## Specification

- **[Full Specification (v2.0)](./spec/v2.0.md)** — Foundation spec: all fields, modules, and design rationale
- **[v3.0 Addendum](./spec/v3.0.md)** — Five backward-compatible additions: Citation Contract, Formal Levels, Entity IDs, Module Meta, Verified Claims
- **[JSON Schema (v3.0)](./public/schema/v3.0/citemap.schema.json)** — Machine-readable schema for validation and tooling
- **[JSON Schema (v2.0)](./public/schema/v2.0/citemap.schema.json)** — Legacy v2.0 schema

## Packages

| Package | Description | Version | Install |
|---------|-------------|---------|---------|
| [@citemap/schema](./packages/schema) | JSON Schema + TypeScript types for v2.0/v3.0 | ![npm](https://img.shields.io/npm/v/@citemap/schema) | `npm i @citemap/schema` |
| [@citemap/validator](./packages/validator) | Validation engine, quality scoring, level assessment | ![npm](https://img.shields.io/npm/v/@citemap/validator) | `npm i @citemap/validator` |
| [@citemap/cli](./packages/cli) | Command-line validator & analyzer | ![npm](https://img.shields.io/npm/v/@citemap/cli) | `npx @citemap/cli` |

## What's New in v3.0

CiteMap v3.0 (March 2026) adds five backward-compatible features. Every valid v2.0 file also validates against v3.0.

| Feature | Field | Description |
|---------|-------|-------------|
| **Citation Contract** | `citationContract` | Tell AI how to introduce your brand: `preferredName`, `shortDescription`, `disambiguation` |
| **Formal Levels** | `citemapLevel` | 1 = core profile, 2 = modules + Q&A + contract, 3 = full verification + claims |
| **Entity IDs** | `id` on nested objects | Stable `type:slug` identifiers on services, people, products, etc. |
| **Module Meta** | `meta` on each module | `lastUpdated` and `updateFrequency` per module |
| **Verified Claims** | `verifiedClaims[]` | Externally checkable identifiers: NPI, EIN, DUNS, bar licenses, DOIs, etc. |

## Levels

The v3.0 Level system gives businesses a clear path from basic to comprehensive:

| Level | Badge | What's Included |
|-------|-------|-----------------|
| **1** | ★☆☆ | Core profile: brand, contact, lastVerified |
| **2** | ★★☆ | + at least 1 module + answerContent + citationContract |
| **3** | ★★★ | + verification block + verifiedClaims |

```
$ citemap diagnose ./citemap.json

✓ Valid citemap.json  v3.0
  Level 3 ★★★

Quality Scores:
  Overall        85% [█████████████████░░░]
  Completeness  100% [████████████████████]
  Modules       100% [████████████████████]
  Trust          50% [██████████░░░░░░░░░░]
```

## Examples

Browse real-world citemap.json examples in the [examples/](./public/examples/) directory:

- [Local Business](./public/examples/local-business.json) — Retail store with v3.0 features
- [E-commerce](./public/examples/ecommerce.json) — Online retailer
- [SaaS](./public/examples/saas.json) — Software company
- [B2B](./public/examples/b2b.json) — Business-to-business company

## Deployment

### Step 1: Create your citemap.json

Use the specification or examples above to build your file. Validate it with the CLI:

```bash
npx @citemap/cli validate ./citemap.json
```

### Step 2: Place it on your website

Add the file to your web server in one of these locations (preferred first):

```
https://yourdomain.com/.well-known/citemap.json
https://yourdomain.com/citemap.json
```

### Step 3: Advertise it (optional but recommended)

Add a reference to your `robots.txt`:

```
Citemap: /.well-known/citemap.json
```

Or add an HTTP `Link` header:

```
Link: <https://yourdomain.com/.well-known/citemap.json>; rel="citemap"
```

## Trust Architecture

citemap.json includes a trust system to help AI assistants weight and verify information:

1. **Self-Reported** — Information you provide directly in the file
2. **Self-Verified** — Information you provide with evidence (links, dates)
3. **Third-Party Verified** — Information verified by third parties (certifications, awards)
4. **Public Record** — Information from public registries (business license, SEC filings)
5. **Cryptographically Signed** — Information signed with DNSSEC or other cryptographic proof
6. **AI-Audited** — Information fact-checked by external AI tools

v3.0's `verifiedClaims` field lets businesses point to externally checkable identifiers (NPI, EIN, DUNS, bar licenses) that AI systems can verify independently.

## Why It Matters

### For Businesses
- **Accurate AI Presence**: Control your narrative in AI search
- **Better Customer Discovery**: Customers find you with confidence
- **Competitive Edge**: Stand out in Answer Engine Optimization (AEO)
- **Reduced Misinformation**: Prevent AI from spreading false information about you

### For AI Developers
- **Reliable Data Source**: Get authoritative business facts
- **Reduced Hallucinations**: Cross-reference AI-generated text against citemap
- **Better Attribution**: Know exactly where information comes from
- **Scalable Verification**: Machine-readable trust scores and verified claims

### For Users
- **More Accurate Answers**: AI assistants cite correct information
- **Better Recommendations**: AI can distinguish between similar companies
- **Source Verification**: See where a recommendation came from

## Contributing

We welcome contributions! Here's how to help:

### Report Issues
Found a problem with the spec or tools? [Open an issue](https://github.com/citemaps/citemap/issues).

### Suggest Improvements
Have ideas for new modules, fields, or features? [Start a discussion](https://github.com/citemaps/citemap/discussions).

### Submit Pull Requests
- Fork the repository
- Create a feature branch (`git checkout -b feature/your-feature`)
- Make your changes
- Add tests if applicable
- Commit with clear messages
- Push and open a pull request

### Development Setup

```bash
# Clone the repo
git clone https://github.com/citemaps/citemap.git
cd citemap

# Install and build packages
cd packages/schema && npm install && npm run build && cd ..
cd validator && npm install && npm run build && cd ..
cd cli && npm install && npm run build && cd ../..

# Run the CLI locally
node packages/cli/dist/index.js validate ./public/examples/local-business.json
```

## Roadmap

- **v3.0** (March 2026) ✅ — Citation Contract, Formal Levels, Entity IDs, Module Meta, Verified Claims
- **v3.1** — WordPress plugin for one-click citemap generation
- **v3.2** — AI Crawler Integration: formal acknowledgment by major AI systems
- **v4.0** — Cryptographic Trust Layer: W3C Verifiable Credentials integration

## License

MIT — Free to use, modify, and distribute. See [LICENSE](./LICENSE) for details.

## Credits

Created by [Brian Pofahl](https://citemaps.ai) at [CiteMaps](https://github.com/citemaps). Maintained by the citemap community.

---

**Questions?** Read the [v2.0 spec](./spec/v2.0.md), the [v3.0 addendum](./spec/v3.0.md), or [open an issue](https://github.com/citemaps/citemap/issues).

**Want to stay updated?** Star the repo, watch for releases, or visit [citemaps.ai](https://citemaps.ai).
