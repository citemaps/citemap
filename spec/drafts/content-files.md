# Content files (draft for v3.5)

Status: **superseded** by [v3.5 §8](../v3.5.md#8-content-files), which adds `version` in content files, numbered `part`s, the reading rules and the always-on rule for split products. Kept for history.

## Why

AI answer engines read `citemap.json` through fetch tools that often stop at roughly 100 KB. A business with a long Media history or a large catalog can pass that easily (one real record: 462 KB), and everything past the cut is invisible. Content files keep the main file small: identity, the citation contract, trust and verification stay in `citemap.json`; Media and products move to separate files the main file lists. It is the sitemap-index pattern applied to a citemap.

## Main file

`contentFiles` (array), placed right after `brand` so a reader that stops early still sees the index:

| Field | Required | |
|---|---|---|
| `type` | yes | `publication`, `social-post`, `video`, `podcast`, `speaking`, `product` |
| `url` | yes | absolute https URL of the content file (may be on another host) |
| `count` | yes | items in the file |
| `year` | no | when a type is split by year (`YYYY` or `undated`) |
| `category` | no | when products are split by category |
| `lastUpdated` | no | `YYYY-MM-DD` |

Items moved to a content file SHOULD NOT also appear inline in the main file. Product categories stay in the main file.

## Content file

```json
{
  "@context": "https://citemaps.org/v3.4",
  "@type": "CitemapContentFile",
  "citemapVersion": "3.4",
  "contentType": "podcast",
  "year": "2023",
  "isPartOf": "https://example.com/citemap.json",
  "about": "https://example.com/#org",
  "count": 3,
  "lastUpdated": "2026-11-23",
  "brand": { "@id": "https://example.com/#org", "name": "Example", "podcasts": [ … ] },
  "@graph": [ … ],
  "relationships": [ … ]
}
```

`brand.<key>` per type: `publication` and `social-post` → `publications`, `video` → `video`, `podcast` → `podcasts`, `speaking` → `speaking`, `product` → `products`. `@id`s are the same scheme as the main file, so a reader that fetches both gets one joined graph.

## Reading

Concatenate each file's `brand.<key>` array, `@graph` and `relationships` into the main file (skipping ids already present). The result is the one-file record. A reader that can't fetch a content file still has a valid main file.

## Splitting

A type's file MAY split further when it is large: by year for Media (newest first, `undated` last), by category for products (`uncategorized` last). Nothing is dropped for age; every item has a home in its type's files.
