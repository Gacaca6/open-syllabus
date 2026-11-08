import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import { curated } from '../dist/curated.js';
import { mergeCatalog } from '../dist/model.js';
import { linkVideoCatalog } from '../dist/video-library.js';
import { icon } from '../dist/art.js';
import { careers, careerById, careerCourseCount, careerStepCount, stepKey } from '../dist/careers.js';

const root = new URL('../dist/', import.meta.url);
const json = async name => JSON.parse(await readFile(new URL(name, root), 'utf8'));
const [index, listings, reviews] = await Promise.all([json('video-data/index.json'), json('nptel.json'), json('reviews.json')]);
const catalog = new Map(linkVideoCatalog(mergeCatalog(curated, listings, reviews), index).map(item => [item.id, item]));

test('career tracks are complete and uniquely identified', () => {
  assert.ok(careers.length >= 8);
  assert.equal(new Set(careers.map(career => career.id)).size, careers.length);
  for (const name of ['Software Engineer', 'Graphic Designer', 'AutoCAD / CAD Technician', 'Robotics Engineer', 'Digital Marketer']) {
    assert.ok(careers.some(career => career.title === name), name + ' track missing');
  }
  for (const career of careers) {
    assert.match(career.id, /^[a-z0-9-]+$/);
    assert.match(career.accent, /^#[0-9a-f]{6}$/i);
    assert.notEqual(icon(career.icon), icon('__unknown__'), 'missing icon for ' + career.id);
    for (const field of ['title', 'role', 'months', 'summary']) assert.ok(career[field]?.trim(), career.id + ' missing ' + field);
    assert.ok(career.skills.length >= 4);
    assert.ok(career.outcomes.length >= 3);
    assert.ok(career.checklist.length >= 3);
    assert.ok(career.stages.length >= 3);
    assert.ok(career.stages.some(stage => stage.steps.some(step => step.project)), career.id + ' has no hands-on project');
    assert.equal(careerById(career.id), career);
  }
  assert.equal(careerById('not-a-career'), undefined);
});

test('every career course step points at a playable published sequence', () => {
  let courses = 0;
  for (const career of careers) {
    career.stages.forEach((stage, s) => {
      assert.ok(stage.title && stage.goal && stage.steps.length);
      stage.steps.forEach((step, i) => {
        assert.equal(stepKey(s, i), s + '.' + i);
        const kinds = ['course', 'project', 'youtube'].filter(key => step[key]);
        assert.equal(kinds.length, 1, career.id + ' step ' + stepKey(s, i) + ' must be exactly one kind');
        if (step.course) {
          const item = catalog.get(step.course);
          assert.ok(item, 'unknown course ' + step.course + ' in ' + career.id);
          assert.ok(item.videoCourse?.count > 0, step.course + ' has no playable video sequence');
          courses++;
        }
        if (step.project) assert.ok(step.project.trim().length > 10);
        if (step.youtube) {
          assert.ok(step.youtube.title && step.youtube.channel);
          assert.ok(step.youtube.url.startsWith('https://www.youtube.com/'));
        }
      });
    });
    assert.equal(careerCourseCount(career), career.stages.flatMap(stage => stage.steps).filter(step => step.course).length);
    assert.equal(careerStepCount(career), career.stages.reduce((total, stage) => total + stage.steps.length, 0));
    assert.ok(careerCourseCount(career) >= 4, career.id + ' needs a substantial course core');
  }
  assert.ok(courses >= 40);
});