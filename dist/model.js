export const pageSize = 24;

export function mergeCatalog(curated, indexed, reviews) {
  const titleKey = item => item.title.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '');
  const titles = new Set(curated.map(titleKey));
  return [...curated, ...indexed.filter(item => {
    if (reviews[item.id]?.status === 'excluded' || titles.has(titleKey(item))) return false;
    titles.add(titleKey(item));
    return true;
  }).map(item => reviews[item.id]?.status === 'approved' ? { ...item, review: 'approved' } : item)];
}

export function searchCatalog(items, filters = {}) {
  const words = normalize(filters.q).split(/\s+/).filter(Boolean);
  const result = [];
  for (const item of items) {
    if (filters.subject && item.subject !== filters.subject) continue;
    if (filters.discipline && item.discipline !== filters.discipline) continue;
    if (filters.format && item.format !== filters.format) continue;
    if (filters.level && item.level !== filters.level) continue;
    if (filters.access && item.access !== filters.access) continue;
    if (filters.duration && !(item.duration > 0 && item.duration <= Number(filters.duration))) continue;
    if (filters.language && item.language !== filters.language) continue;
    if (filters.target && item.targetLanguage !== filters.target) continue;
    if (filters.captions && !item.captions) continue;
    if (filters.practice && !item.lessons?.some(lesson => lesson.practice)) continue;
    const title = normalize(item.title);
    const text = normalize([item.title, item.searchAlias, item.summary, item.provider, item.subject, item.discipline, item.targetLanguage, item.language].filter(Boolean).join(' '));
    if (!words.every(word => text.includes(word))) continue;
    const score = words.reduce((sum, word) => sum + (title.includes(word) ? 3 : 1), 0);
    result.push({ item, score });
  }
  return result.sort((a, b) => b.score - a.score).map(row => row.item);
}

function normalize(value = '') {
  return value.toLowerCase().normalize('NFKD').replace(/\p{M}/gu, '');
}

export function nextLesson(item, activity, key = (_, index) => index) {
  if (!item.lessons?.length) return 0;
  const done = new Set(activity?.done || []);
  const next = item.lessons.findIndex((_, index) => !done.has(key(item, index)));
  return next < 0 ? 0 : next;
}

export function readStudy(storage) {
  try {
    const value = JSON.parse(storage.getItem('open-syllabus-study-v1'));
    if (value?.items && !Array.isArray(value.items) && typeof value.items === 'object') return value;
  } catch { /* A new notebook is available when storage is unavailable. */ }
  return { items: {} };
}

export function writeStudy(storage, state) {
  try {
    storage.setItem('open-syllabus-study-v1', JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}
