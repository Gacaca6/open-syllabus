import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import { curated, lectures, paths } from '../dist/curated.js';
import { illustratedSubjects } from '../dist/art.js';
import { mergeCatalog, nextLesson, readStudy, searchCatalog, writeStudy } from '../dist/model.js';

const source = JSON.parse(await readFile(new URL('../dist/nptel.json', import.meta.url), 'utf8'));
const reviews = JSON.parse(await readFile(new URL('../dist/reviews.json', import.meta.url), 'utf8'));
const catalog = mergeCatalog(curated, source, reviews);

test('snapshot contains at least 2,000 unique course listings with HTTPS sources', () => {
  assert.ok(catalog.length >= 2000);
  assert.equal(new Set(catalog.map(item => item.id)).size, catalog.length);
  for (const item of [...catalog, ...lectures]) {
    assert.equal(new URL(item.source).protocol, 'https:');
    for (const lesson of item.lessons || []) {
      assert.equal(new URL(lesson.source).protocol, 'https:');
      if (lesson.video) assert.match(lesson.video, /^[\w-]{11}$/);
    }
  }
  for (const path of paths) assert.ok(path.items.every(id => curated.some(item => item.id === id)));
});

test('each catalog subject has its own cover cell', () => {
  assert.equal(illustratedSubjects.length, 16);
  assert.equal(new Set(illustratedSubjects).size, 16);
  for (const item of [...catalog, ...lectures]) assert.ok(illustratedSubjects.includes(item.subject), item.subject);
});

test('catalog supports intersecting subject, target language, format, and practice filters', () => {
  const result = searchCatalog(catalog, { q:'spanish', subject:'Languages', target:'Spanish', format:'Audio', practice:'yes' });
  assert.deepEqual(result.map(item => item.id), ['language-spanish']);
  assert.equal(searchCatalog(catalog, { q:'Psychólogy' })[0].id, 'yale-psychology');
  assert.equal(searchCatalog(catalog, { q:'impossible-query-347b' }).length, 0);
});

test('curated entries win duplicate titles and exclusions stay unpublished', () => {
  const listed = [{ ...curated[0], id:'duplicate' }, { ...source[0], id:'excluded' }, { ...source[1], id:'approved' }];
  const published = mergeCatalog([curated[0]], listed, { excluded:{ status:'excluded' }, approved:{ status:'approved' } });
  assert.deepEqual(published.map(item => item.id), [curated[0].id, 'approved']);
  assert.equal(published[1].review, 'approved');
});

test('resume skips completed lessons and tolerates blocked browser storage', () => {
  assert.equal(nextLesson(curated[0], { done:[0, 2] }), 1);
  const blocked = { getItem:() => { throw Error(); }, setItem:() => { throw Error(); } };
  assert.deepEqual(readStudy(blocked), { items:{} });
  assert.equal(writeStudy(blocked, { items:{} }), false);
});
