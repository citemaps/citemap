"""Generates public/schema/v3.5/citemap.schema.json and content-file.schema.json.
Source of truth for the v3.5 JSON Schema (spec/v3.5.md). Typed known fields,
open to unknown ones (additionalProperties true everywhere). Run:
  python3 scripts/build-schema-v3.5.py
"""
import json, os
S = "https://json-schema.org/draft/2020-12/schema"
BASE = "https://citemaps.org/schema/v3.5/"
def obj(props=None, req=None, **kw):
    o = {"type": "object", "properties": props or {}, "additionalProperties": True}
    if req: o["required"] = req
    o.update(kw); return o
def arr(items, **kw): return {"type": "array", "items": items, **kw}
def ref(n): return {"$ref": f"#/$defs/{n}"}
def enum(*v, **kw): return {"enum": list(v), **kw}
s = {"type": "string"}; num = {"type": "number"}; integer = {"type": "integer"}; boolean = {"type": "boolean"}
url = ref("url"); date = ref("date"); dt = {"type": "string", "format": "date-time"}
strs = arr(s)

defs = {
  "url": {"type": "string", "pattern": "^https?://\\S+$", "description": "Absolute http(s) URL."},
  "date": {"type": "string", "pattern": "^\\d{4}(-\\d{2}(-\\d{2})?)?", "description": "YYYY, YYYY-MM or YYYY-MM-DD (a time may follow)."},
  "idRef": obj({"@id": s}, ["@id"]),
  "subjectOfEntry": obj({"@type": s, "url": url, "name": s, "datePublished": date,
      "publisher": obj({"@type": s, "name": s}), "mentions": arr(obj({"@type": s, "@id": s, "name": s}))}, ["url"],
      description="v3.5 §7.2: a third-party page about the subject (schema.org CreativeWork form)."),
  "lifecycle": obj({"status": enum("discontinued"), "endDate": date}, ["status"], description="v3.5 §5.4"),
  "priceRange": obj({"min": num, "max": num, "currency": s}),
  "connection": obj({"edge": enum("about", "creator", "featuring", "publishedOn", "recordedIn"),
      "targetType": s, "targetId": s, "targetName": s}, ["edge", "targetType"], description="v3.5 §6.1"),
  "mediaRole": enum("authored", "featured", "mentioned"),

  # 1.x
  "citationContract": obj({"lastUpdated": date, "updateFrequency": enum("daily", "weekly", "monthly", "quarterly", "annually", "rarely"),
      "canonicalSource": url, "contactForCorrections": s, "registryToken": s, "disambiguation": s,
      "preferredName": s, "shortDescription": s}, description="v3.5 §1.2"),
  "citemapBlock": obj({"authorizedBy": s, "contactForDisputes": s, "generationId": s, "generatedAt": dt}, description="v3.5 §1.3"),

  # 2.x foundational
  "trust": obj({"computedAt": dt, "perField": {"type": "object", "additionalProperties": {
      "anyOf": [enum("T1", "T2", "T3", "T4", "T5", "T6"), {"type": "object", "description": "v3.3 sketch form (deprecated)"}]}}},
      description="v3.5 §2.2"),
  "temporalEvent": obj({"type": s, "date": date, "label": s, "description": s, "sources": arr(s), "relatedTeamMemberId": s},
      ["type", "date", "label"], description="v3.5 §2.3"),
  "policyEntry": obj({"url": url, "summary": s, "policy": s}),
  "policy": obj({"editorial": ref("policyEntry"), "correction": ref("policyEntry"), "disclosure": ref("policyEntry"),
      "privacy": ref("policyEntry"), "lastUpdated": date}, description="v3.3 §3.2, v3.5 §2.4"),
  "answer": obj({"question": s, "answer": s}, ["question", "answer"]),
  "claim": obj({"id": s, "claim": s, "issuer": s, "issuedDate": date, "expiresAt": date, "verifierUrl": url, "evidence": s,
      "kind": enum("certification", "license", "accreditation", "membership", "award", "other")}, ["id", "claim", "issuer"]),
  "verification": obj({"claims": arr(ref("claim")), "lastUpdated": date}, ["claims"], description="v3.3 §3.2, v3.5 §2.6"),
  "verifiedClaim": obj({"type": s, "identifier": s, "entity": s, "registryUrl": url, "claimType": s},
      description="v3.0 §5 / v3.5 §2.7. type + identifier required (checked by the validator so legacy claimType rows only warn)."),

  # 3.x graph
  "node": obj({"@id": s, "@type": {"anyOf": [s, strs]}}, ["@id"]),
  "relationship": obj({"from": s, "to": s, "type": s, "observedAt": date, "context": s, "source": s, "verified": boolean,
      "confidence": enum("high", "medium", "low")}, ["from", "to", "type"]),

  # 4.x brand pieces
  "taxonomy": obj({"taxonomyVersion": s, "primaryVertical": s, "additionalVerticals": strs, "subtypes": strs,
      "entityType": s, "organizationType": s, "modifiers": strs}),
  "distinctFrom": obj({"name": s, "url": url, "reason": enum("same-name-different-location", "similar-name", "former-affiliate", "imposter", "unrelated"),
      "note": s}, ["name"], description="v3.5 §4.3"),
  "teamMember": obj({"id": s, "name": s, "jobTitle": s, "bio": s, "photoUrl": s, "sameAs": strs, "honorificPrefix": s,
      "honorificSuffix": s, "formerlySince": {"type": ["string", "null"]}, "formerlyReason": {"type": ["string", "null"]}},
      ["name"], description="v3.3 §4.5"),

  # 5.x catalog
  "variant": obj({"attributes": {"type": "object"}, "sku": s, "gtin": s, "availability": s, "imageUrl": s, "priceRange": ref("priceRange")},
      ["attributes"]),
  "product": obj({"id": s, "name": s, "brand": s, "sku": s, "gtin": s, "productType": s, "description": s, "imageUrl": s,
      "pageUrl": s, "availability": s, "specifications": {"type": ["string", "object"]}, "priceRange": ref("priceRange"),
      "categoryIds": strs, "attributes": {"type": "object"}, "variesBy": strs, "variants": arr(ref("variant")),
      "lifecycle": ref("lifecycle")}, ["name"], description="v3.3 §4.7, v3.5 §5.1"),
  "service": obj({"id": s, "name": s, "serviceType": s, "description": s, "pageUrl": s, "categoryIds": strs,
      "lifecycle": ref("lifecycle"), "subjectOf": arr(ref("subjectOfEntry"))}, ["name"]),
  "category": obj({"id": s, "name": s, "slug": s, "pageUrl": s, "description": s, "parentId": s, "subjectOf": arr(ref("subjectOfEntry"))},
      ["id", "name"]),
  "location": obj({"id": s, "type": s, "name": s, "address": s, "city": s, "region": s, "postalCode": s,
      "country": s, "phone": s, "email": s, "hours": s, "url": s, "googlePlaceId": s, "isPrimary": boolean,
      "latitude": {"type": "number", "minimum": -90, "maximum": 90}, "longitude": {"type": "number", "minimum": -180, "maximum": 180},
      "timeZone": s, "openingHours": strs, "brands": strs}, ["id"], description="v3.3 §4.8, v3.5 §5.5"),
  "subBrand": obj({"id": s, "name": s, "logo": s, "url": s, "description": s, "sameAs": strs, "isPrimary": boolean}, ["name"]),
  "storefront": obj({"platform": s, "url": s, "id": s, "customPlatform": s, "displayName": s}, ["platform", "url"]),

  # 6.x media
  "channel": obj({"id": s, "name": s, "url": url, "platform": enum("youtube", "vimeo", "tiktok", "instagram", "linkedin", "podcast", "self-hosted", "custom"),
      "customPlatform": s, "handle": s, "description": s, "subscriberCount": num, "image": url,
      "links": arr(obj({"platform": s, "url": url}, ["url"])), "authorTeamMemberId": s, "authorName": s},
      ["id", "name", "url", "platform"], description="v3.5 §6.2"),
  "video": obj({"id": s, "name": s, "role": ref("mediaRole"), "url": url, "contentUrl": s, "embedUrl": s, "thumbnailUrl": s,
      "uploadDate": date, "duration": s, "channelId": s, "publisherName": s, "publisherUrl": s,
      "appearedBy": arr(obj({"teamMemberId": s, "name": s})), "keywords": strs, "category": s, "isLive": boolean,
      "platform": s, "image": s, "transcriptUrl": s, "description": s, "connections": arr(ref("connection"))},
      ["id", "name", "role"], description="v3.5 §6.3"),
  "podcast": obj({"id": s, "role": ref("mediaRole"), "title": s, "url": url, "showName": s, "showUrl": s, "publisher": s,
      "episodeNumber": {"type": ["string", "integer"]}, "seasonNumber": {"type": ["string", "integer"]}, "publishedAt": date,
      "duration": s, "embedUrl": s, "videoUrl": s, "platform": s, "image": s, "transcriptUrl": s, "description": s,
      "connections": arr(ref("connection"))}, ["title", "url"], description="v3.5 §6.4"),
  "publication": obj({"id": s, "title": s, "url": url, "contentType": s, "publisher": s, "publishedAt": date,
      "description": s, "role": s, "authorTeamMemberId": s, "authorName": s, "platform": s, "image": s,
      "transcriptUrl": s, "connections": arr(ref("connection"))}, ["title"], description="v3.3 §4.13, v3.5 §6.5"),
  "speaking": obj({"id": s, "role": ref("mediaRole"), "title": s, "eventName": s, "startDate": date, "endDate": date,
      "url": url, "organizer": s, "organizerUrl": s, "location": s, "isVirtual": boolean, "sessionType": s, "status": s,
      "description": s, "image": s, "platform": s, "transcriptUrl": s, "connections": arr(ref("connection"))},
      ["title", "eventName", "startDate"], description="v3.5 §6.6"),

  # 7.x evidence
  "corroboration": obj({"url": url, "sourceType": enum("directory", "review", "press", "blog", "social", "forum", "listicle", "media", "event", "partner", "association", "wiki", "other"),
      "independence": enum("independent", "affiliated", "paid"), "stance": enum("positive", "neutral", "critical"),
      "discovery": enum("observed", "entity-supplied"), "title": s, "publisher": s, "excerpt": s,
      "publishedAt": date, "lastVerifiedAt": date, "mentions": arr(obj({"name": s, "teamMemberId": s}, ["name"]), maxItems=12)},
      ["url", "sourceType", "independence", "discovery"], description="v3.5 §7.1"),
  "businessRelationship": obj({"id": s, "name": s, "url": url, "relationship": enum("client", "agency", "partner"),
      "status": enum("current", "former"), "since": s, "until": s, "kind": s, "sameAs": strs, "services": strs,
      "caseStudyUrl": url, "results": arr(obj({"text": s, "source": s, "assertedBy": enum("self")}, ["text"])),
      "proof": obj({"count": integer, "pages": integer, "outlets": strs, "first": date, "last": date, "source": s}),
      "confirmation": obj({"status": enum("confirmed"), "citemapUrl": url, "checkedAt": date}, ["status"])},
      ["id", "name", "url", "relationship", "status"], description="v3.5 §7.4"),

  # 8.x
  "contentFileRef": obj({"type": enum("publication", "social-post", "video", "podcast", "speaking", "product"), "url": {"type": "string", "pattern": "^https://\\S+$"},
      "count": {"type": "integer", "minimum": 0}, "year": {"type": "string", "pattern": "^(\\d{4}|undated)$"},
      "category": s, "part": {"type": "integer", "minimum": 1}, "lastUpdated": date}, ["type", "url", "count"], description="v3.5 §8.3"),
}

brand = obj({
  "@type": {"anyOf": [s, strs]}, "@id": s, "name": {"type": "string", "minLength": 1}, "url": url,
  "siteType": s, "legalName": s, "alternateName": s, "shortName": s, "email": s, "aiSummary": s,
  "notableFor": {"anyOf": [s, strs]}, "expertise": strs, "audiencePrimary": s, "logo": s,
  "founded": {"type": ["string", "integer"]}, "areaServed": strs,
  "numberOfEmployees": enum("1-10", "11-50", "51-200", "201-500", "501-1000", "1001-5000", "5000+"),
  "mission": s, "diversityOwnership": strs, "memberships": strs, "accessibility": strs, "languagesSupported": strs, "guarantees": strs,
  "taxonomy": ref("taxonomy"), "sameAs": strs, "team": arr(ref("teamMember")), "teamPageUrl": s,
  "products": arr(ref("product")), "disambiguatingDescription": s, "distinctFrom": arr(ref("distinctFrom")),
  "productCategories": arr(ref("category")), "serviceCategories": arr(ref("category")), "services": arr(ref("service")),
  "storefronts": arr(ref("storefront")), "locations": arr(ref("location")), "subBrands": arr(ref("subBrand")),
  "publications": arr(ref("publication")), "corroboratedBy": arr(ref("corroboration")),
  "subjectOf": arr(ref("subjectOfEntry"), maxItems=10), "channels": arr(ref("channel")), "video": arr(ref("video")),
  "podcasts": arr(ref("podcast")), "speaking": arr(ref("speaking")), "businessRelationships": arr(ref("businessRelationship")),
  "location": obj({"city": s, "state": s, "country": s}), "publishingPrinciples": s, "correctionsPolicy": s,
  "employee": arr(ref("idRef")), "memberOf": arr({"type": "object"}),
}, ["name", "url", "sameAs", "team"], description="The entity. v3.0, v3.3 §4, v3.5 §4–§7.")

main = {
  "$schema": S, "$id": BASE + "citemap.schema.json",
  "title": "citemap.json v3.5",
  "description": "JSON Schema for citemap.json v3.5 (https://citemaps.org/spec/). Types the fields the spec defines and stays open to others (additionalProperties true). Rules the schema can't express (reachability, @id uniqueness across content files, products in content files, the citemap level) are checked by @citemap/validator per spec §13.",
  "type": "object", "additionalProperties": True,
  "required": ["@type", "version", "citationContract", "brand", "lastVerified", "answerContent", "temporalRecord", "policy", "verification"],
  "properties": {
    "@context": {"type": "string", "const": "https://citemaps.org/v3.5"},
    "@type": {"const": "Citemap"},
    "version": {"type": "string", "const": "3.5"},
    "citemapVersion": {"type": "string", "const": "3.5"},
    "$schema": s, "generatedBy": s,
    "citationContract": ref("citationContract"), "brand": brand,
    "contentFiles": arr(ref("contentFileRef")), "lastVerified": date,
    "answerContent": arr(ref("answer")), "trust": ref("trust"), "temporalRecord": arr(ref("temporalEvent")),
    "policy": ref("policy"), "verification": ref("verification"),
    "@graph": arr(ref("node")), "relationships": arr(ref("relationship")),
    "verifiedClaims": arr(ref("verifiedClaim")),
    "citemapLevel": {"type": "integer", "enum": [1, 2, 3]}, "citemap": ref("citemapBlock"),
  },
  "$defs": defs,
}

content = {
  "$schema": S, "$id": BASE + "content-file.schema.json",
  "title": "citemap.json v3.5 content file",
  "description": "A content file listed in a main citemap's contentFiles[] (spec v3.5 §8.5).",
  "type": "object", "additionalProperties": True,
  "required": ["@type", "contentType", "isPartOf", "about", "count", "brand"],
  "anyOf": [{"required": ["version"]}, {"required": ["citemapVersion"]}],
  "properties": {
    "@context": s, "@type": {"const": "CitemapContentFile"}, "version": s, "citemapVersion": s,
    "contentType": {"$ref": "citemap.schema.json#/$defs/contentFileRef/properties/type"},
    "year": {"type": "string", "pattern": "^(\\d{4}|undated)$"}, "category": s, "part": {"type": "integer", "minimum": 1},
    "isPartOf": {"$ref": "citemap.schema.json#/$defs/url"}, "about": s,
    "count": {"type": "integer", "minimum": 0}, "lastUpdated": {"$ref": "citemap.schema.json#/$defs/date"},
    "brand": {"type": "object", "required": ["@id"], "additionalProperties": True, "properties": {
        "@id": s, "name": s,
        "publications": arr({"$ref": "citemap.schema.json#/$defs/publication"}),
        "video": arr({"$ref": "citemap.schema.json#/$defs/video"}),
        "podcasts": arr({"$ref": "citemap.schema.json#/$defs/podcast"}),
        "speaking": arr({"$ref": "citemap.schema.json#/$defs/speaking"}),
        "products": arr({"$ref": "citemap.schema.json#/$defs/product"})}},
    "@graph": arr({"$ref": "citemap.schema.json#/$defs/node"}),
    "relationships": arr({"$ref": "citemap.schema.json#/$defs/relationship"}),
  },
}

root = os.path.join(os.path.dirname(__file__), "..")
out = os.path.join(root, "public/schema/v3.5")
os.makedirs(out, exist_ok=True)
for name, doc in (("citemap.schema.json", main), ("content-file.schema.json", content)):
    with open(os.path.join(out, name), "w") as f: json.dump(doc, f, indent=2); f.write("\n")
    print("wrote", name)
