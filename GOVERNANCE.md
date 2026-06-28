# Governance

How the **citemap.json** standard is stewarded, who decides changes, and the
rules the specification evolves by. The goal is a standard that is **open,
vendor-neutral, stable, and trustworthy** — one that any business can publish
and any AI system can consume without depending on a single company.

## Principles

1. **Open.** The specification is published under CC BY 4.0 and the tooling
   under MIT. Anyone may read, implement, fork, or build on citemap.json.
2. **Vendor-neutral.** citemap.json is not owned or controlled by any single
   product. Implementations — including the reference implementation — are
   credited but hold no special authority over the specification. The standard
   answers to its published rules and its community, not to any vendor's
   roadmap.
3. **Backward-compatible by default.** Minor versions are strictly additive. A
   file valid under an earlier version MUST validate under every later version
   in the same major line. Breaking changes require a major version and a
   migration window (see *Versioning*).
4. **Documented and dated.** Every change lands in the spec, the
   [CHANGELOG](./CHANGELOG.md), and the public git history. The history is the
   record.

## Stewardship

citemap.json was created and first published in March 2026 by **Brian Pofahl**,
who currently serves as **specification editor** and final decision-maker on
changes. This is an explicit, temporary concentration of authority appropriate
to an early-stage standard; the intent is to broaden stewardship — additional
editors and, over time, a small steering group — as adoption and the contributor
base grow.

Reference implementations (such as [EntityGraph](https://entitygraph.ai),
maintained by the standard's author) help prove the spec in production and
surface real-world needs. They inform the standard but **do not govern it**: a
proposal is judged on its merits for the open ecosystem, not on any product's
interests.

## How changes are made

1. **Propose** — open a GitHub Issue or Discussion describing the motivation,
   the change, its backward-compatibility impact, and at least one concrete
   example. (See [CONTRIBUTING.md](./CONTRIBUTING.md) for the proposal shape.)
2. **Discuss** — proposals are worked in the open. Substantive changes stay open
   for community comment before acceptance.
3. **Draft** — an accepted change is written into a versioned spec addendum with
   a vocabulary-registry entry where applicable.
4. **Release** — the editor cuts a version, updates the CHANGELOG and JSON
   Schema, and publishes. Small additive changes ship as minor bumps; larger
   batches are consolidated into a planned release (the v3.3 model) to spare the
   ecosystem a churn of point releases.

Anyone may propose a change. The bar for acceptance is: it serves the open
standard, it is backward-compatible (or correctly sequenced behind a major
bump), and it is specified clearly enough to implement and validate.

## Versioning & stability policy

- **Scheme:** `MAJOR.MINOR` (e.g. `3.4`). MINOR = additive, backward-compatible.
  MAJOR = a breaking change, used sparingly.
- **Current stable:** **v3.4**. The latest released version is always linked
  from the [README](./README.md) and the top of the [CHANGELOG](./CHANGELOG.md).
- **Compatibility guarantee:** within a major line, no field is removed,
  renamed, or has its meaning changed. Vocabulary values may be **added**;
  retirements are announced, aliased through at least one minor version, and
  recorded in the registry before removal.
- **Deprecation:** anything slated for removal is marked deprecated in the spec
  and registry, kept working for a stated window, and only then dropped at a
  major bump with migration notes.
- **Schema of record:** each version ships a machine-readable JSON Schema; the
  validator and CLI are the conformance reference for "does this file conform?"

## Licensing

- **Specification** (prose + vocabulary registry under `spec/`) — **CC BY 4.0**.
- **Code** (validator, CLI, schema packages, build tooling) — **MIT**.

Contributions are accepted under these same licenses. See [LICENSE](./LICENSE).

## Decision authority (current)

While the standard is young, the specification editor is the final arbiter of
what ships, after open discussion. This will be revisited and broadened as the
community grows; changes to *this* governance document follow the same
propose → discuss → release process as the spec itself.
