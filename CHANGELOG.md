# Changelog

All notable changes to the **citemap.json** specification.

citemap.json was **first published in March 2026**. Every release in the v2/v3
line is backward-compatible: a file valid under an earlier version validates
against every later version, at most with a `version` field bump. Dates below
are the public release dates; the repository's git history is the authoritative
record.

The format is loosely based on [Keep a Changelog](https://keepachangelog.com/).

---

## v3.5 — 2026-11-23

**Catch-up release (additive).** Writes down everything citemaps have published since
v3.4. 16 edge types graduate from the `ext/v1` namespace (`brand`, `manufacturer`,
`makesOffer`, `creator`, `about`, `recordedIn`, `authored`, `featuredIn`, `mentionedIn`,
`publishedOn`, `channelOf`, `producedAt`, `featuring`, `client`, `agency`, `partner`;
the extension URL stays a valid alias). Brand, Product, ProductGroup, MediaChannel and
media graph nodes with a recommended `@id` scheme; reachability counted in either
direction. New brand fields, catalog `lifecycle` (dated discontinuation) and product
variants, location coordinates / time zone / `openingHours` / brands made there. Media
arrays (channels, video, podcasts, speaking, social posts) with shared fields and
connections. Evidence: `corroboratedBy[]`, `subjectOf` on the brand and on nodes,
memberships with context, `businessRelationships[]`. Content files for large records.
First full definitions of `citationContract`, the `citemap` block, `trust.perField`
tiers (T1–T6) and `temporalRecord` rows. A citemap level computable from the file
alone. Registry conventions for DNS verification and publisher-submitted copies.
Real JSON Schema at `schema/v3.5`; registry vocabulary `2026-11`; validator / CLI 0.5.
Deprecations warn, never fail.

## v3.4 — 2026-06-02

**Vocabulary expansion (additive).** 14 new canonical `primaryVertical` values
across 9 previously underserved business categories. No schema-shape changes, no
field additions, no semantic renames — a strictly additive minor bump on v3.3.

## v3.3 — 2026-05-31

**Consolidation release.** A deliberate batch of structural additions cut as one
planned version rather than several accidental point releases: the `@graph`
extension (Schema.org-aligned entity graph), foundational sections, 14
ride-along field additions, and four taxonomy retirements. Backward-compatible.

## v3.2.1 — 2026-05-24

**Registry token.** Sub-release adding the registry claim/verify token
convention. See [`spec/v3.2.1-registry-token.md`](./spec/v3.2.1-registry-token.md).

## v3.2 — May 2026

**Structured business taxonomy.** One backward-compatible addition carrying a
structured taxonomy object alongside `siteType`.

## v3.1 — April 2026

**Schema.org bridge.** Two backward-compatible additions connecting citemap.json
to the Schema.org content graph (`@graph` / `schemaId` cross-references).

## v3.0 — 2026-03-15

**Five backward-compatible additions** on the v2.0 foundation:

- **Citation Contract** (`citationContract`) — how AI should introduce your brand.
- **Formal Levels** (`citemapLevel`) — 1 core, 2 modules + Q&A + contract, 3 full verification.
- **Entity IDs** — stable `type:slug` identifiers on nested objects.
- **Module Meta** — `lastUpdated` / `updateFrequency` per module.
- **Verified Claims** (`verifiedClaims[]`) — externally checkable identifiers (NPI, EIN, DUNS, bar licenses, DOIs).

Every valid v2.0 file also validates against v3.0.

## v2.0 — 2026-03-11

**First public release** of the citemap.json open standard:

- The `brand` object and root structure.
- Industry modules (Universal Core, Ecommerce, Local Business, Content & Publishing, SaaS & Software, Events & Venues, and more).
- The trust architecture (self-reported → cryptographically signed).
- Machine-readable [JSON Schema](./public/schema/), plus the open-source validator and CLI.

> Earlier internal drafts (the v1 line) predate this release; **v2.0 is the
> first public, versioned, dated release** of the standard.

---

*Future direction is tracked in the [roadmap](./README.md#roadmap) and discussed
in the open — see [CONTRIBUTING.md](./CONTRIBUTING.md).*
