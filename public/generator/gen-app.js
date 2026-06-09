/* ============================================================
   citemap.json generator — clean shell (citemaps.org)
   Consumes the field model in gen-data.js (ENTITY_TYPES, MODULES,
   MODULE_FORMS, ENTITY_SITETYPE_MAP). One-way only: build a file
   and download it; validate a file and read the result. No AI,
   no payments, no validator->form round-trip.
   ============================================================ */
(function () {
  "use strict";

  // entity id -> the module that matches it (most ids align;
  // publisher -> content is the one exception).
  const ENTITY_MODULE = {
    local: "local", ecommerce: "ecommerce", saas: "saas", publisher: "content",
    artist: "artist", nonprofit: "nonprofit", healthcare: "healthcare",
    government: "government", research: "research", legal: "legal",
    finance: "finance", education: "education", realestate: "realestate",
    events: "events", person: "person", place: "place", biz: "biz",
  };

  const state = {
    entity: null,
    modules: new Set(["core"]),
    data: {}, // fieldId -> value
  };

  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  // ── entity picker ──
  function renderEntities() {
    const grid = $("eg-entities");
    if (!grid) return;
    grid.innerHTML = ENTITY_TYPES.map((e) =>
      `<button type="button" class="eg-entity${state.entity === e.id ? " sel" : ""}" data-id="${e.id}">
        <span class="eg-entity-ic">${e.icon || ""}</span>
        <span class="eg-entity-name">${esc(e.name)}</span>
        <span class="eg-entity-sub">${esc(e.sub || "")}</span>
      </button>`).join("");
    grid.querySelectorAll(".eg-entity").forEach((b) =>
      b.addEventListener("click", () => selectEntity(b.dataset.id)));
  }

  function selectEntity(id) {
    state.entity = id;
    state.modules = new Set(["core"]);
    const m = ENTITY_MODULE[id];
    if (m && MODULE_FORMS[m]) state.modules.add(m);
    // default siteType from the entity
    if (ENTITY_SITETYPE_MAP[id]) state.data["brand.siteType"] = ENTITY_SITETYPE_MAP[id];
    renderEntities();
    renderModules();
    renderForm();
    renderOutput();
    const f = $("eg-form-wrap");
    if (f) f.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // ── module toggles ──
  function renderModules() {
    const wrap = $("eg-modules");
    if (!wrap) return;
    wrap.innerHTML = MODULES.map((m) => {
      const on = state.modules.has(m.id);
      const req = !!m.required;
      return `<button type="button" class="eg-mod${on ? " sel" : ""}${req ? " req" : ""}" data-id="${m.id}" ${req ? "disabled" : ""}>
        <span class="eg-mod-name">${esc(m.name)}</span>
        ${req ? '<span class="eg-mod-tag">required</span>' : `<span class="eg-mod-x">${on ? "−" : "+"}</span>`}
      </button>`;
    }).join("");
    wrap.querySelectorAll(".eg-mod:not(.req)").forEach((b) =>
      b.addEventListener("click", () => {
        const id = b.dataset.id;
        if (state.modules.has(id)) state.modules.delete(id);
        else state.modules.add(id);
        renderModules(); renderForm(); renderOutput();
      }));
  }

  // ── form ──
  function fieldInput(f) {
    const v = state.data[f.id];
    const req = f.required ? ' <span class="eg-req">*</span>' : "";
    const hint = f.hint || (f.counter && f.counter.hint) || "";
    const hintHtml = hint ? `<div class="eg-hint">${esc(hint)}</div>` : "";
    let control = "";
    if (f.type === "textarea") {
      control = `<textarea data-fid="${f.id}" rows="3" placeholder="${esc(f.placeholder || "")}">${v ? esc(v) : ""}</textarea>`;
    } else if (f.type === "select") {
      const opts = (f.options || []).map((o) => `<option value="${esc(o)}"${v === o ? " selected" : ""}>${esc(o)}</option>`).join("");
      control = `<select data-fid="${f.id}"><option value="">—</option>${opts}</select>`;
    } else if (f.type === "tags") {
      const tags = Array.isArray(v) ? v : [];
      control = `<div class="eg-tags" data-fid="${f.id}">
        <div class="eg-tag-list">${tags.map((t, i) => `<span class="eg-tag">${esc(t)}<button type="button" data-rm="${i}">×</button></span>`).join("")}</div>
        <input type="text" class="eg-tag-input" placeholder="${esc(f.placeholder || "Add and press Enter")}" />
      </div>`;
    } else {
      const t = f.type === "number" ? "number" : f.type === "url" ? "url" : f.type === "email" ? "email" : f.type === "date" ? "date" : "text";
      control = `<input type="${t}" data-fid="${f.id}" placeholder="${esc(f.placeholder || "")}" value="${v != null && !Array.isArray(v) ? esc(v) : ""}" />`;
    }
    return `<label class="eg-field${f.full ? " full" : ""}"><span class="eg-label">${esc(f.label)}${req}</span>${control}${hintHtml}</label>`;
  }

  function renderForm() {
    const wrap = $("eg-form");
    if (!wrap) return;
    if (!state.entity) { wrap.innerHTML = '<p class="eg-empty">Pick an entity type above to begin.</p>'; return; }
    const ordered = MODULES.filter((m) => state.modules.has(m.id)).map((m) => m.id);
    wrap.innerHTML = ordered.map((mid) => {
      const form = MODULE_FORMS[mid];
      if (!form) return "";
      const secs = form.sections.map((sec) =>
        `<div class="eg-section"><h4>${esc(sec.title)}</h4><div class="eg-fields">${sec.fields.map(fieldInput).join("")}</div></div>`).join("");
      return `<div class="eg-module-block"><div class="eg-module-head">${esc(form.title)}</div>${secs}</div>`;
    }).join("");
    bindForm();
  }

  function bindForm() {
    const wrap = $("eg-form");
    wrap.querySelectorAll("[data-fid]").forEach((el) => {
      if (el.classList.contains("eg-tags")) return;
      const fid = el.dataset.fid;
      const ev = el.tagName === "SELECT" ? "change" : "input";
      el.addEventListener(ev, () => { state.data[fid] = el.value; renderOutput(); });
    });
    wrap.querySelectorAll(".eg-tags").forEach((box) => {
      const fid = box.dataset.fid;
      const input = box.querySelector(".eg-tag-input");
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && input.value.trim()) {
          e.preventDefault();
          const arr = Array.isArray(state.data[fid]) ? state.data[fid] : [];
          arr.push(input.value.trim());
          state.data[fid] = arr; input.value = ""; renderForm(); renderOutput();
        }
      });
      box.querySelectorAll("[data-rm]").forEach((btn) =>
        btn.addEventListener("click", () => {
          const arr = state.data[fid] || [];
          arr.splice(Number(btn.dataset.rm), 1);
          state.data[fid] = arr; renderForm(); renderOutput();
        }));
    });
  }

  // ── assemble citemap.json (v3.4) ──
  function setPath(obj, path, val) {
    const ks = path.split(".");
    let o = obj;
    for (let i = 0; i < ks.length - 1; i++) { o[ks[i]] = o[ks[i]] || {}; o = o[ks[i]]; }
    o[ks[ks.length - 1]] = val;
  }

  function assemble() {
    const out = { version: "3.4" };
    const ordered = MODULES.filter((m) => state.modules.has(m.id)).map((m) => m.id);
    for (const mid of ordered) {
      const form = MODULE_FORMS[mid];
      if (!form) continue;
      for (const sec of form.sections) for (const f of sec.fields) {
        let v = state.data[f.id];
        if (v == null || v === "" || (Array.isArray(v) && v.length === 0)) continue;
        if (f.type === "number") { const n = Number(v); if (Number.isNaN(n)) continue; v = n; }
        setPath(out, f.id, v);
      }
    }
    return out;
  }

  function renderOutput() {
    const pre = $("eg-output");
    if (!pre) return;
    pre.textContent = JSON.stringify(assemble(), null, 2);
  }

  // ── download / copy ──
  function download() {
    const blob = new Blob([JSON.stringify(assemble(), null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "citemap.json";
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }
  function copy() {
    navigator.clipboard.writeText(JSON.stringify(assemble(), null, 2)).then(() => {
      const b = $("eg-copy"); if (b) { const t = b.textContent; b.textContent = "Copied ✓"; setTimeout(() => (b.textContent = t), 1400); }
    });
  }

  // ── validator (one-way) ──
  function coreRequiredIds() {
    const ids = [];
    for (const sec of MODULE_FORMS.core.sections) for (const f of sec.fields) if (f.required) ids.push({ id: f.id, label: f.label });
    return ids;
  }
  function getPath(obj, path) {
    return path.split(".").reduce((o, k) => (o == null ? undefined : o[k]), obj);
  }
  function validate() {
    const out = $("eg-val-result");
    const raw = $("eg-val-input").value.trim();
    if (!raw) { out.innerHTML = ""; return; }
    let doc;
    try { doc = JSON.parse(raw); }
    catch (e) { out.className = "eg-val bad"; out.innerHTML = `<strong>Invalid JSON.</strong> ${esc(e.message)}`; return; }
    const missing = coreRequiredIds().filter((r) => {
      const v = getPath(doc, r.id);
      return v == null || v === "" || (Array.isArray(v) && !v.length);
    });
    const hasVersion = !!doc.version || !!doc.citemapVersion;
    const hasTrust = !!(doc.trust || doc.policy || doc.verification);
    const hasGraph = !!(doc["@graph"] || doc.relationships);
    let level = 1;
    if (hasTrust) level = 2;
    if (hasTrust && hasGraph) level = 3;
    if (!hasVersion || missing.length) {
      out.className = "eg-val warn";
      out.innerHTML = `<strong>${!hasVersion ? "Missing <code>version</code>. " : ""}${missing.length ? missing.length + " required core field" + (missing.length > 1 ? "s" : "") + " missing:" : ""}</strong>` +
        (missing.length ? "<ul>" + missing.map((m) => `<li>${esc(m.label)} <code>${esc(m.id)}</code></li>`).join("") + "</ul>" : "") +
        `<p class="eg-val-note">Structural check only. For an authoritative validation against the full schema, run <code>npx @citemap/cli validate ./citemap.json</code>.</p>`;
      return;
    }
    out.className = "eg-val ok";
    out.innerHTML = `<strong>Valid structure — Level ${level}.</strong> Core fields present${hasTrust ? ", trust layer present" : ""}${hasGraph ? ", entity graph present" : ""}.` +
      `<p class="eg-val-note">Structural check only. For an authoritative validation against the full schema, run <code>npx @citemap/cli validate ./citemap.json</code>.</p>`;
  }

  // ── tabs ──
  function showTab(tab) {
    $("eg-tab-gen").classList.toggle("sel", tab === "gen");
    $("eg-tab-val").classList.toggle("sel", tab === "val");
    $("eg-panel-gen").style.display = tab === "gen" ? "" : "none";
    $("eg-panel-val").style.display = tab === "val" ? "" : "none";
  }

  // ── init ──
  document.addEventListener("DOMContentLoaded", () => {
    renderEntities(); renderModules(); renderForm(); renderOutput();
    $("eg-tab-gen").addEventListener("click", () => showTab("gen"));
    $("eg-tab-val").addEventListener("click", () => showTab("val"));
    $("eg-download").addEventListener("click", download);
    $("eg-copy").addEventListener("click", copy);
    $("eg-val-input").addEventListener("input", validate);
    // expose assemble for the build-time node test
    window.__assemble = assemble;
  });
})();
