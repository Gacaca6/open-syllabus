const videoId = /^[A-Za-z0-9_-]{11}$/;

function decodeCourse(payload) {
  const table = payload.nodes?.find(node => Array.isArray(node?.data))?.data;
  if (!table) return null;
  function decode(index) {
    if (index < 0) return null;
    const value = table[index];
    if (Array.isArray(value)) return value.map(decode);
    if (value && typeof value === 'object') {
      return Object.fromEntries(Object.entries(value).map(([key, pointer]) => [key, decode(pointer)]));
    }
    return value;
  }
  return decode(0)?.courseOutline;
}

export function nptelSequence(payload, source) {
  const course = decodeCourse(payload);
  if (!Array.isArray(course?.units) || !course.units.length) {
    return { state:'missing', reason:'No official lesson outline' };
  }
  const lessons = [];
  for (const unit of course.units) {
    if (!Array.isArray(unit.lessons) || !unit.lessons.length) {
      return { state:'partial', reason:'An official unit has no lesson entries' };
    }
    for (const lesson of unit.lessons) {
      const video = lesson.youtube_id?.trim();
      const title = lesson.name?.trim();
      if (!videoId.test(video || '') || !title) {
        return { state:'partial', reason:'At least one official lesson has no usable YouTube reference' };
      }
      lessons.push({ title, video, unit:unit.name?.trim() || 'Lectures' });
    }
  }
  if (lessons.length < 2 || new Set(lessons.map(lesson => lesson.video)).size !== lessons.length) {
    return { state:'partial', reason:'Outline needs review for single or repeated video references' };
  }
  return { state:'matched', title:course.title?.trim(), source, lessons };
}
