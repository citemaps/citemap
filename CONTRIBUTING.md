# Contributing to citemap.json

Thanks for helping improve the standard. citemap.json is an open,
vendor-neutral specification ([GOVERNANCE.md](./GOVERNANCE.md)) and it gets
better with more independent producers, consumers, and reviewers. There are
three ways to contribute: **propose a spec change**, **improve the tooling**, or
**list an implementation**.

## Propose a change to the specification

Spec changes are worked in the open. Open a
[GitHub Issue](https://github.com/citemaps/citemap/issues) (or a
[Discussion](https://github.com/citemaps/citemap/discussions) for an early-stage
idea) using this shape — a lightweight RFC:

- **Motivation** — what problem does this solve? What breaks or is impossible today?
- **Proposal** — the field(s), value(s), or rule(s) you're adding or changing.
- **Backward compatibility** — confirm it's additive. If it isn't, say so and
  explain how it would be sequenced behind a major version.
- **Example** — a minimal `citemap.json` snippet showing it in use.
- **Consumer impact** — how an AI system / validator / parser would read it.

Good proposals are **additive, specific, and example-backed.** See
[GOVERNANCE.md → How changes are made](./GOVERNANCE.md#how-changes-are-made) for
what happens after you open one, and the backward-compatibility and versioning
rules a change must satisfy.

## Report a problem

Found an error, ambiguity, or contradiction in the spec, schema, or tools?
[Open an issue](https://github.com/citemaps/citemap/issues) with the version,
the location (file + section), and what you expected versus what's there.

## Submit a pull request

1. Fork the repo and create a branch (`git checkout -b proposal/short-name`).
2. Make your change. For spec text, edit the relevant `spec/` file and registry
   entry; don't change released versions' semantics — additions go in the
   next version's addendum.
3. If you touch the schema or tooling, **add or update example files** and make
   sure the validator passes (see below).
4. Update the [CHANGELOG](./CHANGELOG.md) under an "Unreleased" heading.
5. Open a PR with a clear description and link to any related issue.

## Examples & conformance

The [`public/examples/`](./public/examples/) directory holds reference files
that MUST validate against the current spec. When you add a field or rule,
add (or extend) an example that exercises it. Validate any file with:

```bash
npx @citemap/cli validate ./public/examples/saas.citemap.json
npx @citemap/cli diagnose ./public/examples/saas.citemap.json
```

Contributions that grow the corpus of **valid and intentionally-invalid**
examples are especially welcome — they're how implementers trust the spec.

## List your implementation

Built a generator, validator, consumer, plugin, or integration for
citemap.json? Open a PR adding it to the **Implementations** table in the
[README](./README.md#implementations). Independent implementations are the
strongest signal that this is a real, usable standard — we want yours listed.

## Local development

```bash
git clone https://github.com/citemaps/citemap.git
cd citemap

# Build the packages
( cd packages/schema    && npm install && npm run build )
( cd packages/validator && npm install && npm run build )
( cd packages/cli       && npm install && npm run build )

# Run the CLI locally against an example
node packages/cli/dist/index.js validate ./public/examples/local-business.citemap.json
```

## Licensing of contributions

By contributing you agree your contributions are licensed under the project's
terms: **CC BY 4.0** for specification text and **MIT** for code
([LICENSE](./LICENSE)).

## Conduct

Be constructive and respectful. Argue the proposal, not the person. The aim is
one accurate, durable standard that serves businesses, AI systems, and users
alike — not any single vendor.
