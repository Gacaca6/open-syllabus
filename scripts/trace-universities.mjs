import { writeFile } from 'node:fs/promises';
import { curated } from '../dist/curated.js';
import { setTimeout as delay } from 'node:timers/promises';

const destination = process.argv[2];
if (!destination) throw Error('Usage: node scripts/trace-universities.mjs <checkpoint.jsonl>');
const yale = curated.filter(item => item.provider === 'Yale University');
const harvard = curated.find(item => item.id === 'harvard-python');
const linear = curated.find(item => item.id === 'mit-linear-algebra');
const entities = { amp:'&', quot:'"', apos:"'", lt:'<', gt:'>', nbsp:' ', ndash:'–', mdash:'—', rsquo:'’' };
const video = '[A-Za-z0-9_-]{11}';
const slots = new Map();

function clean(text) {
  return text.replace(/<[^>]+>/g, '').replace(/&(#x[0-9a-f]+|#\d+|\w+);/gi, (match, key) => {
    if (key.startsWith('#x')) return String.fromCodePoint(parseInt(key.slice(2), 16));
    if (key.startsWith('#')) return String.fromCodePoint(Number(key.slice(1)));
    return entities[key] || match;
  }).replace(/\s+/g, ' ').trim();
}

async function get(url) {
  const origin = new URL(url).origin;
  const when = Math.max(Date.now(), (slots.get(origin) || 0) + 250);
  slots.set(origin, when);
  await delay(Math.max(0, when - Date.now()));
  for (let i = 0; i < 2; i++) {
    const response = await fetch(url, { signal:AbortSignal.timeout(15000) });
    if (response.ok) return response.text();
    if (i || ![403, 429, 503].includes(response.status)) throw Error(response.status + ' ' + url);
    await delay(2500);
  }
}

function checked(rows, minimum) {
  if (rows.length < minimum || new Set(rows.map(lesson => lesson.video)).size !== rows.length) {
    throw Error('Missing or repeated video in official sequence');
  }
  return rows;
}

async function traceYale(item) {
  const html = await get(item.source);
  const listed = [...html.matchAll(/<td\b[^>]*\bviews-field-field-session-display-title\b[^>]*>\s*<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi)];
  if (listed.length < 10) throw Error('Official sessions list missing');
  const result = [];
  const resources = [];
  for (let i = 0; i < listed.length; i += 5) {
    const batch = await Promise.all(listed.slice(i, i + 5).map(async ([, path, title]) => {
      const source = new URL(path, item.source).href;
      const page = await get(source);
      const embeds = [...new Set([...page.matchAll(new RegExp('youtube(?:-nocookie)?\\.com/embed/(' + video + ')', 'g'))].map(match => match[1]))];
      if (!embeds.length && (/\/exam(?:-\d+)?\/?$/.test(new URL(source).pathname) || /There are no media available for this lecture\./i.test(page))) {
        return { resource:{ title:clean(title), source } };
      }
      if (!embeds.length) throw Error('Review video coverage for ' + source);
      return { lessons:embeds.map((id, part) => ({
        title:clean(title) + (embeds.length > 1 ? ' · Video ' + (part + 1) : ''),
        video:id, unit:'Course sessions', source
      })) };
    }));
    for (const entry of batch) {
      if (entry.resource) resources.push(entry.resource);
      else result.push(...entry.lessons);
    }
  }
  return { source:item.source, lessons:checked(result, 10), resources };
}

async function traceHarvard(item) {
  const html = await get(item.source);
  const weeks = [...html.matchAll(/href="(weeks\/(\d+)\/)">([^<]+)<\/a>/g)];
  if (weeks.length !== 10 || !weeks.every((entry, index) => Number(entry[2]) === index)) throw Error('Expected ten listed weeks');
  const lessons = [];
  for (const [, path, number, title] of weeks) {
    const source = new URL(path, item.source).href;
    const page = await get(source);
    const id = page.match(new RegExp('<iframe\\b[^>]*\\bsrc="https://video\\.cs50\\.io/(' + video + ')"'))?.[1];
    if (!id) throw Error('Lecture not found at ' + source);
    lessons.push({ title:clean(title), video:id, unit:'Week ' + number, source });
  }
  const shortsSource = new URL('shorts/', item.source).href;
  const shortsPage = await get(shortsSource);
  const shortsBody = shortsPage.split('<h1 id="shorts">Shorts</h1>')[1] || '';
  const shorts = [...shortsBody.matchAll(/<li\b[^>]*><a href="([a-z0-9_]+\/)">([^<]+)<\/a><\/li>/g)];
  if (shorts.length < 20) throw Error('Supplementary shorts list missing');
  for (let offset = 0; offset < shorts.length; offset += 5) {
    lessons.push(...await Promise.all(shorts.slice(offset, offset + 5).map(async ([, path, title]) => {
      const source = new URL(path, shortsSource).href;
      const page = await get(source);
      const id = page.match(new RegExp('<iframe\\b[^>]*\\bsrc="https://video\\.cs50\\.io/(' + video + ')"'))?.[1];
      if (!id) throw Error('Supplementary video not found at ' + source);
      return { title:clean(title), video:id, unit:'Supplementary shorts', source };
    })));
  }
  return {
    source:item.source,
    lessons:checked(lessons, 10),
    resources:[
      { title:'Problem sets and lecture materials', source:item.source },
      { title:'Official supplementary shorts', source:shortsSource },
      { title:'Final project', source:new URL('project/', item.source).href }
    ]
  };
}

async function traceLinear(item) {
  const source = 'https://www.mit.edu/~18.06/';
  const html = await get(source);
  const matches = [...html.matchAll(new RegExp('Lecture #(\\d+)([a-z]?)\\s*:\\s*([^<]+?)\\s*\\(<a\\b[^>]*youtube\\.com/watch\\?v=(' + video + ')', 'g'))]
    .sort((a, b) => Number(a[1]) - Number(b[1]) || a[2].localeCompare(b[2]));
  const numbered = matches.filter(entry => !entry[2]);
  if (numbered.length !== 34 || !numbered.every((entry, i) => Number(entry[1]) === i + 1)) throw Error('Numbered lectures have gaps');
  return {
    title:'Linear Algebra · MIT 18.06',
    source,
    lessons:checked(matches.map(([, number, part, title, id]) => ({ title:clean(title), video:id, unit:'Lectures ' + (Math.floor((Number(number) - 1) / 10) * 10 + 1) + '–' + Math.min(numbered.length, Math.ceil(Number(number) / 10) * 10), source })), 34),
    resources:[{ title:'OCW problem solving, notes, and exams', source:item.source }]
  };
}

const results = await Promise.all([
  ...yale.map(item => [item, traceYale]),
  [harvard, traceHarvard],
  [linear, traceLinear]
].map(async ([item, trace]) => {
  try {
    const result = await trace(item);
    console.log(item.id, result.lessons.length);
    return { id:item.id, state:'matched', ...result };
  } catch (error) {
    console.log(item.id, error.message);
    return { id:item.id, state:'partial', reason:error.message };
  }
}));
await writeFile(destination, results.map(row => JSON.stringify(row)).join('\n') + '\n');
