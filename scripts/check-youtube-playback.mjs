import { readFile, writeFile } from 'node:fs/promises';
import { setTimeout as delay } from 'node:timers/promises';

const key = process.env.YOUTUBE_API_KEY;
const region = process.env.YOUTUBE_REGION?.toUpperCase();
const output = process.argv[2];
if (!key || !output || (region && !/^[A-Z]{2}$/.test(region))) {
  throw Error('Set YOUTUBE_API_KEY and run: node scripts/check-youtube-playback.mjs <private-report.json>. Optional: YOUTUBE_REGION=RW.');
}
const root = new URL('../dist/video-data/', import.meta.url);
const json = async name => JSON.parse(await readFile(new URL(name, root), 'utf8'));
const index = await json('index.json');
const shardIds = [...new Set(Object.values(index).map(row => row.shard))];
const courses = Object.assign({}, ...await Promise.all(shardIds.map(id => json(id + '.json'))));
const ids = [...new Set(Object.values(courses).flatMap(course => course.lessons.map(lesson => lesson.video)))];

const unavailable = new Map();
for (let i = 0; i < ids.length; i += 50) {
  const batch = ids.slice(i, i + 50);
  const endpoint = new URL('https://www.googleapis.com/youtube/v3/videos');
  endpoint.search = new URLSearchParams({ part:'status,contentDetails', id:batch.join(','), key });
  let response;
  try {
    response = await fetch(endpoint, { signal:AbortSignal.timeout(20000) });
  } catch {
    throw Error('Network failure calling YouTube after ' + i + ' IDs');
  }
  if (!response.ok) throw Error('YouTube API HTTP ' + response.status + ' after ' + i + ' IDs');
  const result = await response.json();
  const videos = new Map(result.items.map(item => [item.id, item]));
  for (const id of batch) {
    const video = videos.get(id);
    const restrictions = video?.contentDetails?.regionRestriction;
    if (!video) unavailable.set(id, 'unavailable');
    else if (!video.status?.embeddable || !['public', 'unlisted'].includes(video.status?.privacyStatus)) unavailable.set(id, 'not embeddable');
    else if (region && (restrictions?.blocked?.includes(region) || (restrictions?.allowed && !restrictions.allowed.includes(region)))) unavailable.set(id, 'region blocked');
  }
  if (i % 5000 === 0 && i) console.log(i + '/' + ids.length + ' videos checked');
  await delay(125);
}

const affected = Object.fromEntries(Object.entries(courses).map(([id, item]) => [
  id, item.lessons.flatMap((lesson, index) => unavailable.has(lesson.video) ? [{ position:index + 1, video:lesson.video, reason:unavailable.get(lesson.video) }] : [])
]).filter(([, issues]) => issues.length));
await writeFile(output, JSON.stringify({ checkedAt:new Date().toISOString(), region:region || null, videoCount:ids.length, affected }, null, 2) + '\n');
console.log('Checked', ids.length, 'unique video IDs;', Object.keys(affected).length, 'course outlines have playback issues.');
