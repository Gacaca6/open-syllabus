import assert from 'node:assert/strict';
import { test } from 'node:test';
import { skillVideos, skillTopics } from '../dist/skill-videos.js';

test('every skill video has a valid 11-char YouTube ID', () => {
  assert.ok(skillVideos.length >= 200, 'expected at least 200 skill videos');
  for (const video of skillVideos) {
    assert.match(video.id, /^[A-Za-z0-9_-]{11}$/, video.id + ' is not a valid YouTube id');
  }
});

test('skill video IDs are unique', () => {
  const ids = skillVideos.map(video => video.id);
  assert.equal(new Set(ids).size, ids.length, 'duplicate video IDs found');
});

test('skill video titles are unique after normalization', () => {
  const seen = new Set();
  for (const video of skillVideos) {
    const key = video.title.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
    assert.ok(!seen.has(key), 'duplicate title: ' + video.title);
    seen.add(key);
  }
});

test('every video has non-empty title, channel, and topic', () => {
  for (const video of skillVideos) {
    assert.ok(video.title?.trim(), video.id + ' missing title');
    assert.ok(video.channel?.trim(), video.id + ' missing channel');
    assert.ok(video.topic?.trim(), video.id + ' missing topic');
  }
});

test('every video topic appears in skillTopics', () => {
  assert.ok(skillTopics.length >= 15, 'expected at least 15 topics');
  for (const video of skillVideos) {
    assert.ok(skillTopics.includes(video.topic), video.id + ' has topic not in skillTopics: ' + video.topic);
  }
});

test('skillTopics has no empty entries and is ordered by first appearance', () => {
  const seen = new Set();
  for (const topic of skillTopics) {
    assert.ok(topic.trim(), 'empty topic in skillTopics');
    assert.ok(!seen.has(topic), 'duplicate topic: ' + topic);
    seen.add(topic);
  }
});

test('each topic has at least 3 videos', () => {
  for (const topic of skillTopics) {
    const count = skillVideos.filter(video => video.topic === topic).length;
    assert.ok(count >= 3, topic + ' has only ' + count + ' videos');
  }
});
