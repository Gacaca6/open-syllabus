export function linkVideoCatalog(catalog, index) {
  return catalog.map(item => {
    const videoCourse = Object.hasOwn(index, item.id) ? index[item.id] : null;
    return videoCourse ? {
      ...item, title:videoCourse.title || item.title, searchAlias:item.title,
      videoCourse, format:'Video'
    } : item;
  });
}

export function studyKey(item) {
  return item.id + (item.watch ? ':youtube' : '');
}

export function lessonKey(item, index) {
  return item.watch ? item.lessons[index].video : index;
}

export function chapterRuns(lessons) {
  const groups = [];
  for (const [index, lesson] of lessons.entries()) {
    const title = lesson.unit || 'Lectures';
    if (groups.at(-1)?.title !== title) groups.push({ title, lessons:[] });
    groups.at(-1).lessons.push({ lesson, index });
  }
  return groups;
}

export function videoLesson(item, step) {
  return item.lessons?.findIndex(lesson => lesson.video === step) ?? -1;
}

export function createVideoLibrary(readJson) {
  const cache = new Map();
  return {
    get(shard) { return cache.get(shard)?.data; },
    load(shard) {
      const existing = cache.get(shard);
      if (existing) return existing.request;
      const entry = {};
      entry.request = readJson('./video-data/' + shard + '.json').then(data => {
        entry.data = data;
        return data;
      }).catch(error => {
        cache.delete(shard);
        throw error;
      });
      cache.set(shard, entry);
      return entry.request;
    }
  };
}
