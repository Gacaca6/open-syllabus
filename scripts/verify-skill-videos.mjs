import { readFile, writeFile } from 'node:fs/promises';

const [candidatesPath, outPath, reportPath] = process.argv.slice(2);
if (!candidatesPath || !outPath) throw Error('usage: node scripts/verify-skill-videos.mjs <candidates.json> <out.js> [report.json]');

const TOPIC_ORDER = [
  'Prompt engineering & AI', 'Python', 'JavaScript & web dev', 'Git & GitHub', 'Docker & DevOps',
  'Excel & spreadsheets', 'SQL & databases', 'Data analysis', 'Cybersecurity', 'Electronics & Arduino',
  'UI/UX & Figma', 'Photoshop & image editing', 'Video editing', 'CAD & 3D modelling', 'Writing & copywriting',
  'SEO & digital marketing', 'Speaking & communication', 'Personal finance', 'Productivity & study skills', 'Career & interviews'
];

const candidates = JSON.parse(await readFile(candidatesPath, 'utf8'));
const byId = new Map();
for (const candidate of candidates) {
  if (/^[A-Za-z0-9_-]{11}$/.test(candidate.id) && !byId.has(candidate.id)) byId.set(candidate.id, candidate);
}
const queue = [...byId.values()];
const verified = [];
const dropped = [];
await Promise.all(Array.from({ length: 8 }, async () => {
  while (queue.length) {
    const candidate = queue.shift();
    try {
      const response = await fetch('https://www.youtube.com/oembed?url=' + encodeURIComponent('https://www.youtube.com/watch?v=' + candidate.id) + '&format=json', { signal: AbortSignal.timeout(20000) });
      if (!response.ok) throw Error('HTTP ' + response.status);
      const data = await response.json();
      if (data.type !== 'video' || !data.title) throw Error('not a playable video');
      verified.push({ id: candidate.id, title: data.title, channel: data.author_name, topic: candidate.topic });
    } catch (error) {
      dropped.push({ id: candidate.id, title: candidate.title, topic: candidate.topic, reason: String(error.message || error) });
    }
  }
}));

const seenTitles = new Set();
const unique = [];
for (const video of verified.sort((a, b) => a.topic.localeCompare(b.topic) || a.title.localeCompare(b.title))) {
  const key = video.title.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  if (seenTitles.has(key)) { dropped.push({ ...video, reason: 'duplicate title' }); continue; }
  seenTitles.add(key);
  unique.push(video);
}
unique.sort((a, b) => TOPIC_ORDER.indexOf(a.topic) - TOPIC_ORDER.indexOf(b.topic) || a.title.localeCompare(b.title));
const topics = TOPIC_ORDER.filter(topic => unique.some(video => video.topic === topic));
const module = '// Curated skill videos. Every id, title and channel verified against YouTube oEmbed at curation time.\n'
  + 'export const skillTopics = ' + JSON.stringify(topics) + ';\n\n'
  + 'export const skillVideos = [\n' + unique.map(video => '  ' + JSON.stringify(video)).join(',\n') + '\n];\n';
await writeFile(outPath, module);
const report = { verified: unique.length, dropped, perTopic: Object.fromEntries(topics.map(topic => [topic, unique.filter(video => video.topic === topic).length])) };
if (reportPath) await writeFile(reportPath, JSON.stringify(report, null, 2));
console.log('verified', unique.length, 'dropped', dropped.length);
console.log(JSON.stringify(report.perTopic, null, 1));
for (const item of dropped) console.log('DROP', item.id, item.reason, '|', item.title);