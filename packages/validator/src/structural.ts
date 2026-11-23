/**
 * Structural checks for citemap v3.3+ and content files (validator 0.4.0).
 *
 * The published v3.3 / v3.4 JSON Schemas are placeholders that defer to the
 * spec text, and the strict v3.0 schema rejects every v3.3+ addition
 * (@context, @graph, relationships, policy, trust, contentFiles…) as an
 * "additional property". So for v3.3+ the validator checks the structural
 * rules the spec states in code: identity, the graph, relationship
 * endpoints, and content files.
 *
 * Content files (contentFiles[] in the main file; each file
 * "@type": "CitemapContentFile"): Media and products may live in separate
 * files listed by the main file, so a large record stays small enough for
 * AI fetch tools. Concatenating each file's brand.<key> arrays, @graph and
 * relationships into the main file gives the one-file record back.
 */

export interface Issue {
  path: string;
  message: string;
  keyword?: string;
  suggestion?: string;
}

export const CONTENT_FILE_TYPES = ['publication', 'social-post', 'video', 'podcast', 'speaking', 'product'] as const;
export type ContentFileType = (typeof CONTENT_FILE_TYPES)[number];

/** brand.* key each content type's rows live under. */
export const CONTENT_BRAND_KEY: Record<ContentFileType, string> = {
  publication: 'publications',
  'social-post': 'publications',
  video: 'video',
  podcast: 'podcasts',
  speaking: 'speaking',
  product: 'products',
};

export const RECOMMENDED_MAX_BYTES = 100 * 1024;
const NEAR_MAX_BYTES = 80 * 1024;

type Doc = Record<string, any>;

const isObj = (v: unknown): v is Doc => !!v && typeof v === 'object' && !Array.isArray(v);
const isHttps = (v: unknown) => typeof v === 'string' && /^https:\/\/[^\s]+$/i.test(v);
const isHttp = (v: unknown) => typeof v === 'string' && /^https?:\/\/[^\s]+$/i.test(v);
const isDate = (v: unknown) => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}/.test(v) && !Number.isNaN(Date.parse(v.slice(0, 10)));
/** UTF-8 byte length without TextEncoder (not in the package's TS lib). */
function byteLen(s: string): number {
  let n = 0;
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i);
    if (c < 0x80) n += 1;
    else if (c < 0x800) n += 2;
    else if (c >= 0xd800 && c < 0xdc00 && i + 1 < s.length) { n += 4; i++; }
    else n += 3;
  }
  return n;
}

/** "3.4" → [3, 4]; null when it isn't a version string. */
export function parseVersion(v: unknown): [number, number] | null {
  const m = typeof v === 'string' ? /^(\d+)\.(\d+)/.exec(v) : null;
  return m ? [Number(m[1]), Number(m[2])] : null;
}

/** v3.5 and later: v3.5 schema findings are errors, not warnings. */
export function isV35OrLater(v: unknown): boolean {
  const p = parseVersion(v);
  return !!p && (p[0] > 3 || (p[0] === 3 && p[1] >= 5));
}

/** v3.3 and later are checked structurally (not with the v3.0 schema). */
export function isModernVersion(v: unknown): boolean {
  const p = parseVersion(v);
  return !!p && (p[0] > 3 || (p[0] === 3 && p[1] >= 3));
}

export function versionOf(data: Doc | null | undefined): string {
  const v = data?.version ?? data?.citemapVersion;
  return typeof v === 'string' ? v : 'unknown';
}

/** Graph + relationship checks shared by the main file and content files. */
function checkGraph(data: Doc, errors: Issue[], warnings: Issue[], opts: { knownIds?: Set<string>; endpointsMayBeElsewhere?: boolean } = {}) {
  const ids = new Set<string>(opts.knownIds ?? []);
  if (data['@graph'] !== undefined) {
    if (!Array.isArray(data['@graph'])) errors.push({ path: '/@graph', message: '@graph must be an array', keyword: 'type' });
    else {
      const seen = new Set<string>();
      data['@graph'].forEach((n: unknown, i: number) => {
        if (!isObj(n)) { errors.push({ path: `/@graph/${i}`, message: 'each @graph node must be an object', keyword: 'type' }); return; }
        if (typeof n['@id'] !== 'string' || !n['@id']) errors.push({ path: `/@graph/${i}/@id`, message: 'node needs an @id', keyword: 'required' });
        else {
          if (seen.has(n['@id'])) errors.push({ path: `/@graph/${i}/@id`, message: `duplicate @id ${n['@id']}`, keyword: 'uniqueItems' });
          seen.add(n['@id']); ids.add(n['@id']);
        }
        if (n['@type'] === undefined) warnings.push({ path: `/@graph/${i}`, message: 'node has no @type', suggestion: 'Give every node a schema.org @type' });
      });
    }
  }
  if (data.relationships !== undefined) {
    if (!Array.isArray(data.relationships)) errors.push({ path: '/relationships', message: 'relationships must be an array', keyword: 'type' });
    else {
      let dangling = 0;
      data.relationships.forEach((r: unknown, i: number) => {
        if (!isObj(r)) { errors.push({ path: `/relationships/${i}`, message: 'each relationship must be an object', keyword: 'type' }); return; }
        for (const k of ['from', 'to', 'type']) {
          if (typeof r[k] !== 'string' || !r[k]) errors.push({ path: `/relationships/${i}/${k}`, message: `relationship needs ${k}`, keyword: 'required' });
        }
        if (r.observedAt !== undefined && !isDate(r.observedAt)) warnings.push({ path: `/relationships/${i}/observedAt`, message: 'observedAt should be a date (YYYY-MM-DD)' });
        for (const k of ['from', 'to']) {
          const v = r[k];
          // Endpoints within the entity's own graph should resolve; external URIs (other sites) needn't.
          if (typeof v === 'string' && v.includes('#') && !ids.has(v) && !opts.endpointsMayBeElsewhere) dangling++;
        }
      });
      if (dangling) warnings.push({ path: '/relationships', message: `${dangling} relationship endpoint(s) don't match any @id in this file`, suggestion: 'Add the node to @graph, or check the @id spelling' });
    }
  }
  return ids;
}

/** v3.3+ main-file structure. */
export function checkModernCitemap(data: unknown): { errors: Issue[]; warnings: Issue[]; bytes: number } {
  const errors: Issue[] = [];
  const warnings: Issue[] = [];
  if (!isObj(data)) return { errors: [{ path: '/', message: 'citemap must be a JSON object', keyword: 'type' }], warnings, bytes: 0 };
  if (data['@type'] === 'CitemapContentFile') {
    errors.push({ path: '/@type', message: 'this is a content file, not a main citemap', keyword: 'const', suggestion: 'Validate the main citemap.json (it lists this file in contentFiles), or validate this file as a content file' });
  } else if (data['@type'] !== 'Citemap') errors.push({ path: '/@type', message: '@type must be "Citemap"', keyword: 'const' });
  if (typeof data.version !== 'string' && typeof data.citemapVersion !== 'string') errors.push({ path: '/version', message: 'version (or citemapVersion) is required', keyword: 'required' });
  if (typeof data.version === 'string' && typeof data.citemapVersion === 'string' && data.version !== data.citemapVersion) warnings.push({ path: '/version', message: `version ${data.version} and citemapVersion ${data.citemapVersion} disagree` });
  if (!isObj(data.brand)) errors.push({ path: '/brand', message: 'brand (the entity) is required', keyword: 'required' });
  else {
    if (typeof data.brand.name !== 'string' || !data.brand.name.trim()) errors.push({ path: '/brand/name', message: 'brand.name is required', keyword: 'required' });
    if (!isHttp(data.brand.url)) errors.push({ path: '/brand/url', message: 'brand.url must be the entity\'s website (http(s) URL)', keyword: 'format' });
  }
  if (data.lastVerified !== undefined && !isDate(data.lastVerified)) warnings.push({ path: '/lastVerified', message: 'lastVerified should be a date (YYYY-MM-DD)' });

  const hasContentFiles = Array.isArray(data.contentFiles) && data.contentFiles.length > 0;
  const brandId = isObj(data.brand) && typeof data.brand['@id'] === 'string' ? data.brand['@id'] : undefined;
  checkGraph(data, errors, warnings, { knownIds: new Set(brandId ? [brandId] : []), endpointsMayBeElsewhere: hasContentFiles });

  if (data.contentFiles !== undefined) {
    if (!Array.isArray(data.contentFiles)) errors.push({ path: '/contentFiles', message: 'contentFiles must be an array', keyword: 'type' });
    else data.contentFiles.forEach((f: unknown, i: number) => {
      const p = `/contentFiles/${i}`;
      if (!isObj(f)) { errors.push({ path: p, message: 'each content file entry must be an object', keyword: 'type' }); return; }
      if (!CONTENT_FILE_TYPES.includes(f.type)) errors.push({ path: `${p}/type`, message: `type must be one of ${CONTENT_FILE_TYPES.join(', ')}`, keyword: 'enum' });
      if (!isHttps(f.url)) errors.push({ path: `${p}/url`, message: 'url must be an absolute https URL', keyword: 'format' });
      if (!Number.isInteger(f.count) || f.count < 0) errors.push({ path: `${p}/count`, message: 'count must be a whole number ≥ 0', keyword: 'type' });
      if (f.year !== undefined && !/^(\d{4}|undated)$/.test(String(f.year))) warnings.push({ path: `${p}/year`, message: 'year should be YYYY or "undated"' });
      if (f.lastUpdated !== undefined && !isDate(f.lastUpdated)) warnings.push({ path: `${p}/lastUpdated`, message: 'lastUpdated should be a date (YYYY-MM-DD)' });
      if (f.part !== undefined && !(Number.isInteger(f.part) && f.part >= 1)) errors.push({ path: `${p}/part`, message: 'part must be a whole number ≥ 1', keyword: 'type' });
    });
    // Content moved out shouldn't also be inline.
    if (hasContentFiles && isObj(data.brand)) {
      if ((data.contentFiles as Doc[]).some(f => f?.type === 'product') && Array.isArray(data.brand.products) && data.brand.products.length === 0)
        warnings.push({ path: '/brand/products', message: 'brand.products is an empty array while products are in content files', suggestion: 'Leave brand.products out of the main file; an empty array reads as "no products" (v3.5 §2.1)' });
      for (const f of data.contentFiles as Doc[]) {
        const key = CONTENT_BRAND_KEY[f?.type as ContentFileType];
        if (key && Array.isArray(data.brand[key]) && data.brand[key].length) {
          warnings.push({ path: `/brand/${key}`, message: `brand.${key} is inline and also listed in contentFiles (${f.type})`, suggestion: 'Keep each item in one place: the content file' });
          break;
        }
      }
    }
  }

  // brand.products is always-on (v3.3 §3); a product content file satisfies it (v3.5 §2.1).
  if (isObj(data.brand) && data.brand.products === undefined && !(Array.isArray(data.contentFiles) && data.contentFiles.some((f: Doc) => f?.type === 'product'))) {
    const issue = { path: '/brand/products', message: 'brand.products is missing (always-on section; [] when the entity has no products)', keyword: 'required' };
    if (isV35OrLater(versionOf(data))) errors.push(issue); else warnings.push(issue);
  }

  const bytes = byteLen(JSON.stringify(data, null, 2));
  if (bytes >= RECOMMENDED_MAX_BYTES) warnings.push({ path: '/', message: `file is ${Math.round(bytes / 1024)} KB; the spec recommends under 100 KB (AI fetch tools often read only the first ~100 KB)`, suggestion: hasContentFiles ? 'Move more content into content files' : 'Move Media and products into content files (contentFiles)' });
  else if (bytes >= NEAR_MAX_BYTES) warnings.push({ path: '/', message: `file is ${Math.round(bytes / 1024)} KB, nearing the 100 KB recommendation` });
  return { errors, warnings, bytes };
}

export interface ContentFileResult {
  valid: boolean;
  errors: Issue[];
  warnings: Issue[];
  contentType?: string;
  count: number;
}

/** A single content file ("@type": "CitemapContentFile"). */
export function validateContentFile(data: unknown, ref?: { type?: string; count?: number; part?: number }): ContentFileResult {
  const errors: Issue[] = [];
  const warnings: Issue[] = [];
  if (!isObj(data)) return { valid: false, errors: [{ path: '/', message: 'content file must be a JSON object', keyword: 'type' }], warnings, count: 0 };
  if (data['@type'] !== 'CitemapContentFile') errors.push({ path: '/@type', message: '@type must be "CitemapContentFile"', keyword: 'const' });
  const type = data.contentType as ContentFileType;
  if (!CONTENT_FILE_TYPES.includes(type)) errors.push({ path: '/contentType', message: `contentType must be one of ${CONTENT_FILE_TYPES.join(', ')}`, keyword: 'enum' });
  if (typeof data.isPartOf !== 'string' || !isHttp(data.isPartOf)) warnings.push({ path: '/isPartOf', message: 'isPartOf should be the main citemap URL' });
  let count = 0;
  if (!isObj(data.brand)) errors.push({ path: '/brand', message: 'brand is required (holds the rows)', keyword: 'required' });
  else if (CONTENT_FILE_TYPES.includes(type)) {
    const key = CONTENT_BRAND_KEY[type];
    const rows = data.brand[key];
    if (!Array.isArray(rows)) errors.push({ path: `/brand/${key}`, message: `brand.${key} (the ${type} rows) is required`, keyword: 'required' });
    else {
      count = rows.length;
      if (type === 'social-post' && rows.some((r: Doc) => r?.contentType && r.contentType !== 'social-post')) warnings.push({ path: `/brand/${key}`, message: 'a social-post file holds rows that aren\'t social posts' });
    }
    if (Number.isInteger(data.count) && data.count !== count) errors.push({ path: '/count', message: `count says ${data.count} but brand.${key} has ${count}`, keyword: 'const' });
  }
  if (ref?.type && data.contentType !== ref.type) errors.push({ path: '/contentType', message: `main file lists this as ${ref.type}, file says ${data.contentType}`, keyword: 'const' });
  if (ref && Number.isInteger(ref.count) && ref.count !== count) errors.push({ path: '/count', message: `main file lists ${ref.count} items, file has ${count}`, keyword: 'const' });
  if (data.part !== undefined && !(Number.isInteger(data.part) && data.part >= 1)) errors.push({ path: '/part', message: 'part must be a whole number ≥ 1', keyword: 'type' });
  if (ref && (ref as Doc).part !== undefined && data.part !== (ref as Doc).part) errors.push({ path: '/part', message: `main file lists part ${(ref as Doc).part}, file says ${data.part}`, keyword: 'const' });
  checkGraph(data, errors, warnings, { endpointsMayBeElsewhere: true });
  const bytes = byteLen(JSON.stringify(data, null, 2));
  if (bytes >= RECOMMENDED_MAX_BYTES) warnings.push({ path: '/', message: `content file is ${Math.round(bytes / 1024)} KB; the spec recommends under 100 KB`, suggestion: 'Split it further (by year, category, or numbered parts; v3.5 §8.6)' });
  return { valid: errors.length === 0, errors, warnings, contentType: data.contentType, count };
}

/**
 * Join a main file and its content files into the one-file record.
 * Arrays concatenate; ids already present are skipped.
 */
export function mergeContentFiles(main: Doc, files: Doc[]): Doc {
  const out: Doc = { ...main, brand: { ...(isObj(main.brand) ? main.brand : {}) } };
  const graph: Doc[] = [...(Array.isArray(main['@graph']) ? main['@graph'] : [])];
  const rels: Doc[] = [...(Array.isArray(main.relationships) ? main.relationships : [])];
  const seenNode = new Set(graph.map(n => n?.['@id']).filter(Boolean));
  const relKey = (r: Doc) => `${r?.from}|${r?.type}|${r?.to}`;
  const seenRel = new Set(rels.map(relKey));
  const keys = new Set(Object.values(CONTENT_BRAND_KEY));
  for (const f of files) {
    if (!isObj(f) || f['@type'] !== 'CitemapContentFile') continue;
    const fb = isObj(f.brand) ? f.brand : {};
    for (const key of keys) {
      if (!Array.isArray(fb[key])) continue;
      const have: Doc[] = Array.isArray(out.brand[key]) ? out.brand[key] : [];
      const ids = new Set(have.map(r => r?.id).filter(Boolean));
      out.brand[key] = [...have, ...fb[key].filter((r: Doc) => !(r?.id && ids.has(r.id)))];
    }
    for (const n of Array.isArray(f['@graph']) ? f['@graph'] : []) {
      if (n?.['@id'] && seenNode.has(n['@id'])) continue;
      seenNode.add(n?.['@id']); graph.push(n);
    }
    for (const r of Array.isArray(f.relationships) ? f.relationships : []) {
      const k = relKey(r);
      if (seenRel.has(k)) continue;
      seenRel.add(k); rels.push(r);
    }
  }
  if (graph.length) out['@graph'] = graph;
  if (rels.length) out.relationships = rels;
  delete out.contentFiles;
  return out;
}

/** Checks across the main file and its content files (after fetching them). */
export function checkAcrossFiles(main: Doc, files: Array<{ url: string; data: unknown }>): { errors: Issue[]; warnings: Issue[]; merged: Doc } {
  const errors: Issue[] = [];
  const warnings: Issue[] = [];
  const mainId = isObj(main?.brand) ? main.brand['@id'] : undefined;
  for (const f of files) {
    const about = (f.data as Doc)?.about;
    if (typeof mainId === 'string' && about !== mainId) errors.push({ path: '/about', message: `${f.url.split('/').pop()}: about is ${about ?? 'missing'}, not the main file's brand @id ${mainId}`, keyword: 'const', suggestion: 'Readers discard content files about a different entity (v3.5 §8.7)' });
  }
  const refs: Doc[] = Array.isArray(main?.contentFiles) ? main.contentFiles : [];
  const fetched = new Set(files.map(f => f.url));
  for (const r of refs) if (isHttps(r?.url) && !fetched.has(r.url)) warnings.push({ path: '/contentFiles', message: `not read: ${r.url}` });
  // An @id defined in two files is ambiguous.
  const owner = new Map<string, string>();
  const note = (id: unknown, where: string) => {
    if (typeof id !== 'string') return;
    const prev = owner.get(id);
    if (prev && prev !== where) errors.push({ path: '/@graph', message: `@id ${id} is defined in both ${prev} and ${where}`, keyword: 'uniqueItems' });
    else owner.set(id, where);
  };
  for (const n of Array.isArray(main?.['@graph']) ? main['@graph'] : []) note(n?.['@id'], 'citemap.json');
  for (const f of files) for (const n of Array.isArray((f.data as Doc)?.['@graph']) ? (f.data as Doc)['@graph'] : []) note(n?.['@id'], f.url.split('/').pop() || f.url);
  // Relationship endpoints should resolve in the joined record.
  const merged = mergeContentFiles(main, files.map(f => f.data as Doc));
  const ids = new Set<string>((merged['@graph'] ?? []).map((n: Doc) => n?.['@id']).filter(Boolean));
  if (isObj(merged.brand) && typeof merged.brand['@id'] === 'string') ids.add(merged.brand['@id']);
  let dangling = 0;
  for (const r of merged.relationships ?? []) for (const k of ['from', 'to']) if (typeof r?.[k] === 'string' && r[k].includes('#') && !ids.has(r[k])) dangling++;
  if (dangling) warnings.push({ path: '/relationships', message: `${dangling} relationship endpoint(s) don't match any @id across the files` });
  return { errors, warnings, merged };
}
