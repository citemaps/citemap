#!/usr/bin/env node
// tsup writes ESM as dist/index.mjs (no "type": "module" here); 0.4.0 still
// pointed at a stale dist/index.js from 0.3.x.
import('../dist/index.mjs');
