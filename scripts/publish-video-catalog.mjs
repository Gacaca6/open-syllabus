import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { curated } from '../dist/curated.js';
import { mergeCatalog } from '../dist/model.js';

const checkpoints = process.argv.slice(2);
if (!checkpoints.length) throw Error('Usage: node scripts/publish-video-catalog.mjs <checkpoint.jsonl> ...');
const root = new URL('../dist/video-data/', import.meta.url);
const readJson = async name => JSON.parse(await readFile(new URL('../dist/' + name, import.meta.url), 'utf8'));
const [sourceCatalog, reviews] = await Promise.all([readJson('nptel.json'), readJson('reviews.json')]);
const eligible = new Set(mergeCatalog(curated, sourceCatalog, reviews).map(item => item.id));
const records = new Map();
for (const path of checkpoints) {
  const lines = (await readFile(path, 'utf8')).trim().split('\n').filter(Boolean);
  for (const line of lines) {
    const record = JSON.parse(line);
    if (record.state !== 'retry') records.set(record.id, record);
  }
}

const index = {};
const shards = Array.from({ length:64 }, () => ({}));
for (const [rawId, record] of [...records].sort(([a], [b]) => a.localeCompare(b))) {
  if (record.state !== 'matched') continue;
  const id = rawId === 'nptel-126105014' ? 'soil-and-crops' : rawId;
  if (!eligible.has(id) || reviews[rawId]?.status === 'excluded') continue;
  const shard = [...id].reduce((value, char) => (value * 31 + char.charCodeAt(0)) % shards.length, 0);
  const { lessons, source, title, resources } = record;
  index[id] = { shard, count:lessons.length, source, title };
  shards[shard][id] = { lessons, ...(resources?.length ? { resources } : {}) };
}

await mkdir(root, { recursive:true });
await Promise.all(shards.map((data, i) => writeFile(new URL(i + '.json', root), JSON.stringify(data) + '\n')));
const states = {};
for (const row of records.values()) states[row.state] = (states[row.state] || 0) + 1;
const coverage = {
  ...states, courseOutlines:Object.keys(index).length, lessons:Object.values(index).reduce((n, item) => n + item.count, 0)
};
const unresolved = Object.fromEntries([...eligible].filter(id => !index[id]).sort().map(id => {
  const record = records.get(id);
  return [id, record ? { state:record.state, reason:record.reason } : { state:'untraced' }];
}));
await writeFile(new URL('coverage.json', root), JSON.stringify({ ...coverage, unresolved }, null, 2) + '\n');
await writeFile(new URL('index.json', root), JSON.stringify(index) + '\n');
console.log(coverage);
