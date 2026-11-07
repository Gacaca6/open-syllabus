import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const endpoint = 'https://nptel.ac.in/courses/__data.json';
const source = process.argv[2];
const response = source ? null : await fetch(endpoint, { signal: AbortSignal.timeout(30000) });
if (response && !response.ok) throw Error('NPTEL returned HTTP ' + response.status);
const raw = source ? JSON.parse(await readFile(source, 'utf8')) : await response.json();
const table = raw.nodes.find(node => Array.isArray(node?.data))?.data;
if (!table) throw Error('Unexpected NPTEL data structure');

function decode(index) {
  const entry = table[index];
  if (Array.isArray(entry)) return entry.map(decode);
  if (entry && typeof entry === 'object') return Object.fromEntries(Object.entries(entry).map(([key, value]) => [key, decode(value)]));
  return entry;
}

const { courses, disciplines } = decode(0);
const disciplineNames = new Map(disciplines.map(({ id, name }) => [Number(id), name.trim().replace(/\s+/g, ' ')]));
const subjects = {
  102: 'Science', 104: 'Science', 106: 'Computing', 109: 'Humanities',
  110: 'Business', 111: 'Mathematics', 115: 'Science', 119: 'Environment',
  120: 'Environment', 121: 'Study skills', 124: 'Design & arts', 126: 'Agriculture',
  127: 'Interdisciplinary', 129: 'Society & law', 130: 'Business', 131: 'Environment'
};
const rows = [];
const seenIds = new Set();
const seenTitles = new Set();

for (const item of courses) {
  const title = item.title?.replace(/^NOC:\s*/i, '').trim().replace(/\s+/g, ' ');
  if (!title || !/^\d{9}$/.test(String(item.id)) || item.contentType !== 'Video' || item.currentRun) continue;
  if (/(?:^|\b)(summer school|winter school|special lecture series|webinar|conference|workshop|faculty development program)(?:\b|$)/i.test(title)) continue;
  const titleKey = title.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
  if (!titleKey || seenIds.has(item.id) || seenTitles.has(titleKey)) continue;
  seenIds.add(item.id);
  seenTitles.add(titleKey);
  const inferred = /psychology|cognitive science|human behavior/i.test(title) ? 'Psychology'
    : /public health|human physiology|epidemiology|nutrition|clinical/i.test(title) ? 'Health'
    : /\b(french|german|spanish|japanese|sanskrit|english language|communication in english)\b/i.test(title) && item.disciplineId === 109 ? 'Languages'
    : subjects[item.disciplineId] || 'Engineering';
  rows.push({
    id: 'nptel-' + item.id, title, provider: item.instituteName ? item.instituteName + ' · NPTEL' : 'NPTEL',
    subject: inferred, discipline: disciplineNames.get(item.disciplineId) || '',
    source: 'https://nptel.ac.in/courses/' + item.id, format: 'Video',
    access: 'source', review: 'indexed'
  });
}

if (rows.length < 2000) throw Error('Import yielded only ' + rows.length + ' records; preserving the existing snapshot');
const output = fileURLToPath(new URL('../dist/nptel.json', import.meta.url));
await writeFile(output, JSON.stringify(rows));
console.log('Indexed ' + rows.length + ' distinct source-listed courses.');
