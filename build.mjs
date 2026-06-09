// ============================================================
// citemaps.org static site build — zero framework, one dependency.
//
// Renders the canonical spec markdown (spec/*.md) into templated
// HTML, writes the landing page, and copies static assets from
// public/ into dist/. No Astro, no Vite, no Rollup — just Node +
// `marked`. A version bump is a one-line change in SPEC_SRC below.
//
//   npm run build   ->   node build.mjs   ->   ./dist
// ============================================================
import { marked } from "marked";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const OUT = process.env.OUT || path.join(ROOT, "dist");

// ── single source of truth: bump these to publish a new version ──
const SPEC_VERSION = "3.4";
const SPEC_SRC = `spec/v${SPEC_VERSION}.md`;
const VOCAB_SRC = `spec/registry/v${SPEC_VERSION}-vocabulary.md`;

const read = (p) => fs.readFileSync(path.join(ROOT, p), "utf8");
const md = (p) => marked.parse(read(p));

// ── shared layout ────────────────────────────────────────────
const NAV_LINKS = [
  { href: "/spec/", label: "Spec" },
  { href: "/examples/when-cited-isnt-a-citation.html", label: "Examples" },
  { href: "/spec/registry/", label: "Registry" },
  { href: "/#governance", label: "Governance" },
];

const nav = (current) => `
<nav class="nav"><div class="nav-inner">
  <a href="/" class="brand"><span class="brand-mark">{ }</span><span>citemap.json</span></a>
  <div class="nav-links">
    ${NAV_LINKS.map((l) => `<a href="${l.href}" class="nav-link${current === l.href ? " active" : ""}">${l.label}</a>`).join("")}
    <a href="https://github.com/citemaps/citemap" target="_blank" rel="noopener" class="nav-link nav-ext">GitHub &#8599;</a>
    <a href="https://entitygraph.ai" target="_blank" rel="noopener" class="nav-cta">Build one with EntityGraph &#8599;</a>
  </div>
</div></nav>`;

const footer = () => `
<footer class="foot">
  <div class="wrap foot-inner">
    <div class="foot-brand">
      <div class="foot-logo"><span class="foot-mark">{ }</span> citemap.json</div>
      <p class="foot-tag">An open standard for machine-readable business identity — so AI cites you accurately. Free under CC BY 4.0.</p>
    </div>
    <div class="foot-cols">
      <div class="foot-col"><h5>Standard</h5>
        <a href="/spec/">Specification (v${SPEC_VERSION})</a>
        <a href="/spec/registry/">Vocabulary registry</a>
        <a href="/examples/when-cited-isnt-a-citation.html">Examples</a>
        <a href="/#governance">Governance</a>
      </div>
      <div class="foot-col"><h5>Build</h5>
        <a href="https://github.com/citemaps/citemap" target="_blank" rel="noopener">GitHub &#8599;</a>
        <a href="https://www.npmjs.com/package/@citemap/cli" target="_blank" rel="noopener">@citemap/cli &#8599;</a>
        <a href="https://entitygraph.ai/citemap" target="_blank" rel="noopener">EntityGraph &#8599;</a>
      </div>
    </div>
  </div>
  <div class="wrap foot-bottom">
    <span>citemap.json &#183; v${SPEC_VERSION} &#183; CC BY 4.0</span>
    <span>Reference implementation: <a href="https://entitygraph.ai" target="_blank" rel="noopener">EntityGraph</a></span>
  </div>
</footer>`;

const layout = ({ title, description, current = "", body }) => `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${title}</title>
<meta name="description" content="${description}" />
<link rel="canonical" href="https://citemaps.org${current || "/"}" />
<link rel="icon" href="/favicon.ico" />
<meta property="og:title" content="${title}" />
<meta property="og:description" content="${description}" />
<meta property="og:type" content="website" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet" />
<link rel="stylesheet" href="/styles.css" />
</head>
<body>
${nav(current)}
<main>${body}</main>
${footer()}
</body>
</html>`;

// ── content: entity types, trust tiers, steps ───────────────
const ENTITY_TYPES = ["Local Business","Ecommerce","SaaS / Software","Publisher","Creative / Artist","Nonprofit","Healthcare","Government","Research","Legal Services","Financial Services","Education","Real Estate","Person","Place","Events"];
const TRUST_TIERS = [
  ["Self-asserted","The business states it. The baseline — present but uncorroborated."],
  ["Cross-document","Corroborated by another document the same entity controls."],
  ["Third-party","Confirmed by an independent source (directory, registry, press)."],
  ["DNS-verified","Proven to originate from the domain owner via DNS."],
  ["Authority-verified","Checked against an official register (NPI, bar, FDIC, DUNS)."],
  ["Disputed","Flagged as contested — engines can weight or withhold accordingly."],
];
const STEPS = [
  ["01","Author the record","Describe your entity once: identity, offerings, locations, people, identifiers, and the claims you stand behind."],
  ["02","Annotate trust","Mark each field by how it's corroborated — per-field trust tiers tell engines what's verified versus merely asserted."],
  ["03","Publish at your root","Drop citemap.json at yourdomain.com/citemap.json. Built on schema.org, readable by any crawler — like robots.txt for AI accuracy."],
  ["04","Register &amp; maintain","List it in the public registry for discovery, and keep it current — a maintained record compounds in authority over time."],
];

const JSON_SAMPLE = `<span class="c">// citemap.json — published at your domain root</span>
{
  <span class="k">"version"</span>: <span class="s">"3.4"</span>,
  <span class="k">"citationContract"</span>: {
    <span class="k">"preferredName"</span>: <span class="s">"Acme Co."</span>,
    <span class="k">"contactForCorrections"</span>: <span class="s">"hello@acme.com"</span>
  },
  <span class="k">"identity"</span>: {
    <span class="k">"name"</span>: <span class="s">"Acme Co."</span>,
    <span class="k">"type"</span>: <span class="s">"LocalBusiness"</span>,
    <span class="k">"established"</span>: <span class="n">2014</span>
  },
  <span class="k">"verifiedClaims"</span>: [ <span class="s">"Licensed since 2014"</span> ],
  <span class="k">"trust"</span>: { <span class="k">"perField"</span>: { <span class="s">"npi"</span>: <span class="s">"authority-verified"</span> } }
}`;

const TERM_SAMPLE = `<span class="c"># validate — no install needed</span>
<span class="g">$</span> npx @citemap/cli validate ./citemap.json

<span class="c"># full diagnostic + level assessment</span>
<span class="g">$</span> npx @citemap/cli diagnose ./citemap.json
  <span class="ok">&#10003; valid against v3.4 schema</span>
  <span class="ok">&#10003; Level 2 — DNS-verified</span>`;

const landingBody = `
<section class="hero"><div class="wrap">
  <p class="eyebrow">The open standard for AI entity identity</p>
  <h1>The file AI reads<br /><span class="hl">before it answers</span>.</h1>
  <p class="lead"><code>citemap.json</code> is an open standard that lets any business, practice, or institution publish verified, machine-readable identity at its domain root — so AI assistants like ChatGPT, Perplexity, Gemini, and Claude cite accurate, current facts instead of guessing. Think <code>robots.txt</code>, but for AI citation accuracy.</p>
  <div class="hero-actions">
    <a class="btn btn-dark" href="/spec/">Read the spec &#8594;</a>
    <a class="btn btn-ghost" href="https://github.com/citemaps/citemap" target="_blank" rel="noopener">View on GitHub &#8599;</a>
  </div>
  <div class="hero-meta">CC BY 4.0 &#183; v${SPEC_VERSION} &#183; schema.org-native &#183; open governance</div>
</div></section>

<section class="band"><div class="wrap two">
  <div>
    <p class="eyebrow">Why it exists</p>
    <h2>AI describes your business from a <em>guess</em>.</h2>
    <p class="body">AI assistants answer questions about businesses every day, working from whatever they scraped off a chaotic web — stale hours, a competitor's claim, a fact no one ever verified. They blend it all and state it with equal confidence, and there has never been a standard way to say: <em>here is what's actually true about us, and here's how you can tell.</em></p>
    <p class="body">citemap.json is that standard — a single authoritative file, designed for how AI reads, that carries your verified identity and the provenance behind every claim.</p>
  </div>
  <pre class="json">${JSON_SAMPLE}</pre>
</div></section>

<section class="band alt"><div class="wrap">
  <p class="eyebrow">How it works</p>
  <h2>Author it once. Publish it everywhere AI looks.</h2>
  <div class="steps">
    ${STEPS.map(([n,t,d]) => `<div class="step"><div class="step-n">${n}</div><h3>${t}</h3><p>${d}</p></div>`).join("")}
  </div>
</div></section>

<section class="band"><div class="wrap">
  <p class="eyebrow">What's in the file</p>
  <h2>A universal core, plus modules for your domain.</h2>
  <p class="body wide">Every citemap.json shares a <strong>universal core</strong> — identity, citation contract, verified claims, and trust annotations. On top of that, domain modules add the fields that matter for your kind of entity: NPI and accepted insurance for healthcare, bar number and practice areas for legal, registrations for financial, retraction status for research, and so on across fourteen entity types.</p>
  <div class="chips">${ENTITY_TYPES.map((e) => `<span class="chip">${e}</span>`).join("")}</div>
</div></section>

<section class="band alt"><div class="wrap">
  <p class="eyebrow">The differentiator</p>
  <h2>Trust is per-field, not per-document.</h2>
  <p class="body wide">Anyone can assert a fact. citemap.json's six trust tiers let an engine see <em>how</em> each individual claim is corroborated — so verified facts can be weighted, and disputed ones flagged. It's the structural reason an AI can decide to cite you with confidence.</p>
  <div class="tiers">
    ${TRUST_TIERS.map(([t,d],i) => `<div class="tier"><div class="tier-n">${i+1}</div><div><h4>${t}</h4><p>${d}</p></div></div>`).join("")}
  </div>
</div></section>

<section class="band"><div class="wrap two">
  <div>
    <p class="eyebrow">Validate &amp; deploy</p>
    <h2>Check your file in one command.</h2>
    <p class="body">The open-source CLI validates a citemap.json against the schema and reports its deployment level. No account, no install required — run it with <code>npx</code>, or wire it into CI.</p>
    <p class="body">Deployment grades from <strong>Level 1</strong> (valid and present) through <strong>Level 3</strong> (verified, registered, richly annotated) — a clear target to build toward.</p>
  </div>
  <pre class="json term">${TERM_SAMPLE}</pre>
</div></section>

<section class="band alt" id="governance"><div class="wrap">
  <p class="eyebrow">Open governance</p>
  <h2>An open standard — owned by no one, usable by everyone.</h2>
  <p class="body wide">citemap.json is published free under <strong>CC BY 4.0</strong>. The specification, JSON schema, vocabulary registry, and validator are all open source on GitHub. Anyone can implement it, by hand or with any tool; your record is yours, hosted at your domain and portable forever. The standard evolves in the open through versioned proposals — additively, so older files keep validating.</p>
  <div class="hero-actions">
    <a class="btn btn-ghost" href="https://github.com/citemaps/citemap" target="_blank" rel="noopener">Contribute on GitHub &#8599;</a>
    <a class="btn btn-ghost" href="/spec/registry/">Vocabulary registry &#8594;</a>
  </div>
</div></section>

<section class="band"><div class="wrap impl">
  <div>
    <p class="eyebrow">Reference implementation</p>
    <h2>Don't want to hand-write it?</h2>
    <p class="body">The standard is free to implement yourself. <strong>EntityGraph</strong> is the reference implementation — it builds and maintains a class-leading citemap.json from a verified model of your business, then monitors how AI engines respond. The easiest way to get a top-tier file live; the standard itself belongs to everyone.</p>
    <a class="btn btn-dark" href="https://entitygraph.ai/citemap" target="_blank" rel="noopener">See EntityGraph &#8599;</a>
  </div>
</div></section>`;

const docHead = ({ eyebrow, h1, sub, actions }) => `
<section class="doc-head"><div class="wrap">
  <p class="eyebrow">${eyebrow}</p>
  <h1>${h1}</h1>
  <p class="doc-sub">${sub}</p>
  <div class="doc-actions">${actions}</div>
</div></section>`;

const specBody = docHead({
  eyebrow: "Specification",
  h1: `citemap.json — v${SPEC_VERSION}`,
  sub: "The normative specification, rendered straight from the canonical Markdown source. Released 2026-06-02 &#183; MIT &#183; backward-compatible with v2.0–v3.3.",
  actions: `<a class="btn btn-ghost" href="https://github.com/citemaps/citemap/blob/main/${SPEC_SRC}" target="_blank" rel="noopener">View source on GitHub &#8599;</a><a class="btn btn-ghost" href="/spec/registry/">Vocabulary registry &#8594;</a>`,
}) + `<section class="wrap"><article class="prose">${md(SPEC_SRC)}</article></section>`;

const registryBody = docHead({
  eyebrow: "Vocabulary registry",
  h1: `Recommended values — v${SPEC_VERSION}`,
  sub: "The controlled vocabularies the spec references — primaryVertical values, enums, and module keys. Rendered from the canonical Markdown source; additive across versions.",
  actions: `<a class="btn btn-ghost" href="https://github.com/citemaps/citemap/blob/main/${VOCAB_SRC}" target="_blank" rel="noopener">View source on GitHub &#8599;</a><a class="btn btn-ghost" href="/spec/">&#8592; Back to spec</a>`,
}) + `<section class="wrap"><article class="prose">${md(VOCAB_SRC)}</article></section>`;

// ── styles ───────────────────────────────────────────────────
const STYLES = read("src-styles.css");

// ── write ────────────────────────────────────────────────────
const writeHtml = (rel, html) => {
  const full = path.join(OUT, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, html);
};

fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, "styles.css"), STYLES);

writeHtml("index.html", layout({
  title: "citemap.json — the open standard for AI entity identity",
  description: "citemap.json is an open standard that lets businesses publish verified, machine-readable identity at their domain root, so AI assistants cite them accurately. Free under CC BY 4.0.",
  current: "/", body: landingBody,
}));
writeHtml("spec/index.html", layout({
  title: `citemap.json Specification v${SPEC_VERSION}`,
  description: `The normative citemap.json specification, v${SPEC_VERSION} — rendered from the canonical Markdown source on GitHub.`,
  current: "/spec/", body: specBody,
}));
writeHtml("spec/registry/index.html", layout({
  title: `citemap.json Vocabulary Registry — v${SPEC_VERSION}`,
  description: "The canonical recommended-values registry for citemap.json — primaryVertical, enums, and controlled vocabularies.",
  current: "/spec/registry/", body: registryBody,
}));

// ── content pages: rich HTML fragments wrapped in the layout ──
const CONTENT_PAGES = [
  {
    out: "examples/when-cited-isnt-a-citation.html",
    src: "content/examples/when-cited-isnt-a-citation.html",
    current: "/examples/when-cited-isnt-a-citation.html",
    title: 'When "Cited" Isn\'t Really a Citation — citemap.json example',
    description: "How a missing disambiguation field caused an AI engine to hallucinate an energy company in place of a natural stone supplier — and the single citemap.json field that prevents it.",
  },
];
for (const p of CONTENT_PAGES) {
  writeHtml(p.out, layout({
    title: p.title, description: p.description, current: p.current,
    body: `<section class="wrap"><article class="article">${read(p.src)}</article></section>`,
  }));
}

// ── copy static assets from public/ (skip superseded/stale) ──
const SKIP = new Set([
  "index.html", "spec/index.html", "spec/v3.3.md", "spec/v3.3.md.bak",
  "spec/registry/v3.3-vocabulary.md", ".DS_Store",
  // regenerated through the layout by CONTENT_PAGES above — don't
  // let the old hand-authored copy overwrite it
  "examples/when-cited-isnt-a-citation.html",
]);
const PUB = path.join(ROOT, "public");
if (fs.existsSync(PUB)) {
  fs.cpSync(PUB, OUT, {
    recursive: true,
    filter: (src) => {
      const rel = path.relative(PUB, src);
      if (!rel) return true;
      return !SKIP.has(rel) && !rel.endsWith(".DS_Store");
    },
  });
}

console.log(`✓ built citemaps.org → ${OUT} (v${SPEC_VERSION})`);
