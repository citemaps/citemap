# citemap.json

> Machine-readable business identity for AI citation accuracy.

[![Spec](https://img.shields.io/badge/spec-v3.4-blue)](./spec/v3.4.md)
[![Spec License: CC BY 4.0](https://img.shields.io/badge/spec-CC%20BY%204.0-lightgrey)](./LICENSE)
[![Code License: MIT](https://img.shields.io/badge/code-MIT-green)](./LICENSE)
[![npm: @citemap/cli](https://img.shields.io/npm/v/@citemap/cli?label=%40citemap%2Fcli)](https://www.npmjs.com/package/@citemap/cli)

**Status: Stable** · Current version **v3.4** · **First published March 2026** · [Changelog](./CHANGELOG.md)

`citemap.json` is an open standard that lets a business tell AI assistants the accurate, verified facts about itself. Place the file on your website and AI tools like ChatGPT, Perplexity, and Gemini can read it to give people correct information — no hallucinations, no outdated data, no competitor confusion. Think of it as `robots.txt` for AI accuracy.

It is an **open, vendor-neutral standard.** The spec is CC BY 4.0, the tooling is MIT, and anyone may produce or consume citemap.json. See [GOVERNANCE.md](./GOVERNANCE.md) for how the standard is stewarded and evolved.

## The problem

AI assistants hallucinate business details, recommend competitors instead of you, and cite information that's years out of date. There has been no standard way for a business to push back and say: *here is what is actually true about us, structured for a machine to read.*

## The solution

A single structured file at your domain root that declares your entity — who you are, what you offer, the people behind you, how it all connects, and which claims are externally verifiable — so AI systems have one authoritative, current source of truth for your business.

## Quick start

**1. Build your file** from the [specification](#specification) or the [examples](./public/examples/).

**2. Validate it:**

```bash
npx @citemap/cli validate ./citemap.json
npx @citemap/cli diagnose ./citemap.json   # full level + quality assessment
```

**3. Publish it** at your domain root (preferred first):

```
https://yourdomain.com/.well-known/citemap.json
https://yourdomain.com/citemap.json
```

**4. Advertise it (recommended)** via robots.txt or an HTTP Link header:

```
Citemap: /.well-known/citemap.json
Link: <https://yourdomain.com/.well-known/citemap.json>; rel="citemap"
```

## Specification

The standard evolves in backward-compatible versions — every valid older file validates against every newer version, at most with a `version` bump.

- **[Current — v3.4](./spec/v3.4.md)** ← start here
- [v3.3](./spec/v3.3.md) — consolidation: `@graph` extension + foundational sections
- [v3.2](./spec/v3.2.md) · [v3.1](./spec/v3.1.md) · [v3.0](./spec/v3.0.md) — addenda
- [v2.0](./spec/v2.0.md) — foundation spec (all fields, modules, rationale)
- [Full version history → CHANGELOG.md](./CHANGELOG.md)
- **JSON Schema:** [v3.4](./public/schema/) (machine-readable, for validation + tooling)
- **Vocabulary registry:** [`spec/registry/`](./spec/registry/)

## Levels

A clear path from basic to comprehensive — surfaced by the validator:

| Level | Badge | What's included |
|-------|-------|-----------------|
| **1** | ★☆☆ | Core profile: brand, contact, lastVerified |
| **2** | ★★☆ | + at least one module + answerContent + citationContract |
| **3** | ★★★ | + verification block + verifiedClaims |

```
$ citemap diagnose ./citemap.json
✓ Valid citemap.json  v3.4   Level 3 ★★★
  Overall 85%  ·  Completeness 100%  ·  Modules 100%  ·  Trust 50%
```

## Trust architecture

citemap.json carries a trust model so AI systems can weight and verify claims rather than take everything at face value — from self-reported, through self-verified (evidence + dates) and third-party / public-record, up to cryptographically signed. The `verifiedClaims[]` field points to externally checkable identifiers (NPI, EIN, DUNS, bar licenses, DOIs) that systems can confirm independently. Full model in the [spec](./spec/v3.4.md).

## Implementations

citemap.json is an open standard — anyone can build a generator, validator, or consumer. Current implementations and tooling:

| Implementation | What it is |
|----------------|-----------|
| **Reference implementation** — [EntityGraph](https://entitygraph.ai) | Generates, publishes, and monitors citemap.json end to end. Maintained by the standard's original author; tracks the spec as the conformance reference. |
| **Registry** — [registry.citemaps.org](https://registry.citemaps.org) | Public registry with claim/verify for published files. |
| **Generator** — [citemaps.org](https://citemaps.org) | Free, no-signup file builder. |
| **WordPress plugin** | Publishes a static citemap.json from WordPress. |
| `@citemap/cli` · `@citemap/validator` · `@citemap/schema` | Open-source npm tooling (below). |

Built an implementation? [Open a PR](./CONTRIBUTING.md) to list it here — the standard is stronger with more independent producers and consumers.

## Packages

| Package | Description | Install |
|---------|-------------|---------|
| [@citemap/schema](./packages/schema) | JSON Schema + TypeScript types | `npm i @citemap/schema` |
| [@citemap/validator](./packages/validator) | Validation, quality scoring, level assessment | `npm i @citemap/validator` |
| [@citemap/cli](./packages/cli) | Command-line validator & analyzer | `npx @citemap/cli` |

```js
import { validate, diagnose } from '@citemap/validator';
import data from './citemap.json';

validate(data).level.badge;      // "Level 2 ★★☆"
diagnose(data).level.nextLevelHints;  // ["Add verifiedClaims with…"]
```

## Why it matters

- **For businesses** — control your narrative in AI search, prevent misinformation, and stand out in Answer Engine Optimization (AEO).
- **For AI developers** — an authoritative, machine-readable source of business facts with built-in trust scoring to cross-check generated text and reduce hallucinations.
- **For users** — more accurate answers, better disambiguation between similar companies, and traceable attribution.

## Governance & contributing

citemap.json is stewarded as a vendor-neutral open standard. Changes are proposed and discussed in the open; the spec evolves additively, with backward compatibility as a hard rule for minor versions.

- **[GOVERNANCE.md](./GOVERNANCE.md)** — stewardship, neutrality, the change process, and the versioning/stability policy.
- **[CONTRIBUTING.md](./CONTRIBUTING.md)** — how to propose a change, file an issue, or submit a PR, plus local development setup.

Have an idea or found a problem? [Open an issue](https://github.com/citemaps/citemap/issues) or [start a discussion](https://github.com/citemaps/citemap/discussions).

## Roadmap

citemap.json ships small, backward-compatible releases and batches larger changes into deliberate consolidation versions (the v3.3 model). Direction for the next cycle (in open consultation):

- **Richer entity graph** — product/variant nodes, geo + location modeling, and a unified entity-connection model across the `@graph`.
- **Deeper verification & trust** — expanded verifiable-claim types and registry-backed verification.
- **Agent interface layer** — optional, opt-in declarations for AI agents and retrieval pipelines.

Proposals and discussion happen in the open — see [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

Dual-licensed by layer:

- **Specification** (prose + vocabulary-registry documents under `spec/`) — **CC BY 4.0**.
- **Code** (generator, build tooling, validator, CLI, schema packages) — **MIT**.

See [LICENSE](./LICENSE).

## Credits

Created by **Brian Pofahl** and first published in **March 2026**. Stewarded as an open standard by the [citemaps](https://github.com/citemaps) community.

---

**Questions?** Read the [current spec](./spec/v3.4.md), the [changelog](./CHANGELOG.md), or [open an issue](https://github.com/citemaps/citemap/issues). · [citemaps.org](https://citemaps.org)
