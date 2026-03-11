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

# Install globally or locally for repeated use
npm install -g @citemap/cli
citemap validate ./citemap.json
```

### Use the validator in your code

```bash
npm install @citemap/validator
```

```javascript
import { validate, diagnose } from '@citemap/validator';

const data = require('./citemap.json');

// Quick validation
const result = validate(data);
console.log(result.valid); // true or false

// Detailed analysis with scores
const analysis = diagnose(data);
console.log(analysis.scores); // { accuracy: 0.95, completeness: 0.88, ... }
```

## Specification

- **[Full Specification (v2.0)](./spec/v2.0.md)** — Complete guide to all fields, optional modules, and design rationale
- **[JSON Schema](./packages/schema/src/citemap.schema.json)** — Machine-readable schema for validation and tooling

## Packages

| Package | Description | Version | npm |
|---------|-------------|---------|-----|
| [@citemap/schema](./packages/schema) | JSON Schema + TypeScript types | ![npm](https://img.shields.io/npm/v/@citemap/schema) | `npm i @citemap/schema` |
| [@citemap/validator](./packages/validator) | Validation engine, quality scoring, diagnostics | ![npm](https://img.shields.io/npm/v/@citemap/validator) | `npm i @citemap/validator` |
| [@citemap/cli](./packages/cli) | Command-line validator & analyzer | ![npm](https://img.shields.io/npm/v/@citemap/cli) | `npx @citemap/cli` |

## 21 Modules

citemap.json is organized into 21 discrete modules covering core identity, AI-relevant details, operations, and trust:

| # | Module | Purpose |
|---|--------|---------|
| 1 | **identity** | Company name, legal entity, founding date |
| 2 | **location** | Physical headquarters and office locations |
| 3 | **contact** | Public phone, email, website URLs |
| 4 | **social** | Social media profiles & verification |
| 5 | **founders** | Founding team names and credentials |
| 6 | **leadership** | Current executive team and board |
| 7 | **employees** | Headcount, departments, key roles |
| 8 | **products** | Core offerings, names, descriptions |
| 9 | **services** | Services offered, industries served |
| 10 | **pricing** | Pricing models, tier names, ranges |
| 11 | **integrations** | Third-party platforms and partnerships |
| 12 | **awards** | Awards, certifications, recognitions |
| 13 | **funding** | Funding rounds, investors, valuations |
| 14 | **customers** | Notable customers, case studies, logos |
| 15 | **technology** | Tech stack, platforms, infrastructure |
| 16 | **security** | Compliance certifications, data practices |
| 17 | **sustainability** | Environmental & social initiatives |
| 18 | **newsroom** | Recent press releases, media mentions |
| 19 | **culture** | Company values, mission, company size |
| 20 | **history** | Timeline of major milestones |
| 21 | **trust** | Verification layer and trust scores |

## Examples

Browse real-world citemap.json examples in the [examples/](./examples/) directory:

- [Tech Startup](./examples/startup.json) — Early-stage SaaS company
- [Enterprise Software](./examples/enterprise.json) — Established B2B vendor
- [Service Company](./examples/agency.json) — Creative/consulting agency
- [E-commerce Brand](./examples/ecommerce.json) — Online retailer
- [Minimal Example](./examples/minimal.json) — Core required fields only

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

citemap.json includes a 6-tier trust system to help AI assistants weight and verify information:

1. **Self-Reported** — Information you provide directly in the file
2. **Self-Verified** — Information you provide with evidence (links, dates)
3. **Third-Party Verified** — Information verified by third parties (certifications, awards)
4. **Public Record** — Information from public registries (business license, SEC filings)
5. **Cryptographically Signed** — Information signed with DNSSEC or other cryptographic proof
6. **AI-Audited** — Information fact-checked by external AI tools

Higher tiers carry more weight. This helps prevent false claims while respecting business autonomy.

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
- **Scalable Verification**: Machine-readable trust scores

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

# Install dependencies (all packages)
npm install

# Build all packages
npm run build

# Run tests
npm test

# Run the CLI in development
npm run cli -- validate ./examples/minimal.json
```

### Code Style

- Use TypeScript for new code
- Follow existing patterns in the codebase
- Format with Prettier: `npm run format`
- Lint with ESLint: `npm run lint`
- Write tests for new features

## Roadmap

- **v2.1** (Q2 2026): GraphQL API for querying citemap data
- **v3.0** (Q4 2026): Cryptographic signing and verification
- **v3.5** (Q2 2027): Real-time webhook notifications for changes
- **SDK Release**: Official SDKs for Node.js, Python, and Go

## License

MIT — Free to use, modify, and distribute. See [LICENSE](./LICENSE) for details.

## Credits

Created by [Brian Pofahl](https://citemaps.ai) at [CiteMaps](https://github.com/citemaps). Maintained by the citemap community.

---

**Questions?** Check the [FAQ](./docs/FAQ.md), read the [full spec](./spec/v2.0.md), or [open an issue](https://github.com/citemaps/citemap/issues).

**Want to stay updated?** Star the repo, watch for releases, or subscribe to the [CiteMaps newsletter](https://citemaps.ai/#newsletter).
