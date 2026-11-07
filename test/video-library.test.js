import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import { curated } from '../dist/curated.js';
import { mergeCatalog, nextLesson } from '../dist/model.js';
import { chapterRuns, createVideoLibrary, lessonKey, linkVideoCatalog, studyKey, videoLesson } from '../dist/video-library.js';
import { nptelSequence } from '../scripts/video-sequences.mjs';

const root = new URL('../dist/', import.meta.url);
const json = async name => JSON.parse(await readFile(new URL(name, root), 'utf8'));
const [index, listings, reviews, coverage] = await Promise.all([
  json('video-data/index.json'), json('nptel.json'), json('reviews.json'), json('video-data/coverage.json')
]);

test('published courses have complete official sequences and valid ordered references', async () => {
  const linked = linkVideoCatalog(mergeCatalog(curated, listings, reviews), index).filter(item => item.videoCourse);
  assert.equal(linked.length, coverage.courseOutlines);
  assert.equal(linked.length, Object.keys(index).length);
  assert.ok(linked.length > 2000);
  const shards = new Map(await Promise.all([...new Set(Object.values(index).map(entry => entry.shard))]
    .map(async id => [id, await json('video-data/' + id + '.json')])));
  let videos = 0;
  for (const item of linked) {
    const { shard, count, source } = item.videoCourse;
    assert.ok(['nptel.ac.in', 'oyc.yale.edu', 'cs50.harvard.edu', 'www.mit.edu'].includes(new URL(source).hostname));
    const { lessons } = shards.get(shard)[item.id];
    assert.equal(lessons.length, count);
    assert.equal(new Set(lessons.map(lesson => lesson.video)).size, count);
    for (const lesson of lessons) {
      assert.match(lesson.video, /^[A-Za-z0-9_-]{11}$/);
      assert.ok(lesson.title && lesson.unit);
    }
    videos += lessons.length;
  }
  assert.equal(videos, coverage.lessons);
  assert.ok(linked.some(item => item.discipline === 'Textile Engineering'));
  assert.ok(linked.some(item => item.subject === 'Languages'));
});

test('unit grouping keeps the official order even when a unit title repeats', () => {
  const chapters = chapterRuns([{unit:'A'}, {unit:'B'}, {unit:'A'}]);
  assert.deepEqual(chapters.map(group => group.lessons[0].index), [0, 1, 2]);
});

test('course completion uses video IDs while prior guides retain their keys', () => {
  const guide = { id:'example', lessons:[{ video:'video-one' }] };
  const watch = { ...guide, watch:true, lessons:[{video:'video-two'}, {video:'video-one'}] };
  assert.equal(studyKey(guide), 'example');
  assert.equal(studyKey(watch), 'example:youtube');
  assert.equal(videoLesson(watch, 'video-one'), 1);
  assert.equal(nextLesson(watch, {done:['video-two']}, lessonKey), 1);
});

test('shard requests share a cache and failures can be retried', async () => {
  let requests = 0;
  const library = createVideoLibrary(async () => {
    if (++requests === 1) throw Error('network');
    return { example:{ lessons:[] } };
  });
  await assert.rejects(library.load(0));
  const first = library.load(0);
  assert.equal(library.load(0), first);
  assert.equal(await first, library.get(0));
  assert.equal(requests, 2);
});

test('a provider outline with a missing video remains partial', () => {
  const encode = (value, table = []) => {
    const index = table.length;
    table.push(null);
    table[index] = Array.isArray(value) ? value.map(entry => encode(entry, table))
      : value && typeof value === 'object' ? Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, encode(entry, table)])) : value;
    return index;
  };
  const table = [];
  encode({ courseOutline:{ title:'Test', units:[
    { name:'Part I', lessons:[{ name:'First', youtube_id:'P3FKHH2RzjI' }] },
    { name:'Part II', lessons:[{ name:'Second', youtube_id:'' }] }
  ] } }, table);
  assert.equal(nptelSequence({ nodes:[{ data:table }] }, 'https://nptel.ac.in/courses/101101079').state, 'partial');
});
