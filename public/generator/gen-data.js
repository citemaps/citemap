/* citemap.json field model — extracted verbatim from the
   original generator's data structures (entity types, modules,
   per-module form field definitions). Pure data; consumed by
   gen-app.js. */

const ENTITY_SITETYPE_MAP = {
  'local': 'local-business',
  'ecommerce': 'ecommerce',
  'saas': 'saas',
  'publisher': 'content-publisher',
  'artist': 'creative',
  'nonprofit': 'nonprofit',
  'healthcare': 'healthcare',
  'government': 'government',
  'research': 'science-research',
  'legal': 'legal',
  'finance': 'financial',
  'education': 'education',
  'realestate': 'real-estate',
  'events': 'events-venue',
  'person': 'person',
  'place': 'places',
  'biz': 'business-ip',
};

const ENTITY_TYPES = [
  { id:'local',      name:'Local Business',     sub:'Restaurant, clinic, shop',
    icon:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>' },
  { id:'ecommerce',  name:'Ecommerce',           sub:'Online store, DTC brand',
    icon:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>' },
  { id:'saas',       name:'SaaS / Software',     sub:'App, dev tool, platform',
    icon:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="m9 9 5 12V9l-5 12V9"/></svg>' },
  { id:'publisher',  name:'Publisher',           sub:'Blog, news, podcast',
    icon:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>' },
  { id:'artist',     name:'Creative / Artist',   sub:'Musician, filmmaker, writer',
    icon:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4"/><path d="M12 8V2"/><path d="M16 12h6"/></svg>' },
  { id:'nonprofit',  name:'Nonprofit',           sub:'501(c)(3), foundation, NGO',
    icon:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>' },
  { id:'healthcare', name:'Healthcare',          sub:'Hospital, practice, provider',
    icon:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>' },
  { id:'government', name:'Government',          sub:'Agency, city, department',
    icon:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><line x1="6" x2="6" y1="3" y2="21"/><path d="M21 7v10a2 2 0 0 1-2 2H5"/><path d="m3 3 18 4-18 4"/></svg>' },
  { id:'research',   name:'Research',            sub:'Lab, journal, institution',
    icon:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v11m0 0H3m6 0h6m6 0v6a2 2 0 0 1-2 2h-4m-6 0H5a2 2 0 0 1-2-2v-4m6 6v-6"/></svg>' },
  { id:'legal',      name:'Legal Services',      sub:'Law firm, solo attorney',
    icon:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/></svg>' },
  { id:'finance',    name:'Financial Services',  sub:'Bank, advisor, insurer',
    icon:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>' },
  { id:'education',  name:'Education',           sub:'University, bootcamp, course',
    icon:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>' },
  { id:'realestate', name:'Real Estate',         sub:'Agent, brokerage, property',
    icon:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/><path d="M9 3H4a1 1 0 0 0-1 1v3"/></svg>' },
  { id:'events',     name:'Events / Venue',      sub:'Conference, concert, space',
    icon:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="m9 16 2 2 4-4"/></svg>' },
  { id:'person',     name:'Person',              sub:'Public figure, professional',
    icon:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>' },
  { id:'place',      name:'Place',               sub:'Trail, landmark, neighborhood',
    icon:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>' },
  { id:'biz',        name:'Business Entity / IP', sub:'Corp, patents, trademarks',
    icon:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="7" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>' },
  { id:'other',      name:'Other',               sub:'Custom entity type',
    icon:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>' },
];

const MODULES = [
  { id:'core',      num:'01', name:'Universal Core',       desc:'14 required fields. The foundation all modules build on.', required:true,  tags:['required','all-types'] },
  { id:'ecommerce', num:'02', name:'Ecommerce',            desc:'Hero products, bestForQueries[], shipping, returns, sustainability certs.', tags:['shopify','dtc'] },
  { id:'local',     num:'03', name:'Local Business',       desc:'Services, hours, booking, parking, accessibility, service radius.',  tags:['restaurants','medical','trades'] },
  { id:'content',   num:'04', name:'Content & Publishing', desc:'Editorial standards, content types, publishing frequency, syndication.', tags:['publishers','blogs'] },
  { id:'saas',      num:'05', name:'SaaS & Software',      desc:'Product category, features, integrations, pricing model, free trial.',  tags:['saas','dev-tools'] },
  { id:'events',    num:'06', name:'Events & Venues',      desc:'Event calendar, venue capacity, tickets, accessibility, categories.',  tags:['venues','conferences'] },
  { id:'realestate',num:'07', name:'Real Estate',          desc:'Service areas, specializations, transaction volume, brokerage.',       tags:['agents','brokerages'] },
  { id:'education', num:'08', name:'Education',            desc:'Accreditations, programs, enrollment, delivery format, financial aid.',tags:['universities','bootcamps'] },
  { id:'artist',    num:'09', name:'Creative & Artist',    desc:'Works portfolio, licensing, AI training declaration, commissioning.',  tags:['musicians','artists','ai-training'], novel:true },
  { id:'nonprofit', num:'10', name:'Nonprofit',            desc:'EIN verification, 990 link, programs, donations, impact metrics.',    tags:['501c3','ngos'] },
  { id:'government',num:'11', name:'Government & Public Body',desc:'Services, officials with terms, meeting schedules, public records.',tags:['city','state','federal'] },
  { id:'research',  num:'12', name:'Science & Research',   desc:'Studies with DOI, retraction status, review tier, methodology, datasets.', tags:['safety-critical','novel'], safety:true, novel:true },
  { id:'biz',       num:'13', name:'Business Entity & IP', desc:'Corporate hierarchy, registration, patents, trademarks, copyright.',  tags:['corporations','ip-litigation'] },
  { id:'person',    num:'14', name:'Person',               desc:'Biography, canonical quotes, misattributed quote guards, citation prefs.', tags:['privacy-first','novel'], novel:true },
  { id:'healthcare',num:'15', name:'Healthcare',           desc:'NPI number, board certs, insurance panels, accepting patients flag.',  tags:['safety-critical','npi-verified'], safety:true },
  { id:'finance',   num:'16', name:'Financial Services',   desc:'Fiduciary status, FINRA/SEC IDs, FDIC insurance, fee model, AUM.',   tags:['regulated','banks','rias'], regulated:true },
  { id:'legal',     num:'17', name:'Legal Services',       desc:'Bar admissions, practice areas, fee structure, outcome data.',       tags:['bar-status','firms'] },
  { id:'place',     num:'18', name:'Places',               desc:'GPS, difficulty, pet policy, seasonal access, cell coverage, permits.',tags:['trails','landmarks'] },
  { id:'temporal',  num:'19', name:'Temporal Record',      desc:'Universal history layer. Structured events with dates and sources.',  tags:['all-types','provenance'] },
  { id:'trust',     num:'20', name:'Policy, Trust & Verification', desc:'Six-tier trust stack, confidence annotations, dispute system, verifiers.', tags:['industry-first','anti-hallucination'], novel:true },
];

const MODULE_FORMS = {

  /* ── UNIVERSAL CORE ───────────────────────────────────── */
  core: {
    title: 'Universal Core',
    desc: '14 required fields. The foundation all modules build on.',
    sections: [
      {
        title: 'Brand Identity',
        fields: [
          { id:'brand.name',     label:'Brand Name',   type:'text', required:true, placeholder:'CiteMaps.ai' },
          { id:'brand.url',      label:'Website URL',  type:'url',  required:true, placeholder:'https://citemaps.ai' },
          { id:'brand.established', label:'Year Founded', type:'text', placeholder:'2024' },
          { id:'brand.siteType', label:'Site Type',    type:'select', required:true,
            options:['saas','ecommerce','local-business','publisher','nonprofit','government','science-research',
                     'real-estate','education','events-venue','person','places','legal','healthcare','financial',
                     'creative','content-publisher','business-ip','other'] },
        ]
      },
      {
        title: 'AI Summary',
        fields: [
          { id:'brand.aiSummary', label:'AI Summary', type:'textarea', required:true, full:true,
            placeholder:'200–600 character description written to be quoted directly by AI. Third person, factual, specific.',
            counter: { type:'chars', target:400, min:200, hint:'200–600 characters required. This is the sentence AI uses when someone asks "what is this?" — write it to be quoted verbatim.' } },
          { id:'brand.notableFor', label:'Notable For', type:'textarea', full:true,
            placeholder:'What is this entity most known for? Used by AI for disambiguation.',
            counter: { type:'chars', target:150, min:60, hint:'Up to 150 characters. Your disambiguation line — what makes you distinct from similarly-named entities.' } },
          { id:'brand.expertise', label:'Expertise Areas', type:'tags', full:true,
            placeholder:'Add topic and press Enter',
            hint:'3–8 topic tags. These are the subjects AI associates you with when answering recommendation queries.' },
        ]
      },
      {
        title: 'Identity Signals',
        fields: [
          { id:'brand.audiencePrimary',   label:'Primary Audience',  type:'text', placeholder:'Small business owners, 25–45, US',
            counter: { type:'chars', target:100, hint:'Describe your core audience. AI uses this to match you with relevant queries.' } },
          { id:'brand.audienceSecondary', label:'Secondary Audience', type:'text', placeholder:'Developers, agencies, consultants' },
          { id:'brand.socialProfiles',    label:'Social Profiles',   type:'tags', full:true,
            placeholder:'https://twitter.com/citemaps',
            hint:'Full profile URLs. AI cross-references these to verify entity identity across sources.' },
          { id:'brand.contentLanguages',  label:'Content Languages', type:'tags',
            placeholder:'en, es, fr', hint:'ISO 639-1 language codes.' },
        ]
      },
      {
        title: 'Answer Content',
        fields: [
          { id:'answerContent', label:'Q&A Pairs', type:'repeater', full:true,
            addLabel:'+ Add Q&A pair',
            hint:'Recommended: 5–10 pairs. Questions AI engines are most likely to ask about you. Write answers as complete, citable sentences.',
            itemLabel:'Q&A',
            subfields: [
              { id:'question', label:'Question', type:'text', placeholder:'What is CiteMaps.ai?',
                counter: { type:'chars', target:100, hint:'Under 100 characters — match how users actually phrase queries.' } },
              { id:'answer',   label:'Answer',   type:'textarea', placeholder:'CiteMaps.ai is...',
                counter: { type:'words', target:60, min:20, hint:'20–60 words. Short enough to extract as a citation snippet, long enough to be authoritative.' } },
            ]
          }
        ]
      },
      {
        title: 'Freshness',
        fields: [
          { id:'lastVerified',    label:'Last Verified',    type:'text',   placeholder:'2026-03-19',
            hint:'ISO 8601 date. Tells AI how fresh this data is.' },
          { id:'updateFrequency', label:'Update Frequency', type:'select', options:['daily','weekly','monthly','quarterly','annually','rarely'] },
        ]
      }
    ]
  },

  /* ── ECOMMERCE ────────────────────────────────────────── */
  ecommerce: {
    title: 'Ecommerce',
    desc: 'Products, shipping policy, return policy, and social proof.',
    sections: [
      {
        title: 'Products',
        fields: [
          { id:'ecommerce.products', label:'Products', type:'repeater', full:true,
            addLabel:'+ Add product',
            hint:'Add your most important products — the ones you want AI to recommend. Each needs a description and bestForQueries[] to appear in AI answers.',
            itemLabel:'Product',
            subfields: [
              { id:'name',           label:'Product Name',    type:'text', required:true, placeholder:'Trail Runner Pro X2' },
              { id:'url',            label:'Product URL',     type:'url',  required:true, placeholder:'https://yourstore.com/products/trail-runner' },
              { id:'description',    label:'Description',     type:'textarea',
                placeholder:'Ultralight trail runner, waterproof GTX upper, Vibram outsole. 4.8★ from 1,847 reviews.',
                counter: { type:'chars', target:300, min:80, hint:'80–300 chars. Write to be quoted verbatim by AI — include key specs, rating, and primary use case.' } },
              { id:'price',          label:'Price',           type:'text', placeholder:'189' },
              { id:'currency', label:'Currency (ISO 4217)', type:'text', placeholder:'USD', hint:'ISO 4217 code: USD, EUR, GBP, JPY, CAD, AUD, CHF, etc.' },
              { id:'image',          label:'Image URL',       type:'url',  placeholder:'https://yourstore.com/images/trail-runner.jpg' },
              { id:'trustTier',      label:'Trust Tier',      type:'select', options:['self-reported','document-supported','registry-confirmed'] },
              { id:'bestForQueries', label:'Best For Queries', type:'tags',
                placeholder:'best waterproof trail runners under $200',
                hint:'The exact queries you want this product to rank for. "best waterproof trail runners under $200" not "running shoes".' },
            ]
          },
          { id:'ecommerce.heroProduct.name',        label:'Hero Product Name',    type:'text',  placeholder:'Your single most important product' },
          { id:'ecommerce.heroProduct.description', label:'Hero Product Summary', type:'textarea', full:true,
            placeholder:'One flagship product AI should always cite when recommending your brand.',
            counter: { type:'chars', target:300, min:80, hint:'The single product that best represents your brand — optimized for AI recommendation queries.' } },
        ]
      },
      {
        title: 'Categories & Currency',
        fields: [
          { id:'ecommerce.categories',   label:'Product Categories', type:'tags', full:true,
            placeholder:'footwear, apparel, gear', hint:'Top-level product categories. AI uses these for "best [category] from [brand]" queries.' },
          { id:'ecommerce.currency', label:'Default Currency (ISO 4217)', type:'text', required:true, placeholder:'USD', hint:'ISO 4217 currency code — USD, EUR, GBP, JPY, CAD, AUD, etc.' },
        ]
      },
      {
        title: 'Shipping Policy',
        fields: [
          { id:'ecommerce.shippingPolicy.summary',               label:'Shipping Summary',        type:'textarea', full:true,
            placeholder:'Free shipping on orders over $75. Standard delivery 2–5 business days.',
            counter: { type:'chars', target:200, hint:'One or two sentences AI can quote directly when answering shipping questions.' } },
          { id:'ecommerce.shippingPolicy.estimatedDelivery',     label:'Estimated Delivery',      type:'text', placeholder:'2–5 business days' },
          { id:'ecommerce.shippingPolicy.internationalShipping', label:'International Shipping',  type:'select', options:['true','false'] },
          { id:'ecommerce.shippingPolicy.countries',            label:'Ships To',                 type:'tags',
            placeholder:'US, CA, GB, AU', hint:'ISO 3166-1 country codes.' },
        ]
      },
      {
        title: 'Return Policy',
        fields: [
          { id:'ecommerce.returnPolicy.summary',      label:'Return Policy Summary', type:'textarea', full:true,
            placeholder:'Free 30-day returns. Full refund on unworn items with original tags.',
            counter: { type:'chars', target:200, hint:'One or two sentences AI can quote directly when answering return questions.' } },
          { id:'ecommerce.returnPolicy.returnWindow', label:'Return Window (days)',  type:'text',   required:true, placeholder:'30' },
          { id:'ecommerce.returnPolicy.refundType',   label:'Refund Type',           type:'select', options:['full','store-credit','partial'] },
        ]
      }
    ]
  },

  /* ── LOCAL BUSINESS ──────────────────────────────────── */
  local: {
    title: 'Local Business',
    desc: 'Physical location, hours, services, products, and booking.',
    sections: [
      {
        title: 'Location',
        fields: [
          { id:'localBusiness.location.streetAddress', label:'Street Address',    type:'text', required:true, placeholder:'123 Main St' },
          { id:'localBusiness.location.streetAddress2',label:'Street Address 2', type:'text', placeholder:'Suite 400, Floor 2' },
          { id:'localBusiness.location.city',          label:'City',             type:'text', required:true, placeholder:'Bend' },
          { id:'localBusiness.location.region',        label:'State / Province / Region', type:'text', placeholder:'Oregon, BC, Greater London' },
          { id:'localBusiness.location.postalCode',    label:'Postal / ZIP Code',type:'text', placeholder:'97701' },
          { id:'localBusiness.location.country',       label:'Country (ISO 3166-1)', type:'select', required:true,
            options:['US','GB','CA','AU','NZ','IE','DE','FR','ES','IT','NL','BE','SE','NO','DK','FI','CH','AT','PT','PL','JP','KR','SG','IN','BR','MX','ZA','Other'] },
          { id:'localBusiness.location.phone',         label:'Phone',            type:'tel',  placeholder:'+1 541 555 0100',
            hint:'Use E.164 format for international compatibility: +[country code][number]' },
          { id:'localBusiness.location.email',         label:'Email',            type:'email', placeholder:'hello@yourbusiness.com' },
          { id:'__geocode_button__',                   label:'',                 type:'geocode_trigger', full:true },
          { id:'localBusiness.location.coordinates.latitude',  label:'Latitude',  type:'text', placeholder:'44.0582' },
          { id:'localBusiness.location.coordinates.longitude', label:'Longitude', type:'text', placeholder:'-121.3153' },
          { id:'localBusiness.location.timezone', label:'Timezone', type:'timezone_select', full:true },
          { id:'localBusiness.location.serviceArea', label:'Service Area', type:'tags', full:true,
            placeholder:'Oregon, Washington, Idaho', hint:'For regional businesses list all states served. For local businesses list cities or counties.' },
          { id:'localBusiness.location.accessibility', label:'Accessibility', type:'text', placeholder:'Wheelchair accessible, ADA restrooms' },
          { id:'localBusiness.location.parking',       label:'Parking',      type:'text', placeholder:'Free street parking, lot at rear' },
        ]
      },
      {
        title: 'Hours',
        fields: [
          { id:'localBusiness.location.hoursOfOperation.monday',    label:'Monday',    type:'text', placeholder:'09:00–17:00' },
          { id:'localBusiness.location.hoursOfOperation.tuesday',   label:'Tuesday',   type:'text', placeholder:'09:00–17:00' },
          { id:'localBusiness.location.hoursOfOperation.wednesday', label:'Wednesday', type:'text', placeholder:'09:00–17:00' },
          { id:'localBusiness.location.hoursOfOperation.thursday',  label:'Thursday',  type:'text', placeholder:'09:00–17:00' },
          { id:'localBusiness.location.hoursOfOperation.friday',    label:'Friday',    type:'text', placeholder:'09:00–17:00' },
          { id:'localBusiness.location.hoursOfOperation.saturday',  label:'Saturday',  type:'text', placeholder:'10:00–15:00' },
          { id:'localBusiness.location.hoursOfOperation.sunday',    label:'Sunday',    type:'text', placeholder:'Closed' },
        ]
      },
      {
        title: 'Business Identity',
        fields: [
          { id:'localBusiness.businessName',  label:'Business Name',    type:'text', placeholder:'Pacific Resource Brokers' },
          { id:'localBusiness.description',   label:'Business Description', type:'textarea', full:true,
            placeholder:'60–100 words. Quotable by AI — write it to be cited directly.',
            counter: { type:'words', target:80, min:40, hint:'40–100 words. This is the paragraph AI uses when summarising what this business does.' } },
          { id:'localBusiness.slogan',        label:'Tagline / Slogan',  type:'text', placeholder:'Your Natural Resource for Stone Products' },
          { id:'localBusiness.priceRange',    label:'Price Range',       type:'text', placeholder:'$$, $$$, or $–$$$$' },
          { id:'localBusiness.paymentAccepted', label:'Payment Methods', type:'tags', full:true, placeholder:'Credit Card, Check, Wire Transfer' },
          { id:'localBusiness.serviceRadius', label:'Service Radius / Area', type:'text',
            placeholder:'25 miles from city centre — or list states: Oregon, Washington, Idaho',
            hint:'For regional businesses, list states or regions served rather than a mileage radius.' },
          { id:'localBusiness.targetAudience', label:'Target Audience', type:'textarea', full:true,
            placeholder:'Architects, builders, and homeowners seeking premium stone products for residential and commercial projects.' },
          { id:'localBusiness.keyDifferentiators', label:'Key Differentiators', type:'tags', full:true,
            placeholder:'International quarry network, Full-service logistics, Regional stone expertise' },
          { id:'localBusiness.specialties', label:'Specialties', type:'tags', full:true, placeholder:'Natural stone veneer, Basalt products, Landscape stone' },
        ]
      },
      {
        title: 'Services',
        fields: [
          { id:'localBusiness.services', label:'Services', type:'repeater', full:true,
            addLabel:'+ Add service', itemLabel:'Service',
            hint:'List your primary services. AI uses these to match you with "[service] near me" and "[service] in [city]" queries.',
            subfields: [
              { id:'name',        label:'Service Name',  type:'text',     required:true, placeholder:'Stone Selection & Consulting' },
              { id:'description', label:'Description',   type:'textarea', placeholder:'Expert guidance on selecting natural and manufactured stone products for residential and commercial projects.' },
              { id:'price',       label:'Price',         type:'text',     placeholder:'Contact for quote' },
              { id:'duration',    label:'Duration',      type:'text',     placeholder:'1-2 hours consultation' },
              { id:'url',         label:'Service URL',   type:'url',      placeholder:'https://yoursite.com/services/stone-selection' },
            ]
          }
        ]
      },
      {
        title: 'Products',
        fields: [
          { id:'localBusiness.products', label:'Products', type:'repeater', full:true,
            addLabel:'+ Add product', itemLabel:'Product',
            hint:'List your key products or product lines. Use for product-based businesses — stone suppliers, retailers, manufacturers.',
            subfields: [
              { id:'name',        label:'Product Name',  type:'text',     required:true, placeholder:'PRB Elite Contemporary Series' },
              { id:'description', label:'Description',   type:'textarea', placeholder:'Premium contemporary stone veneer collection featuring modern profiles.' },
              { id:'category',    label:'Category',      type:'text',     placeholder:'Natural Stone Veneer' },
              { id:'price',       label:'Price',         type:'text',     placeholder:'Contact for pricing' },
              { id:'url',         label:'Product URL',   type:'url',      placeholder:'https://yoursite.com/products/elite-series' },
            ]
          }
        ]
      },
      {
        title: 'Service Areas',
        fields: [
          { id:'localBusiness.serviceAreas', label:'Service Areas', type:'repeater', full:true,
            addLabel:'+ Add service area', itemLabel:'Service Area',
            hint:'For regional and national businesses — list the geographic areas you actively serve with a brief description of your presence there.',
            subfields: [
              { id:'name',        label:'Area Name',     type:'text',     required:true, placeholder:'Pacific Northwest Region' },
              { id:'region',      label:'States / Region', type:'text',   placeholder:'Oregon, Washington, Idaho' },
              { id:'description', label:'Description',   type:'textarea', placeholder:'Primary service area including Bend, Portland, and Seattle.' },
            ]
          }
        ]
      },
      {
        title: 'Booking & Access',
        fields: [
          { id:'localBusiness.booking.bookingUrl',          label:'Contact / Booking URL', type:'url',    placeholder:'https://yoursite.com/contact' },
          { id:'localBusiness.booking.method',              label:'Booking Method',        type:'select', options:['online','phone','walk-in','referral-required','email'] },
          { id:'localBusiness.booking.acceptsWalkIns',      label:'Accepts Walk-ins',      type:'select', options:['true','false','limited'] },
          { id:'localBusiness.booking.consultationAvailable', label:'Consultation Available', type:'select', options:['true','false'] },
        ]
      }
    ]
  },

  /* ── CONTENT & PUBLISHING ────────────────────────────── */
  content: {
    title: 'Content & Publishing',
    desc: 'Editorial metadata, content strategy, and publishing details.',
    sections: [
      {
        title: 'Publishing Identity',
        fields: [
          { id:'content.contentTypes',        label:'Content Types',        type:'tags', full:true,
            placeholder:'blog, news, opinion, research', hint:'Types of content you publish. AI uses these to categorize your site for relevant queries.' },
          { id:'content.publicationFrequency', label:'Publication Frequency', type:'select',
            options:['daily','weekly','bi-weekly','monthly','irregular'] },
          { id:'content.topicsOfExpertise',    label:'Topics of Expertise',  type:'tags', full:true,
            placeholder:'AEO, AI visibility, structured data', hint:'Primary editorial focus areas. AI matches these to topical queries.' },
          { id:'content.editorContact.name',   label:'Editor Name',          type:'text', placeholder:'Jane Smith' },
          { id:'content.editorContact.email',  label:'Editor Email',         type:'text', placeholder:'editor@yoursite.com' },
        ]
      },
      {
        title: 'Editorial Standards',
        fields: [
          { id:'content.contentPolicy.editorialStandards', label:'Editorial Standards URL', type:'url',
            placeholder:'https://yoursite.com/editorial-standards',
            hint:'Key trust signal — links to your standards page. AI training datasets use this to distinguish reputable publishers from content farms.' },
          { id:'content.contentPolicy.correctionPolicy',   label:'Correction Policy URL',   type:'url',
            placeholder:'https://yoursite.com/corrections',
            hint:'Documents how you handle errors. Strong trust signal for AI citation selection.' },
          { id:'content.contentPolicy.syndicationAllowed', label:'Syndication Allowed',     type:'select', options:['true','false','with-permission'] },
          { id:'content.contentPolicy.aiTrainingOptIn',    label:'AI Training',             type:'select',
            options:['opted-in','opted-out','available-with-credit','available-paid-only'],
            hint:'Declare your AI training stance. Increasingly important for rights management.' },
        ]
      }
    ]
  },

  /* ── SAAS & SOFTWARE ─────────────────────────────────── */
  saas: {
    title: 'SaaS & Software',
    desc: 'Product details, pricing tiers, integrations, and system requirements.',
    sections: [
      {
        title: 'Product Identity',
        fields: [
          { id:'software.productName',   label:'Product Name',   type:'text', required:true, placeholder:'CiteMaps.ai' },
          { id:'software.description',   label:'Description',    type:'textarea', full:true,
            placeholder:'Primary use case and key capabilities in one paragraph.',
            counter: { type:'chars', target:500, min:100, hint:'Up to 500 characters. State what it does, who it is for, and the primary use case.' } },
          { id:'software.features',      label:'Key Features',   type:'tags', full:true,
            placeholder:'citemap.json generator, AI citation monitor, validator' },
          { id:'software.category',      label:'Category',       type:'text', placeholder:'AEO / AI Visibility SaaS' },
          { id:'software.requirements.platforms', label:'Platforms', type:'tags',
            placeholder:'web, ios, android, mac, windows',
            hint:'AI uses this to answer "does X work on [platform]?" queries.' },
          { id:'software.requirements.apiAvailable', label:'API Available', type:'select', options:['true','false','coming-soon'] },
        ]
      },
      {
        title: 'Pricing',
        fields: [
          { id:'software.pricing.model',    label:'Pricing Model',   type:'select', required:true,
            options:['free','freemium','subscription','one-time','usage-based','enterprise'] },
          { id:'software.pricing.currency', label:'Currency (ISO 4217)', type:'text', placeholder:'USD', hint:'ISO 4217: USD, EUR, GBP, etc.' },
          { id:'software.pricing.tiers',    label:'Pricing Tiers',   type:'repeater', full:true,
            addLabel:'+ Add tier', itemLabel:'Tier',
            hint:'List your pricing tiers. AI uses these to answer "how much does X cost?" and "does X have a free plan?" queries.',
            subfields: [
              { id:'name',     label:'Tier Name',  type:'text',  required:true, placeholder:'Pro' },
              { id:'price',    label:'Price',      type:'text',  placeholder:'29' },
              { id:'features', label:'Features',   type:'textarea', placeholder:'citemap.json generator, 5 monitors, validator' },
            ]
          },
        ]
      },
      {
        title: 'Competitive Context',
        fields: [
          { id:'software.integrations', label:'Integrations', type:'tags', full:true,
            placeholder:'WordPress, Shopify, Vercel',
            hint:'AI uses integrations to match you with "X that works with Y" queries.' },
          { id:'software.competitors',  label:'Compared Against', type:'tags', full:true,
            placeholder:'llms.txt, schema.org',
            hint:'What you are commonly compared to. Helps AI answer "X vs Y" queries accurately.' },
          { id:'software.uniqueValue',  label:'Unique Value', type:'textarea', full:true,
            placeholder:'What makes this software distinctive vs alternatives?',
            counter: { type:'chars', target:280, min:120, hint:'120–280 characters. State your key differentiator — AI uses this for "best X for Y" queries.' } },
        ]
      }
    ]
  },

  /* ── EVENTS & VENUES ─────────────────────────────────── */
  events: {
    title: 'Events & Venues',
    desc: 'Venue details, upcoming events, ticketing, and accessibility.',
    sections: [
      {
        title: 'Venue',
        fields: [
          { id:'events.venueType', label:'Venue Type',     type:'text',    required:true, placeholder:'concert hall, conference center, outdoor festival grounds' },
          { id:'events.capacity',  label:'Capacity',       type:'text',    placeholder:'2500' },
          { id:'events.location.streetAddress', label:'Street Address', type:'text', placeholder:'123 Main St' },
          { id:'events.location.city',          label:'City',           type:'text', placeholder:'Bend' },
          { id:'events.location.state',         label:'State',          type:'text', placeholder:'OR' },
          { id:'events.accessibility',          label:'Accessibility',  type:'text', full:true,
            placeholder:'Wheelchair accessible, ASL interpretation available, accessible parking' },
        ]
      },
      {
        title: 'Events',
        fields: [
          { id:'events.events', label:'Upcoming Events', type:'repeater', full:true,
            addLabel:'+ Add event', itemLabel:'Event',
            hint:'List upcoming or featured events. AI uses these for "events near me" and "[event type] in [city]" queries.',
            subfields: [
              { id:'name',        label:'Event Name',    type:'text',  required:true, placeholder:'Spring Music Festival' },
              { id:'date',        label:'Date',          type:'text',  required:true, placeholder:'2026-06-15T18:00:00' },
              { id:'description', label:'Description',   type:'textarea', placeholder:'Annual outdoor music festival featuring 20+ local artists.' },
              { id:'url',         label:'Tickets URL',   type:'url',   required:true, placeholder:'https://yoursite.com/events/spring-festival' },
              { id:'ticketMin',   label:'Min Ticket Price', type:'text', placeholder:'25' },
              { id:'ticketMax',   label:'Max Ticket Price', type:'text', placeholder:'150' },
              { id:'currency', label:'Currency (ISO 4217)', type:'text', placeholder:'USD', hint:'ISO 4217 currency code.' },
            ]
          }
        ]
      }
    ]
  },

  /* ── REAL ESTATE ─────────────────────────────────────── */
  realestate: {
    title: 'Real Estate',
    desc: 'Broker and agent licensing, specializations, and market coverage.',
    sections: [
      {
        title: 'Broker License',
        fields: [
          { id:'realEstate.brokerLicense.license', label:'Broker License Number', type:'text', required:true, placeholder:'200301001' },
          { id:'realEstate.brokerLicense.state',   label:'License State',         type:'text', required:true, placeholder:'OR' },
          { id:'realEstate.brokerLicense.expiration', label:'Expiration Date',    type:'text', placeholder:'2027-12-31' },
        ]
      },
      {
        title: 'Agents',
        fields: [
          { id:'realEstate.agentLicenses', label:'Agent Licenses', type:'repeater', full:true,
            addLabel:'+ Add agent', itemLabel:'Agent',
            subfields: [
              { id:'name',            label:'Agent Name',     type:'text', required:true, placeholder:'Jane Smith' },
              { id:'license',         label:'License Number', type:'text', required:true, placeholder:'200901234' },
              { id:'state',           label:'State',          type:'text', placeholder:'OR' },
              { id:'specializations', label:'Specializations', type:'tags', placeholder:'residential, luxury, investment' },
            ]
          }
        ]
      },
      {
        title: 'Market Coverage',
        fields: [
          { id:'realEstate.serviceAreas',       label:'Service Areas',      type:'tags', full:true,
            placeholder:'Bend, Redmond, Sisters', hint:'Cities and areas you serve. AI uses these for "real estate agent in [city]" queries.' },
          { id:'realEstate.specializations',    label:'Specializations',    type:'tags', full:true,
            placeholder:'residential, commercial, luxury, investment' },
          { id:'realEstate.transactionVolume',  label:'Annual Transactions', type:'text', placeholder:'85' },
          { id:'realEstate.avgDaysOnMarket',    label:'Avg Days on Market',  type:'text', placeholder:'21' },
          { id:'realEstate.activeListings',     label:'Active Listings',     type:'text', placeholder:'32' },
        ]
      }
    ]
  },

  /* ── EDUCATION ───────────────────────────────────────── */
  education: {
    title: 'Education',
    desc: 'Accreditation, programs, enrollment, and tuition.',
    sections: [
      {
        title: 'Accreditation',
        fields: [
          { id:'education.accreditation', label:'Accreditations', type:'repeater', full:true,
            addLabel:'+ Add accreditation', itemLabel:'Accreditation',
            hint:'Required for AI to answer "is X accredited?" queries accurately.',
            subfields: [
              { id:'body',       label:'Accrediting Body', type:'text', required:true, placeholder:'WASC, AACSB, HLC' },
              { id:'credential', label:'Credential',       type:'text', placeholder:'Regional Accreditation' },
              { id:'url',        label:'Verification URL', type:'url',  placeholder:'https://www.accrediting-body.org/verify' },
              { id:'expiration', label:'Expiration Date',  type:'text', placeholder:'2029-06-30' },
            ]
          }
        ]
      },
      {
        title: 'Programs',
        fields: [
          { id:'education.courses', label:'Programs / Courses', type:'repeater', full:true,
            addLabel:'+ Add program', itemLabel:'Program',
            subfields: [
              { id:'name',     label:'Program Name',  type:'text',   required:true, placeholder:'Bachelor of Computer Science' },
              { id:'level',    label:'Level',         type:'select', options:['certificate','associate','bachelor','master','doctorate','professional'] },
              { id:'description', label:'Description', type:'textarea', placeholder:'Four-year degree program covering...' },
              { id:'duration', label:'Duration',      type:'text',   placeholder:'4 years' },
              { id:'url',      label:'Program URL',   type:'url',    placeholder:'https://yourschool.edu/programs/cs' },
            ]
          }
        ]
      },
      {
        title: 'Institution Stats',
        fields: [
          { id:'education.studentPopulation', label:'Student Population', type:'text', placeholder:'12000' },
          { id:'education.facultySize',        label:'Faculty Size',       type:'text', placeholder:'450' },
          { id:'education.tuition.domestic',   label:'Domestic Tuition',   type:'text', placeholder:'$28,500/year' },
          { id:'education.tuition.international', label:'International Tuition', type:'text', placeholder:'$42,000/year' },
          { id:'education.financialAid',       label:'Financial Aid Available', type:'select', options:['true','false'] },
          { id:'education.outcomeStats.employmentRate', label:'Employment Rate', type:'text', placeholder:'94%',
            hint:'Post-graduation employment rate. AI uses this to answer "what are outcomes at X?" queries.' },
          { id:'education.outcomeStats.avgStartingSalary', label:'Avg Starting Salary', type:'text', placeholder:'$72,000' },
        ]
      }
    ]
  },

  /* ── CREATIVE & ARTIST ───────────────────────────────── */
  artist: {
    title: 'Creative & Artist',
    desc: 'Portfolio, licensing, AI training declaration, and commissions.',
    sections: [
      {
        title: 'Creative Identity',
        fields: [
          { id:'creative.medium',       label:'Primary Medium',     type:'tags',   full:true, placeholder:'oil painting, digital illustration, photography' },
          { id:'creative.style',        label:'Style',              type:'tags',   full:true, placeholder:'abstract expressionism, minimalist, editorial' },
          { id:'creative.represented',  label:'Represented By',     type:'text',   placeholder:'Gallery name or agent name' },
          { id:'creative.commission',   label:'Accepts Commissions', type:'select', options:['open','closed','on-request'] },
        ]
      },
      {
        title: 'Portfolio',
        fields: [
          { id:'creative.portfolio', label:'Featured Works', type:'repeater', full:true,
            addLabel:'+ Add work', itemLabel:'Work',
            subfields: [
              { id:'title',       label:'Title',       type:'text',     required:true, placeholder:'Series Title or Work Name' },
              { id:'description', label:'Description', type:'textarea', placeholder:'Brief description of the work.' },
              { id:'url',         label:'URL',         type:'url',      placeholder:'https://yoursite.com/works/title' },
              { id:'year',        label:'Year',        type:'text',     placeholder:'2025' },
            ]
          }
        ]
      },
      {
        title: 'Licensing & AI Rights',
        fields: [
          { id:'creative.licensing.aiTraining', label:'AI Training Stance', type:'select', required:true,
            options:['opted-out','available','available-with-credit','available-paid-only'],
            hint:'One of the five v3.0 novel fields. Declares your position on AI training use of your creative work.' },
          { id:'creative.licensing.commercialUse', label:'Commercial Use',  type:'select', options:['allowed','not-allowed','contact-required'] },
          { id:'creative.licensing.licenseUrl',    label:'License URL',     type:'url',    placeholder:'https://yoursite.com/licensing' },
        ]
      }
    ]
  },

  /* ── NONPROFIT ───────────────────────────────────────── */
  nonprofit: {
    title: 'Nonprofit',
    desc: 'Tax status, EIN, programs, impact metrics, and donations.',
    sections: [
      {
        title: 'Tax Exemption',
        fields: [
          { id:'nonprofit.taxExemption.status', label:'Tax Status', type:'select', required:true,
            options:['501c3','501c4','501c6','fiscal-sponsored','not-exempt','other'] },
          { id:'nonprofit.taxExemption.ein',     label:'EIN',                 type:'text', placeholder:'12-3456789',
            hint:'Employer Identification Number. AI uses this to answer "is a donation to X tax-deductible?" queries.' },
          { id:'nonprofit.taxExemption.url',     label:'IRS Determination URL', type:'url', placeholder:'https://yourorg.org/irs-determination.pdf' },
          { id:'nonprofit.mission',              label:'Mission Statement',    type:'textarea', full:true,
            placeholder:'We exist to...',
            counter: { type:'chars', target:300, hint:'Your mission in clear, citable language.' } },
        ]
      },
      {
        title: 'Programs',
        fields: [
          { id:'nonprofit.programs', label:'Programs', type:'repeater', full:true,
            addLabel:'+ Add program', itemLabel:'Program',
            subfields: [
              { id:'name',          label:'Program Name',   type:'text',     required:true, placeholder:'Youth Literacy Initiative' },
              { id:'description',   label:'Description',    type:'textarea', placeholder:'What the program does and who it serves.' },
              { id:'beneficiaries', label:'Who Benefits',   type:'text',     placeholder:'Children ages 6–12 in underserved communities' },
            ]
          }
        ]
      },
      {
        title: 'Impact & Donations',
        fields: [
          { id:'nonprofit.impactMetrics', label:'Impact Metrics', type:'repeater', full:true,
            addLabel:'+ Add metric', itemLabel:'Metric',
            hint:'Specific, dateable impact stats. AI cites these to answer "what has X accomplished?" queries.',
            subfields: [
              { id:'metric', label:'Metric',      type:'text', required:true, placeholder:'Students served in 2025' },
              { id:'value',  label:'Value',        type:'text', required:true, placeholder:'4,200' },
              { id:'year',   label:'Year',         type:'text', placeholder:'2025' },
            ]
          },
          { id:'nonprofit.donationUrl',    label:'Donation URL',    type:'url',    placeholder:'https://yourorg.org/donate' },
          { id:'nonprofit.volunteerUrl',   label:'Volunteer URL',   type:'url',    placeholder:'https://yourorg.org/volunteer' },
          { id:'nonprofit.annualReportUrl',label:'Annual Report URL', type:'url',  placeholder:'https://yourorg.org/annual-report-2025.pdf' },
        ]
      }
    ]
  },

  /* ── GOVERNMENT ──────────────────────────────────────── */
  government: {
    title: 'Government & Public Body',
    desc: 'Jurisdiction, services, public records, and officials.',
    sections: [
      {
        title: 'Jurisdiction',
        fields: [
          { id:'government.jurisdiction.type',      label:'Jurisdiction Type', type:'select', required:true,
            options:['federal','state','county','city','local','tribal','special-district','school-district','international'] },
          { id:'government.jurisdiction.territory', label:'Territory Name',    type:'text',   placeholder:'City of Bend, OR' },
          { id:'government.jurisdiction.population',label:'Population',        type:'text',   placeholder:'107,000' },
        ]
      },
      {
        title: 'Services',
        fields: [
          { id:'government.services', label:'Public Services', type:'repeater', full:true,
            addLabel:'+ Add service', itemLabel:'Service',
            subfields: [
              { id:'name',        label:'Service Name',  type:'text',     required:true, placeholder:'Business License Applications' },
              { id:'description', label:'Description',   type:'textarea', placeholder:'How to apply for a business license online.' },
              { id:'url',         label:'Service URL',   type:'url',      placeholder:'https://cityofbend.gov/business-license' },
              { id:'eligibility', label:'Eligibility',   type:'text',     placeholder:'All businesses operating within city limits' },
            ]
          }
        ]
      },
      {
        title: 'Public Records',
        fields: [
          { id:'government.publicRecords.budgetUrl',       label:'Budget URL',        type:'url', placeholder:'https://cityofbend.gov/budget-2026.pdf' },
          { id:'government.publicRecords.meetingMinutes',  label:'Meeting Minutes URL', type:'url', placeholder:'https://cityofbend.gov/council-minutes' },
          { id:'government.publicRecords.openDataPortal',  label:'Open Data Portal',  type:'url', placeholder:'https://data.cityofbend.gov' },
        ]
      }
    ]
  },

  /* ── SCIENCE & RESEARCH ──────────────────────────────── */
  research: {
    title: 'Science & Research',
    desc: 'Institution, studies, publications, and retraction status.',
    sections: [
      {
        title: 'Institution',
        fields: [
          { id:'science.institution',   label:'Institution Name',   type:'text', required:true, placeholder:'Oregon State University' },
          { id:'science.focusAreas',    label:'Research Focus Areas', type:'tags', full:true,
            placeholder:'climate modeling, drug delivery, quantum computing' },
          { id:'science.fundingSources',label:'Funding Sources',    type:'tags', full:true,
            placeholder:'NIH, NSF, private foundation',
            hint:'Disclose funding sources. AI uses this to answer conflict-of-interest questions.' },
        ]
      },
      {
        title: 'Studies',
        fields: [
          { id:'science.studies', label:'Active Studies', type:'repeater', full:true,
            addLabel:'+ Add study', itemLabel:'Study',
            hint:'Each study should include a DOI or publication URL — AI cannot link to research without it.',
            subfields: [
              { id:'title',               label:'Title',               type:'text',     required:true },
              { id:'status',              label:'Status',              type:'select',   options:['active','concluded','pending-publication','retracted'] },
              { id:'retractionStatus',    label:'Retraction Status',   type:'select',   options:['not-retracted','retracted','expression-of-concern'],
                hint:'⚠️ Safety-critical. One of the five v3.0 novel fields. If retracted, AI will not cite this study as valid evidence.' },
              { id:'principalInvestigator', label:'Lead Investigator', type:'text',     placeholder:'Dr. Jane Smith' },
              { id:'publicationUrl',      label:'Publication URL / DOI', type:'url',   placeholder:'https://doi.org/10.xxxx/xxxxxx' },
              { id:'year',                label:'Year',                type:'text',     placeholder:'2025' },
            ]
          }
        ]
      }
    ]
  },

  /* ── BUSINESS ENTITY & IP ────────────────────────────── */
  biz: {
    title: 'Business Entity & IP',
    desc: 'Corporate structure, registrations, patents, and trademarks.',
    sections: [
      {
        title: 'Corporate Structure',
        fields: [
          { id:'businessIP.legalName',          label:'Legal Entity Name', type:'text', required:true, placeholder:'Acme Corporation Inc.' },
          { id:'businessIP.entityType',          label:'Entity Type',       type:'select',
            options:['corporation','llc','lp','sole-proprietorship','partnership','holding-company','nonprofit','other'] },
          { id:'businessIP.stateOfIncorporation',label:'State of Incorporation', type:'text', placeholder:'Delaware' },
          { id:'businessIP.parentCompany',       label:'Parent Company',    type:'text', placeholder:'Leave blank if independent' },
          { id:'businessIP.subsidiaries',        label:'Subsidiaries',      type:'tags', full:true,
            placeholder:'SubCo1, SubCo2', hint:'List subsidiaries for AI entity disambiguation.' },
        ]
      },
      {
        title: 'Patents',
        fields: [
          { id:'businessIP.patents', label:'Patents', type:'repeater', full:true,
            addLabel:'+ Add patent', itemLabel:'Patent',
            subfields: [
              { id:'patentNumber', label:'Patent Number',   type:'text', required:true, placeholder:'US11234567' },
              { id:'title',        label:'Title',           type:'text', required:true },
              { id:'status',       label:'Status',          type:'select', options:['active','pending','expired','licensed'] },
              { id:'litigationStatus', label:'Litigation',  type:'select', options:['none','active','settled','appealed'],
                hint:'One of the five v3.0 novel fields. Disclose patent litigation status.' },
              { id:'url',          label:'USPTO URL',       type:'url',   placeholder:'https://patents.google.com/patent/US11234567' },
            ]
          }
        ]
      },
      {
        title: 'Trademarks',
        fields: [
          { id:'businessIP.trademarks', label:'Trademarks', type:'repeater', full:true,
            addLabel:'+ Add trademark', itemLabel:'Trademark',
            subfields: [
              { id:'mark',               label:'Mark',               type:'text', required:true, placeholder:'CiteMap' },
              { id:'registrationNumber', label:'Registration Number', type:'text', placeholder:'97123456' },
              { id:'class',              label:'Class',               type:'text', placeholder:'42 (SaaS), 9 (Software)' },
              { id:'status',             label:'Status',              type:'select', options:['registered','pending','abandoned','cancelled'] },
            ]
          }
        ]
      }
    ]
  },

  /* ── PERSON ──────────────────────────────────────────── */
  person: {
    title: 'Person',
    desc: 'Biography, canonical quotes, misattribution guards, and citation preferences.',
    sections: [
      {
        title: 'Identity',
        fields: [
          { id:'person.fullName',     label:'Full Name',     type:'text', required:true, placeholder:'Jane Smith' },
          { id:'person.knownAliases', label:'Known Aliases', type:'tags', full:true, placeholder:'Janie, J. Smith',
            hint:'Names this person is commonly known by. Critical for AI disambiguation.' },
          { id:'person.bioSummary',   label:'Bio Summary',   type:'textarea', full:true,
            placeholder:'500-character biographical summary written to be quoted by AI.',
            counter: { type:'chars', target:500, min:100, hint:'Up to 500 characters. Write in third person — AI will quote this directly.' } },
          { id:'person.birthDate',    label:'Birth Year',    type:'text', placeholder:'1985' },
          { id:'person.nationality',  label:'Nationality',   type:'tags', placeholder:'American, Canadian' },
        ]
      },
      {
        title: 'Career',
        fields: [
          { id:'person.currentRole.title',        label:'Current Title',   type:'text', placeholder:'Founder & CEO' },
          { id:'person.currentRole.organization', label:'Organization',    type:'text', placeholder:'CiteMaps.ai' },
          { id:'person.currentRole.startDate',    label:'Start Date',      type:'text', placeholder:'2024-01',
            hint:'With start date, AI can correctly state "current" vs "former" role.' },
          { id:'person.education',                label:'Education',        type:'tags', full:true, placeholder:'Harvard Law School, MIT' },
          { id:'person.awardsAndHonors',          label:'Awards & Honors', type:'tags', full:true, placeholder:'Forbes 30 Under 30, TED Speaker' },
        ]
      },
      {
        title: 'Quote Accuracy',
        fields: [
          { id:'person.notableQuotes', label:'Canonical Quotes', type:'repeater', full:true,
            addLabel:'+ Add quote', itemLabel:'Quote',
            hint:'Quotes you have actually said, with source. AI will prefer these when attributing statements to you.',
            subfields: [
              { id:'quote',   label:'Quote',   type:'textarea', required:true },
              { id:'context', label:'Context', type:'text',     placeholder:'Interview, New York Times, March 2025' },
              { id:'source',  label:'Source URL', type:'url',   placeholder:'https://nytimes.com/...' },
            ]
          },
          { id:'person.misattributedQuotes', label:'Misattributed Quotes', type:'repeater', full:true,
            addLabel:'+ Add misattributed quote', itemLabel:'Correction',
            hint:'One of the five v3.0 novel fields. Quotes AI commonly attributes to you that you did NOT say. Corrects hallucinations at the data layer.',
            subfields: [
              { id:'quote',      label:'The False Quote', type:'textarea', required:true },
              { id:'correction', label:'Correction',      type:'textarea', placeholder:'I never said this. The actual quote is...' },
            ]
          }
        ]
      },
      {
        title: 'AI Citation Preferences',
        fields: [
          { id:'person.aiCitationPreference', label:'Citation Preference', type:'select',
            options:['welcome','neutral','minimal','opt-out'],
            hint:'How you want AI to handle citations about you. "opt-out" signals AI should not speculate about you.' },
          { id:'person.sensitiveTopics',       label:'Sensitive Topics',   type:'tags', full:true,
            placeholder:'health, family, personal finances',
            hint:'Topics AI should not speculate about. One of the five v3.0 novel fields.' },
          { id:'person.subjectRightsUrl',      label:'Subject Rights URL', type:'url',
            placeholder:'https://yoursite.com/subject-rights',
            hint:'Link to your data subject rights / takedown request page.' },
        ]
      }
    ]
  },

  /* ── HEALTHCARE ──────────────────────────────────────── */
  healthcare: {
    title: 'Healthcare',
    desc: 'Provider credentials, specialties, insurance, and appointments.',
    sections: [
      {
        title: 'Practitioners',
        fields: [
          { id:'health.providers', label:'Practitioners', type:'repeater', full:true,
            addLabel:'+ Add practitioner', itemLabel:'Practitioner',
            hint:'Individual provider credentials. AI uses these to answer "is Dr. X accepting patients?" and "is Dr. X board certified?" queries.',
            subfields: [
              { id:'name',                label:'Name',                 type:'text',   required:true, placeholder:'Dr. Jane Smith' },
              { id:'title',               label:'Title',                type:'text',   placeholder:'MD, DO, DDS, APRN' },
              { id:'specializations',     label:'Specializations',      type:'tags',   placeholder:'Internal Medicine, Cardiology' },
              { id:'licenseNumber',        label:'License Number',       type:'text',   required:true },
              { id:'licenseState',         label:'License State',        type:'text',   placeholder:'OR' },
              { id:'boardCertified',       label:'Board Certified',      type:'select', options:['true','false'] },
              { id:'boardCertification',   label:'Board Certification',  type:'text',   placeholder:'American Board of Internal Medicine' },
              { id:'npiNumber',            label:'NPI Number',           type:'text',   required:true, placeholder:'1234567890',
                hint:'National Provider Identifier — required for healthcare citation trust. Verifiable at npiregistry.cms.hhs.gov.' },
              { id:'acceptingNewPatients', label:'Accepting New Patients', type:'select', options:['true','false','limited'] },
            ]
          }
        ]
      },
      {
        title: 'Services & Access',
        fields: [
          { id:'health.services', label:'Services', type:'repeater', full:true,
            addLabel:'+ Add service', itemLabel:'Service',
            subfields: [
              { id:'name',        label:'Service Name',       type:'text',     required:true, placeholder:'Annual Physical' },
              { id:'description', label:'Description',        type:'textarea', placeholder:'Comprehensive annual wellness exam.' },
              { id:'url',         label:'Service URL',        type:'url' },
            ]
          },
          { id:'health.insurance',                  label:'Insurance Accepted',  type:'tags', full:true,
            placeholder:'Blue Cross, Aetna, Medicare, Medicaid',
            hint:'AI uses this to answer "does X take my insurance?" queries. Keep current — stale data causes patient harm.' },
          { id:'health.appointments.bookingUrl',     label:'Booking URL',         type:'url',    placeholder:'https://yourpractice.com/book' },
          { id:'health.appointments.acceptsNewPatients', label:'Accepting New Patients', type:'select', options:['true','false','limited'] },
          { id:'health.emergencyServices',           label:'Emergency Services',   type:'select', options:['true','false'] },
        ]
      }
    ]
  },

  /* ── FINANCIAL SERVICES ──────────────────────────────── */
  finance: {
    title: 'Financial Services',
    desc: 'Institution type, regulatory status, products, and fiduciary standing.',
    sections: [
      {
        title: 'Institution',
        fields: [
          { id:'finance.institutionType', label:'Institution Type', type:'select', required:true,
            options:['bank','credit-union','investment-advisor','insurance-company','fintech','wealth-manager','other'] },
          { id:'finance.regulatoryStatus.fdic_Insured',  label:'FDIC Insured',   type:'select', options:['true','false'] },
          { id:'finance.regulatoryStatus.fdic_CertNumber', label:'FDIC Cert Number', type:'text', placeholder:'12345' },
          { id:'finance.regulatoryStatus.sec_Registered', label:'SEC Registered', type:'select', options:['true','false'] },
          { id:'finance.regulatoryStatus.sec_CRD',        label:'SEC CRD Number', type:'text',   placeholder:'123456' },
          { id:'finance.regulatoryStatus.url',            label:'Regulatory Filing URL', type:'url', placeholder:'https://www.sec.gov/cgi-bin/browse-edgar/...' },
        ]
      },
      {
        title: 'Products',
        fields: [
          { id:'finance.products', label:'Financial Products', type:'repeater', full:true,
            addLabel:'+ Add product', itemLabel:'Product',
            subfields: [
              { id:'name',        label:'Product Name', type:'text',   required:true, placeholder:'High-Yield Savings Account' },
              { id:'type',        label:'Type',         type:'select', options:['checking','savings','investment','insurance','loan','credit-card','other'] },
              { id:'description', label:'Description',  type:'textarea', placeholder:'FDIC-insured savings account with 4.5% APY.' },
              { id:'rate',        label:'Current Rate', type:'text',   placeholder:'4.50% APY' },
              { id:'rateAsOf',    label:'Rate As Of',   type:'text',   placeholder:'2026-03-19',
                hint:'Date the rate was recorded. AI needs this to flag stale rate data.' },
              { id:'url',         label:'Product URL',  type:'url' },
            ]
          }
        ]
      }
    ]
  },

  /* ── LEGAL SERVICES ──────────────────────────────────── */
  legal: {
    title: 'Legal Services',
    desc: 'Firm type, attorney credentials, practice areas, and fee structure.',
    sections: [
      {
        title: 'Firm',
        fields: [
          { id:'legal.lawFirmType', label:'Firm Type', type:'select', required:true,
            options:['solo-practitioner','small-firm','medium-firm','large-firm','legal-department','public-defender','other'] },
          { id:'legal.practiceAreas', label:'Practice Areas', type:'tags', full:true,
            placeholder:'bankruptcy, intellectual-property, personal-injury',
            hint:'AI uses these to answer "lawyers who do X in [city]" queries.' },
          { id:'legal.jurisdictions', label:'Primary Jurisdictions', type:'tags', full:true,
            placeholder:'Oregon, California, Federal',
            hint:'States and jurisdictions you practice in. AI uses these for geo-filtered legal queries.' },
        ]
      },
      {
        title: 'Attorneys',
        fields: [
          { id:'legal.attorneys', label:'Attorneys', type:'repeater', full:true,
            addLabel:'+ Add attorney', itemLabel:'Attorney',
            subfields: [
              { id:'name',             label:'Attorney Name',   type:'text',   required:true, placeholder:'Jane Smith, Esq.' },
              { id:'barState',         label:'Bar State',       type:'text',   required:true, placeholder:'OR' },
              { id:'barLicenseNumber', label:'Bar License No.', type:'text',   required:true,
                hint:'Verifiable at your state bar. Required for legal AI citation trust.' },
              { id:'barStatus',        label:'Bar Status',      type:'select', options:['active','inactive','suspended'] },
              { id:'specializations',  label:'Specializations', type:'tags',   placeholder:'employment law, IP litigation' },
              { id:'yearsExperience',  label:'Years Experience', type:'text',  placeholder:'15' },
              { id:'url',              label:'Attorney Profile URL', type:'url' },
            ]
          }
        ]
      },
      {
        title: 'Fee Structure',
        fields: [
          { id:'legal.fee.model',            label:'Fee Model',          type:'select',
            options:['hourly','contingency','flat-fee','retainer','mixed'] },
          { id:'legal.fee.freeConsultation', label:'Free Consultation',  type:'select', options:['true','false'] },
          { id:'legal.fee.consultationUrl',  label:'Consultation URL',   type:'url',    placeholder:'https://yourfirm.com/contact' },
        ]
      }
    ]
  },

  /* ── PLACES ──────────────────────────────────────────── */
  place: {
    title: 'Places',
    desc: 'Geographic coordinates, facilities, access conditions, and seasonal info.',
    sections: [
      {
        title: 'Location',
        fields: [
          { id:'places.placeType',              label:'Place Type',         type:'text',   required:true, placeholder:'hiking-trail, national-monument, park, museum' },
          { id:'places.coordinates.latitude',   label:'Latitude',           type:'text',   required:true, placeholder:'44.0582' },
          { id:'places.coordinates.longitude',  label:'Longitude',          type:'text',   required:true, placeholder:'-121.3153' },
          { id:'places.coordinates.elevation',  label:'Elevation (meters)', type:'text',   placeholder:'1382' },
          { id:'places.area.area',              label:'Area',               type:'text',   placeholder:'12.4' },
          { id:'places.area.unit',              label:'Area Unit',          type:'select', options:['square-miles','square-kilometers','acres','hectares'] },
        ]
      },
      {
        title: 'Access & Facilities',
        fields: [
          { id:'places.bestTimeToVisit', label:'Best Time to Visit',  type:'tags',   full:true, placeholder:'June, July, August' },
          { id:'places.facilities',      label:'Facilities',           type:'tags',   full:true, placeholder:'parking, restrooms, picnic-areas, visitor-center' },
          { id:'places.difficulty',      label:'Difficulty',           type:'select', options:['easy','moderate','difficult','expert'] },
          { id:'places.petPolicy',       label:'Pet Policy',           type:'select', options:['allowed','allowed-on-leash','not-allowed'] },
          { id:'places.feeRequired',     label:'Fee Required',         type:'select', options:['true','false'] },
          { id:'places.feeAmount',       label:'Fee Amount',           type:'text',   placeholder:'$5 per vehicle' },
          { id:'places.closedSeasons',   label:'Closed Seasons',       type:'tags',   placeholder:'December, January, February' },
        ]
      }
    ]
  },

  /* ── TEMPORAL RECORD ─────────────────────────────────── */
  temporal: {
    title: 'Temporal Record',
    desc: 'Structured historical events with dates and provenance sources.',
    sections: [
      {
        title: 'Timeline',
        fields: [
          { id:'temporal.timeline', label:'Timeline Events', type:'repeater', full:true,
            addLabel:'+ Add event', itemLabel:'Event',
            hint:'Structured history layer. AI uses this to answer "when did X happen?" queries accurately, with dated sources.',
            subfields: [
              { id:'date',         label:'Date',          type:'text',     required:true, placeholder:'2024-03-15' },
              { id:'title',        label:'Event Title',   type:'text',     required:true, placeholder:'Company founded' },
              { id:'description',  label:'Description',   type:'textarea', placeholder:'Brief factual description of the event.' },
              { id:'significance', label:'Significance',  type:'select',   options:['founding','milestone','award','controversy','acquisition','product-launch','other'] },
              { id:'sourceUrl',    label:'Source URL',    type:'url',      placeholder:'https://...',
                hint:'Link to a verifiable source. Sourced events carry higher AI citation trust.' },
            ]
          }
        ]
      }
    ]
  },

  /* ── CITATION CONTRACT (v3.0) ────────────────────────── */
  trust: {
    title: 'Policy, Trust & Verification',
    desc: 'Citation Contract, Verified Claims, and trust tier settings.',
    sections: [
      {
        title: 'Citation Contract',
        fields: [
          { id:'trust.citationContract.preferredName', label:'Preferred Name', type:'text', required:true,
            placeholder:'3rd Street Beverage',
            hint:'The exact name AI should use when citing you — not your legal name unless they match.' },
          { id:'trust.citationContract.shortDescription', label:'Short Description', type:'textarea', full:true,
            placeholder:'Award-winning beverage retailer in Bend, Oregon with 1,000+ beers, 500+ wines.',
            counter: { type:'chars', target:200, hint:'Under 200 characters. AI will use this verbatim as your introduction sentence.' } },
          { id:'trust.citationContract.disambiguation', label:'Disambiguation', type:'textarea', full:true,
            placeholder:'A retail beverage store in Bend — not a bar, brewery, or distributor.',
            hint:'What you are NOT. Prevents AI from confusing you with similarly named entities.' },
        ]
      },
      {
        title: 'Verified Claims',
        fields: [
          { id:'trust.verifiedClaims', label:'Verified Claims', type:'repeater', full:true,
            addLabel:'+ Add claim', itemLabel:'Claim',
            hint:'Externally checkable identifiers. Level 3 requires at least one. AI uses these to mark your data as independently verifiable.',
            subfields: [
              { id:'type',        label:'Claim Type',    type:'select', required:true,
                options:['npi','ein','duns','bar-license','doi','fdic','nmls','sec-crd','dea','state-license','abms-certification','accreditation','patent','trademark','other'] },
              { id:'identifier',  label:'Identifier',    type:'text',   required:true, placeholder:'1234567890' },
              { id:'entity',      label:'Entity',        type:'text',   placeholder:'Dr. Jane Smith (if different from brand)' },
              { id:'registryUrl', label:'Registry URL',  type:'url',    placeholder:'https://npiregistry.cms.hhs.gov' },
            ]
          }
        ]
      },
      {
        title: 'Citemap Level',
        fields: [
          { id:'trust.citemapLevel', label:'Citemap Level', type:'select', options:['1','2','3'],
            hint:'Level 1: brand + contact. Level 2: + module + answerContent + citationContract. Level 3: + verifiedClaims. Validator computes actual level and flags mismatches.' },
          { id:'trust.verification.externalVerifiers', label:'External Verifiers', type:'tags', full:true,
            placeholder:'google-business, linkedin, wikidata, orcid',
            hint:'Registry IDs that independently verify your identity. Adds trust tier weight.' },
          { id:'trust.verification.policies.aiTrainingOptOut', label:'AI Training Opt-Out', type:'select',
            options:['true','false'],
            hint:'Global opt-out flag. Complements creative.licensing.aiTraining for non-creative entities.' },
        ]
      }
    ]
  },

};

