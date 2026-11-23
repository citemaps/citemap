/**
 * citemap v3.5 rules (validator 0.5.0): spec/v3.5.md §13.
 *
 * - JSON Schema check (public/schema/v3.5, copied into src/schemas at build).
 *   Errors for v3.5 documents; for v3.3 / v3.4 documents the same findings
 *   are warnings ("would fail v3.5"), so existing files keep validating.
 * - Edge types: v3.3 + the 16 graduated in v3.5, short name or
 *   https://citemaps.org/ext/v1/types/{name} (the same type, §3.2).
 * - Reachability (§3.6): edges count in either direction, through other
 *   nodes, on the joined record.
 * - Level (§9): computed from the file alone, 0 when Level 1 isn't met.
 * - Warnings for deprecations (§12) and the §13 SHOULD list.
 */
import Ajv2020 from 'ajv/dist/2020.js'; // .js: ajv has no exports map, Node ESM needs the full path
import addFormats from 'ajv-formats';
import mainSchema from './schemas/citemap.schema.json';
import contentSchema from './schemas/content-file.schema.json';
import type { Issue } from './structural';

type Doc = Record<string, any>;
const isObj = (v: unknown): v is Doc => !!v && typeof v === 'object' && !Array.isArray(v);
const arr = (v: unknown): any[] => (Array.isArray(v) ? v : []);
const nonEmpty = (v: unknown) => typeof v === 'string' && v.trim().length > 0;

export const EXT_PREFIX = 'https://citemaps.org/ext/v1/types/';
export const EDGE_TYPES_V33 = [
  'parentOrganizationOf', 'subOrganizationOf', 'memberOf', 'worksFor', 'affiliatedWith', 'founderOf', 'sameAs',
  'franchiseOf', 'locationOf', 'practitionerAt', 'predecessorOf', 'successorOf', 'operatesAs', 'sellsAt',
] as const;
export const EDGE_TYPES_V35 = [
  'brand', 'manufacturer', 'makesOffer', 'creator', 'about', 'recordedIn', 'authored', 'featuredIn', 'mentionedIn',
  'publishedOn', 'channelOf', 'producedAt', 'featuring', 'client', 'agency', 'partner',
] as const;
const KNOWN_EDGES = new Set<string>([...EDGE_TYPES_V33, ...EDGE_TYPES_V35]);

/** Short name for a §3.1 type given in either form; other values unchanged. */
export function normalizeEdgeType(t: string): string {
  if (t.startsWith(EXT_PREFIX)) {
    const short = t.slice(EXT_PREFIX.length);
    if (KNOWN_EDGES.has(short)) return short;
  }
  return t;
}

/** Registry 2026-11 primaryVertical values (same set as 2026-06b). */
export const VERTICALS = new Set([
  'home-services', 'construction', 'automotive', 'pet-services', 'healthcare', 'dental', 'mental-health', 'senior-care',
  'beauty-wellness', 'restaurant', 'food-beverage', 'hospitality', 'recreation-tourism', 'legal-services', 'financial-services',
  'insurance', 'real-estate', 'property-services', 'professional-services', 'retail', 'ecommerce', 'saas', 'creative-agency',
  'events-venue', 'industrial', 'religious', 'it-services', 'veterinary', 'marketing-agency', 'logistics', 'agriculture',
  'wholesale-distribution', 'childcare-tutoring', 'education', 'publisher', 'science-research', 'nonprofit', 'funeral',
  'fitness', 'transportation', 'performing-arts', 'cannabis', 'government', 'beverage-producer', 'photography', 'pharmacy',
  // retired in v3.3, still valid
  'local-business', 'manufacturer', 'membership-org', 'industrial-services',
]);
const VERTICAL_ALIASES: Record<string, string> = { legal: 'legal-services', financial: 'financial-services', events: 'events-venue', research: 'science-research' };
const V30_MODULE_KEYS = new Set(['ecommerce', 'localBusiness', 'content', 'software', 'events', 'realEstate', 'education', 'creative',
  'nonprofit', 'government', 'science', 'businessIP', 'person', 'health', 'finance', 'legal', 'places', 'temporal', 'people']);
const ABBREVIATED_MODULE_KEYS: Record<string, string> = { local: 'localBusiness (or the entity\'s vertical)', realestate: 'real-estate', research: 'science-research' };
/** Root keys the spec defines (§1.1) plus v2.0/v3.0 legacy root keys. */
const ROOT_KEYS = new Set(['@context', '@type', 'version', 'citemapVersion', '$schema', 'generatedBy', 'citationContract', 'brand',
  'contentFiles', 'lastVerified', 'answerContent', 'trust', 'temporalRecord', 'policy', 'verification', '@graph', 'relationships',
  'verifiedClaims', 'citemapLevel', 'citemap', 'contact', 'citations', 'externalVerifiers', 'meta', 'modules', 'self']);

const V30_CLAIM_TYPES = new Set(['npi', 'ein', 'duns', 'bar-license', 'doi', 'fdic', 'nmls', 'sec-crd', 'dea', 'state-license',
  'abms-certification', 'accreditation', 'patent', 'trademark', 'other']);
const LEGACY_CLAIM_TYPE: Record<string, string> = { 'bar-number': 'bar-license' };

const OPENING_HOURS_RE = /^(Mo|Tu|We|Th|Fr|Sa|Su)(-(Mo|Tu|We|Th|Fr|Sa|Su)|(,(Mo|Tu|We|Th|Fr|Sa|Su))*)\s+\d{2}:\d{2}-\d{2}:\d{2}$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}/;
const MEDIA_FILE_RE = /\.(mp4|m4v|mov|webm|m3u8|mpd|mp3|m4a|ogg|wav)(\?|$)/i;

// ── JSON Schema ────────────────────────────────────────────
let compiled: { main: any; content: any } | null = null;
function schemas() {
  if (compiled) return compiled;
  const ajv = new Ajv2020({ strict: false, allErrors: true });
  addFormats(ajv);
  ajv.addSchema(mainSchema as any);
  ajv.addSchema(contentSchema as any);
  compiled = { main: ajv.getSchema((mainSchema as any).$id), content: ajv.getSchema((contentSchema as any).$id) };
  return compiled;
}

/** Ajv findings against the v3.5 schema. Older v3.3+ docs are checked as if they said 3.5. */
export function schemaIssues(data: unknown, kind: 'main' | 'content'): Issue[] {
  if (!isObj(data)) return [];
  const doc = kind === 'main' ? { ...data, version: '3.5', citemapVersion: data.citemapVersion === undefined ? undefined : '3.5', '@context': 'https://citemaps.org/v3.5' } : data;
  if (doc.citemapVersion === undefined) delete doc.citemapVersion;
  const fn = schemas()[kind];
  if (fn(doc)) return [];
  const seen = new Set<string>();
  const out: Issue[] = [];
  for (const e of fn.errors ?? []) {
    if (e.keyword === 'anyOf' || e.keyword === 'if') continue; // the specific branch errors say more
    const path = e.instancePath || '/';
    const msg = e.keyword === 'enum' ? `must be one of: ${(e.params?.allowedValues ?? []).join(', ')}` : e.message ?? 'invalid';
    const key = `${path}|${msg}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ path, message: msg, keyword: e.keyword });
  }
  return out;
}

// ── Level (§9) ─────────────────────────────────────────────
export type Level = 0 | 1 | 2 | 3;
export function computeLevel(data: unknown): { level: Level; missing: string[] } {
  const d = isObj(data) ? data : {};
  const b = isObj(d.brand) ? d.brand : {};
  const cc = isObj(d.citationContract) ? d.citationContract : {};
  const l1: string[] = [];
  if (!nonEmpty(b.name)) l1.push('brand.name');
  if (!nonEmpty(b.url)) l1.push('brand.url');
  if (!nonEmpty(b.aiSummary) && !nonEmpty(cc.shortDescription)) l1.push('a description (brand.aiSummary or citationContract.shortDescription)');
  if (!nonEmpty(b.email) && !arr(b.locations).some(l => nonEmpty(l?.phone)) && !nonEmpty(cc.contactForCorrections))
    l1.push('a contact point (brand.email, a location phone, or citationContract.contactForCorrections)');
  if (!nonEmpty(d.lastVerified)) l1.push('lastVerified');
  if (l1.length) return { level: 0, missing: l1 };
  const l2: string[] = [];
  if (!arr(d.answerContent).length) l2.push('at least one answerContent entry (approved Q&A)');
  if (!nonEmpty(cc.preferredName) && !nonEmpty(cc.shortDescription)) l2.push('citationContract.preferredName or citationContract.shortDescription');
  if (l2.length) return { level: 1, missing: l2 };
  const hasClaim = arr(d.verifiedClaims).some(c => isObj(c) && nonEmpty(c.type ?? c.claimType) && nonEmpty(c.identifier));
  if (!hasClaim) return { level: 2, missing: ['at least one verifiedClaims entry with type and identifier (a license, NPI, EIN or registry number)'] };
  return { level: 3, missing: [] };
}

// ── Reachability (§3.6) ────────────────────────────────────
/** @graph nodes with no path to the primary entity (edges either direction). */
export function findOrphans(doc: Doc): string[] {
  const root = isObj(doc.brand) && typeof doc.brand['@id'] === 'string' ? doc.brand['@id'] : null;
  const nodes = arr(doc['@graph']).filter(n => isObj(n) && typeof n['@id'] === 'string');
  if (!root || !nodes.length) return [];
  const adj = new Map<string, string[]>();
  const link = (a: string, b: string) => { if (!adj.has(a)) adj.set(a, []); adj.get(a)!.push(b); };
  for (const r of arr(doc.relationships)) {
    if (!isObj(r) || typeof r.from !== 'string' || typeof r.to !== 'string') continue;
    link(r.from, r.to); link(r.to, r.from);
  }
  const seen = new Set([root]);
  const stack = [root];
  while (stack.length) for (const n of adj.get(stack.pop()!) ?? []) if (!seen.has(n)) { seen.add(n); stack.push(n); }
  return nodes.map(n => n['@id']).filter(id => !seen.has(id));
}

// ── §13 rules ──────────────────────────────────────────────
export interface V35Options {
  /** v3.5 document: schema findings are errors (else warnings). */
  strict: boolean;
  /** The record is complete (no content files, or already joined): run reachability. */
  complete: boolean;
}

export function checkV35(data: unknown, opts: V35Options): { errors: Issue[]; warnings: Issue[] } {
  const errors: Issue[] = [];
  const warnings: Issue[] = [];
  if (!isObj(data)) return { errors, warnings };
  const d = data;
  const b = isObj(d.brand) ? d.brand : {};
  const warn = (path: string, message: string, suggestion?: string) => warnings.push({ path, message, ...(suggestion ? { suggestion } : {}) });

  // Schema (§13 MUST list + typed fields).
  for (const i of schemaIssues(d, 'main')) {
    if (opts.strict) errors.push(i);
    else warnings.push({ ...i, message: `${i.message} (would fail v3.5)` });
  }

  // Edge types (§13.1) + rows (§13.15).
  const seenRow = new Set<string>();
  let unknownBare = 0, unknownUrl = 0, dupes = 0;
  arr(d.relationships).forEach((r: any, i: number) => {
    if (!isObj(r) || typeof r.type !== 'string') return;
    const t = normalizeEdgeType(r.type);
    if (!KNOWN_EDGES.has(t)) { if (/^https?:\/\//.test(t)) unknownUrl++; else unknownBare++; }
    const key = `${r.from}|${t}|${r.to}`;
    if (seenRow.has(key)) dupes++; else seenRow.add(key);
    if (r.observedAt !== undefined && !(typeof r.observedAt === 'string' && DATE_RE.test(r.observedAt)))
      warn(`/relationships/${i}/observedAt`, 'observedAt should be a date (YYYY-MM-DD)');
  });
  if (unknownBare) warn('/relationships', `${unknownBare} relationship(s) use an edge type that isn't in the registry and isn't an absolute URL`, 'Use a registry type (spec §2, §3.1) or an absolute URL for a custom type (v3.3 §2.3)');
  if (unknownUrl) warn('/relationships', `${unknownUrl} relationship(s) use a custom edge type URL`, 'Custom types are valid; the URL should document the type');
  if (dupes) warn('/relationships', `${dupes} duplicate relationship row(s) (same from, type and to)`);

  // Reachability (§13.2).
  if (opts.complete) {
    const orphans = findOrphans(d);
    if (orphans.length) errors.push({ path: '/@graph', message: `${orphans.length} @graph node(s) have no path to the primary entity: ${orphans.slice(0, 5).join(', ')}${orphans.length > 5 ? '…' : ''}`, keyword: 'reachability' });
  }

  // verifiedClaims (§13.5).
  arr(d.verifiedClaims).forEach((c: any, i: number) => {
    const p = `/verifiedClaims/${i}`;
    if (!isObj(c)) return;
    const legacy = c.type === undefined && c.claimType !== undefined;
    const type = String(c.type ?? c.claimType ?? '').toLowerCase();
    if (!type || !nonEmpty(c.identifier)) {
      errors.push({ path: p, message: 'verifiedClaims entries need type and identifier', keyword: 'required' });
      return;
    }
    if (legacy) warn(p, 'legacy verifiedClaims row (claimType / issuer / verifiedDate)', 'Use { type, identifier, entity?, registryUrl? } (v3.0 §5)');
    const mapped = LEGACY_CLAIM_TYPE[type] ?? type;
    if (!V30_CLAIM_TYPES.has(mapped)) warn(`${p}/type`, `unknown claim type "${c.type ?? c.claimType}"`, `Use one of: ${[...V30_CLAIM_TYPES].join(', ')}`);
  });

  // Taxonomy aliases (§12).
  const tax = isObj(b.taxonomy) ? b.taxonomy : {};
  for (const v of [tax.primaryVertical, ...arr(tax.additionalVerticals)]) {
    if (typeof v === 'string' && VERTICAL_ALIASES[v]) warn('/brand/taxonomy', `vertical "${v}" is a deprecated alias`, `Use "${VERTICAL_ALIASES[v]}"`);
  }

  // Root keys: vertical modules (§2.8, §13.14).
  for (const k of Object.keys(d)) {
    if (ROOT_KEYS.has(k)) continue;
    if (ABBREVIATED_MODULE_KEYS[k]) warn(`/${k}`, `module key "${k}" is an abbreviation`, `Name it ${ABBREVIATED_MODULE_KEYS[k]}`);
    else if (!VERTICALS.has(k) && !V30_MODULE_KEYS.has(k)) warn(`/${k}`, `unknown top-level key "${k}"`, 'Vertical module keys are a registry vertical or a v3.0 module key');
  }

  // Trust tiers (§2.2, §12).
  const perField = isObj(d.trust) && isObj(d.trust.perField) ? d.trust.perField : {};
  if (Object.values(perField).some(v => isObj(v))) warn('/trust/perField', 'trust.perField uses the v3.3 object sketch', 'Use tier strings T1–T6 (v3.5 §2.2)');
  if (arr(d.answerContent).length && ['T5', 'T6'].includes(perField.answerContent))
    warn('/answerContent', 'answerContent is marked machine-drafted or unreviewed (T5/T6)', 'Approve answers before publishing them (v3.5 §2.5)');

  // Policy alias (§12).
  if (isObj(d.policy) && isObj(d.policy.correction) && d.policy.correction.policy !== undefined && d.policy.correction.summary === undefined)
    warn('/policy/correction/policy', 'policy.correction.policy is deprecated', 'Use policy.correction.summary');

  // Catalog (§5).
  const lifecycleCheck = (rows: any[], key: string) => rows.forEach((x, i) => {
    if (isObj(x?.lifecycle) && x.lifecycle.status === 'discontinued' && !x.lifecycle.endDate)
      warn(`/brand/${key}/${i}/lifecycle`, 'discontinued without endDate', 'Say when it ended (v3.5 §5.4)');
  });
  lifecycleCheck(arr(b.products), 'products');
  lifecycleCheck(arr(b.services), 'services');
  const brandNames = new Set(arr(b.subBrands).map(s => s?.name).filter(Boolean));
  arr(b.locations).forEach((l: any, i: number) => {
    for (const h of arr(l?.openingHours)) if (typeof h === 'string' && !OPENING_HOURS_RE.test(h.trim()))
      warn(`/brand/locations/${i}/openingHours`, `"${h}" isn't in schema.org form (Mo-Fr 09:00-17:00)`);
    for (const n of arr(l?.brands)) if (!brandNames.has(n))
      warn(`/brand/locations/${i}/brands`, `"${n}" doesn't match a brand.subBrands[].name`);
  });

  // Media (§6, §12).
  arr(b.video).forEach((v: any, i: number) => {
    if (isObj(v) && !v.url && typeof v.contentUrl === 'string' && !MEDIA_FILE_RE.test(v.contentUrl))
      warn(`/brand/video/${i}/contentUrl`, 'contentUrl holds a page, not a media file', 'Put the watch page in url (v3.5 §6.3)');
  });
  const deprecatedTypes = new Set(['podcast', 'video', 'testimonial', 'award']);
  const dep = arr(b.publications).filter(p => deprecatedTypes.has(p?.contentType)).length;
  if (dep) warn('/brand/publications', `${dep} publication(s) use a deprecated contentType (podcast, video, testimonial, award)`, 'Use brand.podcasts / brand.video, corroboratedBy, or verification claims with kind "award"');

  // Business relationships (§13.16).
  arr(b.businessRelationships).forEach((r: any, i: number) => {
    arr(r?.results).forEach((x: any, j: number) => { if (!nonEmpty(x?.source)) warn(`/brand/businessRelationships/${i}/results/${j}`, 'result without a source page'); });
  });

  // Level claim (§13.7).
  const { level, missing } = computeLevel(d);
  if (d.citemapLevel != null && d.citemapLevel !== level) {
    if (d.citemapLevel > level) warn('/citemapLevel', `claims Level ${d.citemapLevel} but the content is Level ${level}`, `Missing for Level ${level + 1}: ${missing.join('; ')}`);
    else warn('/citemapLevel', `claims Level ${d.citemapLevel}; the content is Level ${level}`, `Set citemapLevel to ${level}`);
  }

  return { errors, warnings };
}

/** v3.5 checks on a content file (schema + version key). */
export function checkContentFileV35(data: unknown, strict: boolean): { errors: Issue[]; warnings: Issue[] } {
  const errors: Issue[] = [];
  const warnings: Issue[] = [];
  for (const i of schemaIssues(data, 'content')) {
    if (strict) errors.push(i);
    else warnings.push({ ...i, message: `${i.message} (would fail v3.5)` });
  }
  if (strict && isObj(data) && data.version === undefined && data.citemapVersion !== undefined)
    warnings.push({ path: '/version', message: 'content file has citemapVersion but no version', suggestion: 'Add version (v3.5 §8.5)' });
  return { errors, warnings };
}
