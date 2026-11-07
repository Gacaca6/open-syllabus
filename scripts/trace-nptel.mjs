import { readFile, appendFile } from 'node:fs/promises';
import { setTimeout as delay } from 'node:timers/promises';
import { nptelSequence } from './video-sequences.mjs';

const cache = process.argv[2];
if (!cache) throw Error('Usage: node scripts/trace-nptel.mjs <checkpoint.jsonl>');
const courses = JSON.parse(await readFile(new URL('../dist/nptel.json', import.meta.url), 'utf8'));
const seen = new Set();
try {
  const rows = (await readFile(cache, 'utf8')).trim().split('\n').filter(Boolean);
  for (const row of rows) {
    const { id, state } = JSON.parse(row);
    if (state !== 'retry') seen.add(id);
  }
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}
const remaining = courses.filter(course => !seen.has(course.id));
let next = 0;
let completed = 0;
let startAt = Date.now();
let backoffUntil = 0;
let output = Promise.resolve();
const summary = {};

async function trace(item) {
  const source = new URL(item.source);
  if (source.origin !== 'https://nptel.ac.in' || !/^\/courses\/\d{9}$/.test(source.pathname)) throw Error('Invalid course source');
  const planned = startAt = Math.max(Date.now(), startAt + 160, backoffUntil);
  await delay(Math.max(0, planned - Date.now()));
  if (backoffUntil > Date.now()) await delay(backoffUntil - Date.now());
  try {
    const response = await fetch(source.href + '/__data.json', {
      signal: AbortSignal.timeout(16000),
      headers: { 'User-Agent': 'OpenSyllabus/1.0 (official course directory reader)' }
    });
    if (response.status === 429 || response.status === 503) {
      const retry = response.headers.get('Retry-After');
      const milliseconds = Number(retry) * 1000 || Date.parse(retry) - Date.now() || 30000;
      backoffUntil = Math.max(backoffUntil, Date.now() + Math.max(milliseconds, 30000));
    }
    if (!response.ok) return { state: response.status === 404 ? 'missing' : 'retry', reason: 'HTTP ' + response.status };
    return nptelSequence(await response.json(), source.href);
  } catch (error) {
    return { state:'retry', reason:error.message };
  }
}

console.log('Previously checked:', seen.size, 'remaining:', remaining.length);
await Promise.all(Array.from({ length:8 }, async () => {
  while (next < remaining.length) {
    const item = remaining[next++];
    const result = await trace(item);
    const row = JSON.stringify({ id:item.id, ...result }) + '\n';
    output = output.then(() => appendFile(cache, row, 'utf8'));
    await output;
    summary[result.state] = (summary[result.state] || 0) + 1;
    if (++completed % 100 === 0) console.log(completed + '/' + remaining.length, summary);
  }
}));
console.log('Done:', summary);
