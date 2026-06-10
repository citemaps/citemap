/* ============================================================
   citemap.json generator — clean shell (citemaps.org)
   Consumes the field model in gen-data.js (ENTITY_TYPES, MODULES,
   MODULE_FORMS, ENTITY_SITETYPE_MAP). One-way only: build a file
   and download it; validate a file and read the result. No AI,
   no payments, no validator->form round-trip.

   Field types handled: text/url/email/tel/number/date, textarea,
   select, tags (chip OR comma-separated/paste), repeater
   (multi-instance add-row groups with subfields). Citemap level
   is COMPUTED from filled fields (read-only badge), never picked.
   ============================================================ */
(function () {
  "use strict";

  const ENTITY_MODULE = {
    local: "local", ecommerce: "ecommerce", saas: "saas", publisher: "content",
    artist: "artist", nonprofit: "nonprofit", healthcare: "healthcare",
    government: "government", research: "research", legal: "legal",
    finance: "finance", education: "education", realestate: "realestate",
    events: "events", person: "person", place: "place", biz: "biz",
  };

  const state = { entity: null, modules: new Set(["core"]), data: {} };

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
    grid.querySelectorAll(".eg-entity").forEach((b) => b.addEventListener("click", () => selectEntity(b.dataset.id)));
  }

  function selectEntity(id) {
    state.entity = id;
    state.modules = new Set(["core"]);
    const m = ENTITY_MODULE[id];
    if (m && MODULE_FORMS[m]) state.modules.add(m);
    if (ENTITY_SITETYPE_MAP[id]) state.data["brand.siteType"] = ENTITY_SITETYPE_MAP[id];
    renderEntities(); renderModules(); renderForm(); renderOutput();
    const f = $("eg-form-wrap");
    if (f) f.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // ── module toggles ──
  function renderModules() {
    const wrap = $("eg-modules");
    if (!wrap) return;
    wrap.innerHTML = MODULES.map((m) => {
      const on = state.modules.has(m.id), req = !!m.required;
      return `<button type="button" class="eg-mod${on ? " sel" : ""}${req ? " req" : ""}" data-id="${m.id}" ${req ? "disabled" : ""}>
        <span class="eg-mod-name">${esc(m.name)}</span>
        ${req ? '<span class="eg-mod-tag">required</span>' : `<span class="eg-mod-x">${on ? "−" : "+"}</span>`}
      </button>`;
    }).join("");
    wrap.querySelectorAll(".eg-mod:not(.req)").forEach((b) =>
      b.addEventListener("click", () => {
        const id = b.dataset.id;
        if (state.modules.has(id)) state.modules.delete(id); else state.modules.add(id);
        renderModules(); renderForm(); renderOutput();
      }));
  }

  // ── one sub-input (used inside repeater rows) ──
  function subInput(repId, ri, sf, val) {
    const base = `data-rep="${repId}" data-ri="${ri}" data-sub="${sf.id}"`;
    let c;
    if (sf.type === "textarea") {
      c = `<textarea ${base} rows="2" placeholder="${esc(sf.placeholder || "")}">${val ? esc(val) : ""}</textarea>`;
    } else if (sf.type === "select") {
      const opts = (sf.options || []).map((o) => `<option value="${esc(o)}"${val === o ? " selected" : ""}>${esc(o)}</option>`).join("");
      c = `<select ${base}><option value="">—</option>${opts}</select>`;
    } else {
      const t = sf.type === "url" ? "url" : sf.type === "number" ? "number" : sf.type === "email" ? "email" : sf.type === "tel" ? "tel" : "text";
      c = `<input type="${t}" ${base} placeholder="${esc(sf.placeholder || "")}" value="${val != null ? esc(val) : ""}" />`;
    }
    return `<label class="eg-subfield"><span class="eg-sublabel">${esc(sf.label)}${sf.required ? ' <span class="eg-req">*</span>' : ""}</span>${c}</label>`;
  }

  // ── one field ──
  function fieldInput(f) {
    const v = state.data[f.id];
    const req = f.required ? ' <span class="eg-req">*</span>' : "";

    if (f.type === "repeater") {
      const rows = Array.isArray(v) ? v : [];
      const body = rows.map((row, ri) => `
        <div class="eg-rep-row">
          <div class="eg-rep-row-head"><span>${esc(f.itemLabel || "Item")} ${ri + 1}</span>
            <button type="button" class="eg-rep-del" data-rep="${f.id}" data-ri="${ri}">Remove</button></div>
          <div class="eg-rep-grid">${(f.subfields || []).map((sf) => subInput(f.id, ri, sf, row ? row[sf.id] : "")).join("")}</div>
        </div>`).join("");
      const hint = f.hint ? `<div class="eg-hint">${esc(f.hint)}</div>` : "";
      return `<div class="eg-field full"><span class="eg-label">${esc(f.label)}${req}</span>
        <div class="eg-rep">${body}<button type="button" class="eg-rep-add" data-rep="${f.id}">${esc(f.addLabel || "+ Add")}</button></div>${hint}</div>`;
    }

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
        <input type="text" class="eg-tag-input" placeholder="${esc(f.placeholder || "Type and press Enter, or paste comma-separated")}" />
      </div>`;
    } else {
      const t = f.type === "number" ? "number" : f.type === "url" ? "url" : f.type === "email" ? "email" : f.type === "tel" ? "tel" : f.type === "date" ? "date" : "text";
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

  // ── add tag(s): splits on commas so chips OR comma/paste both work ──
  function addTags(fid, raw) {
    const parts = String(raw).split(",").map((s) => s.trim()).filter(Boolean);
    if (!parts.length) return false;
    const arr = Array.isArray(state.data[fid]) ? state.data[fid] : [];
    for (const p of parts) if (!arr.includes(p)) arr.push(p);
    state.data[fid] = arr;
    return true;
  }

  function bindForm() {
    const wrap = $("eg-form");

    // plain fields
    wrap.querySelectorAll("[data-fid]").forEach((el) => {
      if (el.classList.contains("eg-tags")) return;
      const fid = el.dataset.fid;
      const ev = el.tagName === "SELECT" ? "change" : "input";
      el.addEventListener(ev, () => { state.data[fid] = el.value; renderOutput(); });
    });

    // tags: chip on Enter/comma, accept comma-paste, flush on blur
    wrap.querySelectorAll(".eg-tags").forEach((box) => {
      const fid = box.dataset.fid;
      const input = box.querySelector(".eg-tag-input");
      const flush = () => { if (addTags(fid, input.value)) { input.value = ""; renderForm(); renderOutput(); } };
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === ",") { e.preventDefault(); flush(); }
      });
      input.addEventListener("paste", () => setTimeout(() => { if (input.value.includes(",")) flush(); }, 0));
      input.addEventListener("blur", flush);
      box.querySelectorAll("[data-rm]").forEach((btn) =>
        btn.addEventListener("click", () => {
          const arr = state.data[fid] || []; arr.splice(Number(btn.dataset.rm), 1);
          state.data[fid] = arr; renderForm(); renderOutput();
        }));
    });

    // repeater: add / remove rows (re-render); sub-input edits (no re-render, keep focus)
    wrap.querySelectorAll(".eg-rep-add").forEach((b) =>
      b.addEventListener("click", () => {
        const id = b.dataset.rep;
        const arr = Array.isArray(state.data[id]) ? state.data[id] : [];
        arr.push({}); state.data[id] = arr; renderForm(); renderOutput();
      }));
    wrap.querySelectorAll(".eg-rep-del").forEach((b) =>
      b.addEventListener("click", () => {
        const id = b.dataset.rep, ri = Number(b.dataset.ri);
        const arr = state.data[id] || []; arr.splice(ri, 1); state.data[id] = arr; renderForm(); renderOutput();
      }));
    wrap.querySelectorAll("[data-sub]").forEach((el) => {
      const id = el.dataset.rep, ri = Number(el.dataset.ri), sub = el.dataset.sub;
      const ev = el.tagName === "SELECT" ? "change" : "input";
      el.addEventListener(ev, () => {
        const arr = Array.isArray(state.data[id]) ? state.data[id] : [];
        while (arr.length <= ri) arr.push({});
        arr[ri][sub] = el.value; state.data[id] = arr; renderOutput();
      });
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
        if (f.type === "repeater") {
          const rows = Array.isArray(state.data[f.id]) ? state.data[f.id] : [];
          const cleaned = rows.map((row) => {
            const o = {};
            for (const sf of (f.subfields || [])) {
              const sv = row ? row[sf.id] : undefined;
              if (sv == null || sv === "") continue;
              o[sf.id] = sf.type === "number" ? Number(sv) : sv;
            }
            return o;
          }).filter((o) => Object.keys(o).length);
          if (cleaned.length) setPath(out, f.id, cleaned);
          continue;
        }
        let v = state.data[f.id];
        if (v == null || v === "" || (Array.isArray(v) && v.length === 0)) continue;
        if (f.type === "number") { const n = Number(v); if (Number.isNaN(n)) continue; v = n; }
        setPath(out, f.id, v);
      }
    }
    return out;
  }

  // ── computed citemap level (read-only; CLI is authoritative) ──
  function computeLevel(doc) {
    const b = doc.brand || {};
    if (!(b.name && b.url)) return 0;
    const moduleKeys = Object.keys(doc).filter((k) => !["version", "brand", "trust", "@context", "@graph", "relationships"].includes(k));
    const hasModule = moduleKeys.length > 0;
    const hasAnswer = Array.isArray(doc.answerContent) ? doc.answerContent.length > 0 : !!doc.answerContent;
    const hasContract = !!(doc.trust && doc.trust.citationContract) || !!(b.notableFor);
    const hasVerified = Array.isArray(doc.verifiedClaims) ? doc.verifiedClaims.length > 0 : !!doc.verifiedClaims;
    let level = 1;
    if (hasModule && hasAnswer && hasContract) level = 2;
    if (level === 2 && hasVerified) level = 3;
    return level;
  }

  function renderOutput() {
    const doc = assemble();
    const pre = $("eg-output");
    if (pre) pre.textContent = JSON.stringify(doc, null, 2);
    const lv = $("eg-level");
    if (lv) {
      const n = computeLevel(doc);
      lv.textContent = n ? "Level " + n : "Level —";
      lv.className = "eg-level" + (n ? " lv" + n : "");
      lv.title = "Computed from what you've filled in. Run npx @citemap/cli for an authoritative level.";
    }
  }

  // ── download / copy ──
  function download() {
    const blob = new Blob([JSON.stringify(assemble(), null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = "citemap.json";
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
  function getPath(obj, path) { return path.split(".").reduce((o, k) => (o == null ? undefined : o[k]), obj); }
  function validate() {
    const out = $("eg-val-result");
    const raw = $("eg-val-input").value.trim();
    if (!raw) { out.innerHTML = ""; out.className = "eg-val"; return; }
    let doc;
    try { doc = JSON.parse(raw); }
    catch (e) { out.className = "eg-val bad"; out.innerHTML = `<strong>Invalid JSON.</strong> ${esc(e.message)}`; return; }
    const missing = coreRequiredIds().filter((r) => {
      const v = getPath(doc, r.id);
      return v == null || v === "" || (Array.isArray(v) && !v.length);
    });
    const hasVersion = !!doc.version || !!doc.citemapVersion;
    const note = `<p class="eg-val-note">Structural check only. For authoritative validation against the full schema, run <code>npx @citemap/cli validate ./citemap.json</code>.</p>`;
    if (!hasVersion || missing.length) {
      out.className = "eg-val warn";
      out.innerHTML = `<strong>${!hasVersion ? "Missing <code>version</code>. " : ""}${missing.length ? missing.length + " required core field" + (missing.length > 1 ? "s" : "") + " missing:" : ""}</strong>` +
        (missing.length ? "<ul>" + missing.map((m) => `<li>${esc(m.label)} <code>${esc(m.id)}</code></li>`).join("") + "</ul>" : "") + note;
      return;
    }
    out.className = "eg-val ok";
    out.innerHTML = `<strong>Valid structure — Level ${computeLevel(doc)}.</strong> All required core fields present.` + note;
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
    window.__assemble = assemble;
    window.__computeLevel = computeLevel;
  });
})();
