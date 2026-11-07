
import { curated, paths, lectures } from './curated.js';
import { heroArt, icon, subjectCover, subjectIcon } from './art.js';
import { mergeCatalog, nextLesson, pageSize, readStudy, searchCatalog, writeStudy } from './model.js';
import { chapterRuns, createVideoLibrary, lessonKey, linkVideoCatalog, studyKey, videoLesson } from './video-library.js';

const $ = (selector) => document.querySelector(selector);
const shell = $('#shell');
const favorites = ['Psychology', 'Agriculture', 'Languages', 'Computing', 'Humanities', 'Science', 'Environment'];
const featuredIds = ['yale-psychology', 'soil-and-crops', 'harvard-python', 'mit-linear-algebra'];
const count = new Intl.NumberFormat('en');
const safe = (value = '') => String(value).replace(/[&<>"']/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[char]);
const readJson = async (path) => {
  const response = await fetch(path);
  if (!response.ok) throw Error('Could not load ' + path);
  return response.json();
};
const browserStorage = { getItem: key => localStorage.getItem(key), setItem: (key, value) => localStorage.setItem(key, value) };
const videoLibrary = createVideoLibrary(readJson);
const videoErrors = new Set();
let study = readStudy(browserStorage);
let catalog = curated;
let byId = new Map([...curated, ...lectures].map(item => [item.id, item]));
let catalogState = 'loading';
let mobileMenu = false;
let notice = '';

const routeLink = (path, options = {}) => {
  const query = new URLSearchParams(Object.entries(options).filter(([, value]) => value));
  return '#' + path + (query.size ? '?' + query : '');
};
const browseLink = (options) => routeLink('catalog', options);
const courseLink = (item) => routeLink('course/' + item.id);
const watchLink = (item, video = '', tab = '') => routeLink('watch/' + item.id + (video ? '/' + video : ''), { tab });
const lessonLink = (item, index = 0, tab = '') => item.watch ? watchLink(item, item.lessons[index].video, tab) : routeLink('study/' + item.id + '/' + index, { tab });
const external = (href, label, style = 'button outline') => `<a class="${style}" href="${safe(href)}" target="_blank" rel="noopener noreferrer">${safe(label)} ${icon('external')}</a>`;
const link = (href, label, glyph = 'arrow', style = 'text-link') => `<a href="${safe(href)}" class="${style}">${safe(label)} ${icon(glyph)}</a>`;
const action = (id, label, glyph, item, style = 'button outline', more = '') =>
  `<button type="button" class="${style}" data-action="${id}" data-id="${safe(item || '')}" ${more}>${glyph ? icon(glyph) : ''}${safe(label)}</button>`;
const activity = item => study.items[studyKey(item)] || {};
const isSaved = item => Boolean(study.items[item.id]?.saved);
function videoView(item) {
  if (!item?.videoCourse) return null;
  const data = videoLibrary.get(item.videoCourse.shard)?.[item.id];
  return { ...item, ...data, lessons:data?.lessons, watch:true };
}
const primaryStudy = item => item.watch ? item : videoView(item) || item;
const isActive = item => Boolean(activity(item).updated);
const progress = (item, primary = true) => {
  const mode = primary ? primaryStudy(item) : item;
  const entry = activity(mode);
  if (entry.complete) return 100;
  const size = mode.lessons?.length || (mode.watch ? mode.videoCourse.count : 0);
  if (!size) return 0;
  const complete = mode.lessons ? mode.lessons.filter((_, i) => entry.done?.includes(lessonKey(mode, i))).length : entry.done?.length || 0;
  return Math.min(100, Math.round(complete / size * 100));
};
const progressBar = value => `<progress class="progress" value="${value}" max="100" aria-label="Study progress">${value}%</progress>`;
const formatIcon = item => item.format === 'Audio' ? 'headphones' : item.format === 'Video' ? 'play' : 'book';
const badges = item => [item.subject, item.level, item.format, item.language, item.targetLanguage && 'Learn ' + item.targetLanguage, item.duration && item.duration + ' hours'].filter(Boolean);
const section = (title, description, content, extra = '') => `<section class="shelf"><div class="shelf-heading"><div><h2>${safe(title)}</h2>${description ? '<p>' + safe(description) + '</p>' : ''}</div>${extra}</div>${content}</section>`;
const empty = (title, description, extra = '') => `<section class="empty"><h2>${safe(title)}</h2><p>${safe(description)}</p>${extra}</section>`;
const heading = (kicker, title, description = '') => `<header class="page-head"><div class="eyebrow">${safe(kicker)}</div><h1>${safe(title)}</h1><p>${safe(description)}</p></header>`;

function renderCard(item) {
  const href = courseLink(item);
  const saveLabel = isSaved(item) ? 'Remove saved course' : 'Save course';
  return `<article class="card"><a class="card-visual" href="${href}" tabindex="-1" aria-hidden="true">${subjectCover(item.subject)}<span class="card-code">${safe(item.subject)}</span></a>
    ${action('save', '', 'save', item.id, 'icon-btn save-card', 'aria-pressed="' + isSaved(item) + '" aria-label="' + saveLabel + '" title="' + saveLabel + '"')}
    <div class="card-body"><h3><a href="${href}">${safe(item.title)}</a></h3><div class="provider">${safe(item.provider)}</div>
    ${progress(item) ? progressBar(progress(item)) : ''}
    <div class="card-meta">${icon(formatIcon(item))}<span>${item.videoCourse ? 'YouTube' : safe(item.format)}</span><span aria-hidden="true">·</span><span>${item.videoCourse ? count.format(item.videoCourse.count) + ' lessons' : item.lecture ? 'Lecture' : item.access === 'guided' ? 'Study guide' : 'At source'}</span></div></div></article>`;
}
const cards = (items, extra = '') => `<div class="grid ${extra}">${items.map(renderCard).join('')}</div>`;
const pathTile = path => `<a class="path-tile" href="#path/${path.id}"><span class="box-icon">${icon(path.icon)}</span><div><h3>${safe(path.title)}</h3><p>${safe(path.description)}</p></div></a>`;

function discover() {
  const recent = catalog.filter(item => isActive(primaryStudy(item)) && progress(item) < 100)
    .sort((a, b) => activity(primaryStudy(b)).updated - activity(primaryStudy(a)).updated).slice(0, 4);
  const available = catalog.filter(item => item.videoCourse);
  const featured = [...new Map([...featuredIds.map(id => byId.get(id)).filter(item => item?.videoCourse), ...available.slice(0, 4)].map(item => [item.id, item])).values()].slice(0, 4);
  return `<section class="hero">${heroArt()}<div class="hero-copy">
    <div class="eyebrow">The self-taught library</div><h1>Learn anything.<br>Go deeper.</h1>
    <p>University courses, practical skills, and ideas worth sitting with. Find your starting point and study at your own pace.</p>
    ${link('#catalog', 'Explore the library', 'arrow', 'button light')}</div><div class="folio">OPEN SYLLABUS / VOL. 01</div></section>
    ${recent.length ? section('Continue studying', 'Pick up where you left off.', cards(recent), link('#study-space', 'My study')) : ''}
    ${section('Browse by subject', '', '<div class="subject-grid">' + favorites.map(subject => `<a class="subject-tile" href="${browseLink({subject})}">${subjectCover(subject)}<span class="subject-name">${safe(subject)}</span></a>`).join('') + '</div><div class="chips topic-shortcuts"><a class="chip" href="' + browseLink({discipline:'Textile Engineering'}) + '">Textiles &amp; apparel</a><a class="chip" href="' + browseLink({discipline:'Engineering Design'}) + '">Engineering design</a></div>', link('#catalog', 'All subjects'))}
    ${featured.length ? section('Start a full course', 'Official YouTube lessons in the order their educators list them.', cards(featured, 'featured'), link('#catalog', 'View catalog')) : ''}
    ${section('Learning paths', 'Build toward a goal with a sequence you can follow.', '<div class="paths">' + paths.slice(0, 3).map(pathTile).join('') + '</div>', link('#paths', 'All paths'))}
    ${section('Explore an idea', 'A question worth making time for.', cards(lectures), link(browseLink({ type:'lectures' }), 'All lectures'))}`;
}

const filterDefinitions = [
  ['subject','Subject'], ['discipline','Discipline'], ['format','Format'], ['level','Level'], ['duration','Time'], ['access','Where to study'],
  ['language','Teaching language'], ['target','Language to learn'], ['captions','Captions'], ['practice','Practice']
];
const options = {
  duration: [['2','Up to 2 hours'], ['8','Up to 8 hours'], ['24','Up to 24 hours']],
  access: [['guided','Study guide'], ['source','At source']],
  captions: [['yes','Source transcript available']],
  practice: [['yes','Guide includes practice']]
};
function filterValues(key, items) {
  if (options[key]) return options[key];
  const property = key === 'target' ? 'targetLanguage' : key;
  return [...new Set(items.map(item => item[property]).filter(Boolean))].sort().map(value => [value, value]);
}

function catalogView(params) {
  const type = ['lectures','sources','paths'].includes(params.get('type')) ? params.get('type') : 'courses';
  const items = type === 'lectures' ? lectures : catalog.filter(item => type === 'sources' ? !item.videoCourse : item.videoCourse);
  const filters = Object.fromEntries(params);
  const results = searchCatalog(items, filters);
  const pathResults = paths.filter(path => [path.title, path.description, ...path.items.map(id => byId.get(id)?.title)].join(' ').toLowerCase().includes((filters.q || '').trim().toLowerCase()));
  const resultCount = type === 'paths' ? pathResults.length : results.length;
  const pages = Math.max(1, Math.ceil(results.length / pageSize));
  const page = Math.max(1, Math.min(pages, parseInt(filters.page, 10) || 1));
  const titles = { courses:'YouTube courses', paths:'Learning paths', lectures:'Lectures', sources:'Source library' };
  const viewTabs = Object.entries(titles).map(([key, title]) => {
    const href = browseLink({ type:key === 'courses' ? '' : key, q:filters.q });
    return `<a href="${href}" class="chip ${type === key ? 'selected' : ''}" ${type === key ? 'aria-current="page"' : ''}>${title}</a>`;
  }).join('');
  const controls = type === 'paths' ? '' : filterDefinitions.map(([key, label]) => {
    const values = filterValues(key, items);
    if (!values.length || (type === 'courses' && ['access', 'format'].includes(key))) return '';
    return `<div class="filter-field"><label for="filter-${key}">${label}</label><select id="filter-${key}" name="${key}"><option value="">Any</option>${values.map(([value, title]) => `<option value="${safe(value)}" ${filters[key] === value ? 'selected' : ''}>${safe(title)}</option>`).join('')}</select></div>`;
  }).join('');
  return `${heading('Library', 'Explore the catalog', type === 'sources' ? 'Browse provider materials and courses whose full YouTube sequence is still being traced.' : 'Find official YouTube course sequences, learning paths, and lectures.')}
    <nav class="chips" aria-label="Catalog types">${viewTabs}</nav>
    <form class="filters" data-form="filter"><input type="hidden" name="type" value="${type === 'courses' ? '' : type}">
      <label class="filter-query">Search keywords<input name="q" value="${safe(filters.q || '')}" type="search" placeholder="Try soil, memory, or French"></label>
      ${controls}<button class="button">Apply</button><a href="${browseLink({type:type === 'courses' ? '' : type})}" class="button outline">Clear</a>
    </form>
    <p class="catalog-note" role="status">${count.format(resultCount)} ${resultCount === 1 ? 'result' : 'results'}${catalogState === 'loading' ? ' · Loading source catalog…' : catalogState === 'error' ? ' · Source catalog unavailable. Curated courses are still accessible.' : ''}</p>
    <div class="shelf">${resultCount ? type === 'paths' ? '<div class="paths">' + pathResults.map(pathTile).join('') + '</div>' : cards(results.slice((page - 1) * pageSize, page * pageSize)) : empty('No results', 'Try a broader term or remove a filter.', link('#catalog', 'Reset search'))}</div>
    ${type !== 'paths' && pages > 1 ? `<nav class="pagination" aria-label="Result pages">
      ${page > 1 ? link(browseLink({ ...filters, page:page - 1 }), 'Previous', 'back', 'button outline') : ''}
      <span>Page ${page} of ${pages}</span>
      ${page < pages ? link(browseLink({ ...filters, page:page + 1 }), 'Next', 'arrow', 'button outline') : ''}
    </nav>` : ''}`;
}

function outline(item, active = -1) {
  const done = new Set(activity(item).done || []);
  const row = (lesson, i) => `<li><a href="${lessonLink(item, i)}" class="${i === active ? 'current' : ''}" ${i === active ? 'aria-current="step"' : ''}><span class="number">${String(i + 1).padStart(2, '0')}</span>${safe(lesson.title)}${done.has(lessonKey(item, i)) ? '<span class="sr">Complete</span>' + icon('check') : icon(lesson.video ? 'play' : 'book')}</a></li>`;
  const list = rows => '<ol class="outline-list">' + rows.join('') + '</ol>';
  if (!item.watch) return list(item.lessons.map(row));
  const chapters = chapterRuns(item.lessons);
  if (chapters.length === 1) return list(item.lessons.map(row));
  return '<div class="chapter-list">' + chapters.map(({ title, lessons }, group) => `<details ${lessons.some(({ index }) => index === active) || (active === -1 && group === 0) ? 'open' : ''}><summary>${safe(title)} <span class="muted">${lessons.length}</span></summary>${list(lessons.map(({ lesson, index }) => row(lesson, index)))}</details>`).join('') + '</div>';
}

function fullOutline(item) {
  const video = videoView(item);
  const resources = video.resources?.map(resource => external(resource.source, resource.title)).join('') || '';
  return `<section class="panel"><h2>Official video outline</h2>
    <p class="small muted">${count.format(item.videoCourse.count)} video lessons in the provider’s published order. YouTube availability may vary by video and region.</p>
    ${video.lessons ? outline(video) : videoErrors.has(item.id) ? action('retry-outline', 'Retry loading outline', 'arrow', item.id) : '<p role="status">Loading the lesson outline…</p>'}
    ${resources ? '<div class="button-row course-materials">' + resources + '</div>' : ''}</section>`;
}

function renderCourse(item) {
  const entry = activity(item);
  const label = item.videoCourse ? 'YouTube course' : item.lecture ? 'Lecture' : item.access === 'guided' ? 'Guided start' : 'Study at source';
  const about = item.review === 'indexed' ? 'This listing comes from the provider’s course directory. Open the course to check current lesson access, prerequisites, and materials.'
    : 'Study the original material with its provider. Your notes and self-reported progress stay in this browser.';
  return `<nav class="breadcrumb"><a href="#catalog">Library</a> / ${safe(item.subject)}</nav>
    ${heading(label, item.title, item.provider)}
    <div class="detail"><div>
      <section class="panel"><h2>What you’ll study</h2><p class="lead">${safe(item.summary || (item.videoCourse ? 'Follow the provider’s official lesson sequence and keep your progress in one place.' : about))}</p>
      <div class="tags">${badges(item).map(value => `<span class="tag">${safe(value)}</span>`).join('')}</div>
      ${item.outcome ? `<h3>Learning goal</h3><p class="muted">${safe(item.outcome)}</p>` : ''}
      ${item.prerequisites ? `<h3>Before you begin</h3><p class="muted">${safe(item.prerequisites)}</p>` : ''}
      <div class="button-row">
        ${item.videoCourse ? link(watchLink(item), isActive(videoView(item)) ? 'Continue studying' : 'Start course', 'arrow', 'button') : item.lessons ? link(lessonLink(item, nextLesson(item, entry)), isActive(item) ? 'Continue studying' : 'Start learning', 'arrow', 'button') : external(item.source, 'Open provider course', 'button')}
        ${action('save', entry.saved ? 'Saved' : 'Save', 'save', item.id, 'button outline', 'aria-pressed="' + Boolean(entry.saved) + '"')}
        ${!item.lessons && !item.videoCourse ? action('begin', entry.complete ? 'Completed' : entry.updated ? 'In my study' : 'Track in my study', 'check', item.id, 'button outline', entry.complete ? 'disabled' : '') : ''}
      </div></section>
      ${item.videoCourse ? fullOutline(item) : ''}
      ${item.lessons ? `<section class="panel"><h2>${item.lecture ? 'Lecture' : item.videoCourse ? 'Optional study guide' : 'Guide outline'}</h2><p class="small muted">These selected lessons include additional study prompts.</p>${outline(item)}</section>`
      : item.videoCourse ? ''
      : `<section class="panel"><h2>Study notebook</h2>${noteForm(item, 'course', 'Write a course note')}<div class="study-actions">${action('complete-source', entry.complete ? 'Undo completion' : 'Mark course complete', 'check', item.id)}</div></section>`}
    </div><aside class="panel"><div class="details-art">${subjectCover(item.subject)}</div><h3>Original source</h3><p class="muted small">${safe(item.provider)}</p>${external(item.source, 'Visit source')}
      <p class="muted small">${item.videoCourse ? 'Lesson sequence sourced from the provider' : item.review === 'indexed' ? 'Provider-listed course' : item.review === 'approved' ? 'Reviewed source listing' : 'Curated starting point'}</p>
      ${item.videoCourse?.source !== item.source && item.videoCourse ? external(item.videoCourse.source, 'Official video outline') : ''}
      ${item.parent && byId.has(item.parent) ? link(courseLink(byId.get(item.parent)), 'View full course') : ''}
    </aside></div>`;
}

function noteForm(item, key, label) {
  return `<form class="note" data-form="note" data-id="${item.id}" data-key="${key}"><label for="note-text">${safe(label)}</label>
    <textarea id="note-text" name="note" maxlength="12000" placeholder="Capture an idea, question, or example…">${safe(activity(item).notes?.[key] || '')}</textarea>
    <div class="button-row"><button class="button">Save note</button><p class="status" role="status">${safe(notice)}</p></div>
  </form>`;
}

function renderLesson(item, index, params) {
  const lesson = item.lessons[index];
  const tab = ['notes', 'practice', 'outline'].includes(params.get('tab')) ? params.get('tab') : 'overview';
  const key = lessonKey(item, index);
  const completed = activity(item).done?.includes(key);
  const value = progress(item, false);
  const source = lesson.source || item.videoCourse?.source || item.source;
  const selected = (key, label) => `<a class="${key === tab ? 'current' : ''}" href="${lessonLink(item, index, key === 'overview' ? '' : key)}" ${key === tab ? 'aria-current="page"' : ''}>${label}</a>`;
  const panels = {
    overview: `<h2>Lesson overview</h2><p class="lead">${safe(lesson.takeaways || 'Work through the lesson at your own pace, then try the activity under Practice.')}</p><p>${external(source, 'Open lesson materials')}</p>`,
    notes: noteForm(item, String(key), 'Your lesson notes'),
    practice: `<h2>Put it into practice</h2><p class="lead">${safe(lesson.practice || 'Summarize the key idea in your own words and test it with an example.')}</p><div style="margin-top:16px">${noteForm(item, 'practice-' + key, 'Your response')}</div>`,
    outline: `<h2>${item.watch ? 'Course outline' : 'Guide outline'}</h2>${outline(item, index)}`
  };
  return `<nav class="breadcrumb"><a href="#catalog">Library</a> / <a href="${courseLink(item)}">${safe(item.title)}</a></nav>
    ${heading('Study · Lesson ' + (index + 1) + ' of ' + item.lessons.length, lesson.title, item.provider)}
    <div class="detail"><div>
      ${lesson.video ? `<div class="player" id="player">${subjectCover(item.subject)}<div class="play-prompt">
        ${action('play', 'Load YouTube video', 'play', item.id, 'button light', 'data-index="' + index + '"')}<p>Playback uses the official YouTube player.</p></div></div>`
        : `<section class="panel"><h2>${item.format === 'Audio' ? 'Listen at the source' : 'Study at the source'}</h2><p class="lead">Open the provider’s material, then return here for practice, notes, and progress.</p><p>${external(lesson.source, 'Open lesson source', 'button')}</p></section>`}
      <div class="study-actions"><div class="button-row">
        ${action('complete-lesson', completed ? 'Undo completion' : 'Mark complete', 'check', item.id, 'button outline', 'data-index="' + index + '" aria-pressed="' + Boolean(completed) + '"')}
        ${lesson.video ? external('https://www.youtube.com/watch?v=' + lesson.video, 'Watch on YouTube', 'text-link') : ''}</div>
        ${index + 1 < item.lessons.length ? link(lessonLink(item, index + 1), 'Next lesson') : link(courseLink(item), 'Back to course', 'back')}
      </div>
      <section class="panel study-tool-panel"><nav class="study-tabs" aria-label="Study tools">${selected('overview','Overview')}${selected('outline','Outline')}${selected('notes','Notes')}${selected('practice','Practice')}</nav>${panels[tab]}</section>
    </div><aside class="panel"><h2>${item.watch ? 'Course progress' : 'Guide progress'}</h2><p class="small muted">${value}% complete</p>${progressBar(value)}${outline(item, index)}</aside></div>`;
}

function renderPath(path) {
  return `<nav class="breadcrumb"><a href="#paths">Learning paths</a> / ${safe(path.title)}</nav>
    ${heading('Learning path', path.title, path.description)}
    <div class="detail"><section class="panel"><h2>${path.choose ? 'Choose a starting course' : 'Follow this sequence'}</h2>
    <ol class="path-list">${path.items.map((id, index) => {
      const item = byId.get(id);
      return `<li><a href="${courseLink(item)}"><span class="number">${String(index + 1).padStart(2, '0')}</span><div><strong>${safe(item.title)}</strong><div class="provider">${safe(item.provider)}</div></div>${icon(progress(item) === 100 ? 'check' : 'arrow')}</a></li>`;
    }).join('')}</ol></section><aside class="panel"><h2>Try a project</h2><p class="lead">${safe(path.project)}</p></aside></div>`;
}

function studySpace() {
  const entries = Object.keys(study.items).map(key => {
    const [id, mode] = key.split(':');
    return mode === 'youtube' ? videoView(byId.get(id)) : byId.get(id);
  }).filter(Boolean);
  const recent = entries.filter(isActive).sort((a, b) => activity(b).updated - activity(a).updated);
  const saved = entries.filter(item => !item.watch && isSaved(item));
  const notes = entries.flatMap(item => Object.entries(activity(item).notes || {}).filter(([, value]) => value.trim()).map(([key, value]) => {
    const step = key.replace('practice-', '');
    const tab = key.startsWith('practice-') ? 'practice' : 'notes';
    const href = key === 'course' ? courseLink(item) : item.watch ? watchLink(item, step, tab) : lessonLink(item, Number(step), tab);
    const title = item.watch ? item.lessons?.[videoLesson(item, step)]?.title || 'Video lesson' : item.lessons?.[Number(step)]?.title;
    return `<article class="panel"><h3><a href="${href}">${safe(item.title)}${title ? ' · ' + safe(title) : ''}</a></h3><p class="note-preview muted">${safe(value)}</p></article>`;
  }));
  return `${heading('Personal library', 'My study', 'Pick up a lesson, find a saved course, or revisit your notebook. Activity is stored in this browser.')}
    ${recent.length || saved.length || notes.length ? '' : empty('Your study space is ready', 'Save a course or start a guided lesson to make this space your own.', link('#catalog','Explore courses','arrow','button'))}
    ${recent.length ? section('Recent activity', '', cards(recent)) : ''}
    ${saved.length ? section('Saved courses', '', cards(saved)) : ''}
    ${notes.length ? section('Notebook', '', '<div class="paths">' + notes.join('') + '</div>') : ''}`;
}

function about() {
  const matched = catalog.filter(item => item.videoCourse).length;
  return `${heading('About the library', 'A place to teach yourself', 'Open Syllabus brings independent learning material into one searchable library.')}
    <div class="detail"><div><section class="panel"><h2>How the catalog works</h2><p class="lead">${count.format(matched)} courses have a matched YouTube sequence drawn from an official provider outline. Courses without a matched sequence stay in the source library. Lectures and learning paths are listed separately.</p><p class="muted">Playback depends on YouTube and may vary by region. Each course links back to the official source.</p></section>
    <section class="panel"><h2>Privacy and playback</h2><p class="lead">Notes, saved courses, and progress are stored in your browser. Loading an embedded video connects your browser to YouTube and uses YouTube’s player and policies.</p></section></div>
    <aside class="panel"><h2>Primary sources</h2><div class="button-row">${external('https://nptel.ac.in/courses','NPTEL')}${external('https://oyc.yale.edu/courses','Open Yale Courses')}${external('https://ocw.mit.edu/','MIT OpenCourseWare')}${external('https://www.open.edu/openlearn/','OpenLearn')}${external('https://www.languagetransfer.org/courses','Language Transfer')}</div></aside></div>`;
}

function navItem(href, glyph, label, active) {
  return `<a href="${safe(href)}" class="${active ? 'active' : ''}" ${active ? 'aria-current="page"' : ''}>${icon(glyph)}<span>${safe(label)}</span></a>`;
}

function locationParts() {
  const [path = '', search = ''] = location.hash.slice(1).split('?');
  return { parts:path.split('/'), params:new URLSearchParams(search) };
}

function activeLesson(view, base, step) {
  const item = view === 'watch' ? videoView(base) : base;
  if (!item?.lessons) return { item, index:-1 };
  if (view === 'watch') return { item, index:step ? videoLesson(item, step) : nextLesson(item, activity(item), lessonKey) };
  return { item, index:/^\d+$/.test(step || '') ? Number(step) : -1 };
}

function render({ focus = false } = {}) {
  const { parts:[view, id, step], params } = locationParts();
  const item = byId.get(id);
  const query = params.get('q') || '';
  const unknown = () => empty('Page unavailable', 'This item may have moved or been removed from the catalog.', link('#catalog', 'Browse the library'));
  let body;
  switch (view) {
    case '': case 'discover': body = discover(); break;
    case 'catalog': body = catalogView(params); break;
    case 'paths': body = heading('Guided learning', 'Learning paths', 'Start with a goal and follow a sequence of courses, practice, and projects.') + '<div class="paths">' + paths.map(pathTile).join('') + '</div>'; break;
    case 'path': { const path = paths.find(path => path.id === id); body = path ? renderPath(path) : unknown(); break; }
    case 'course': body = item ? renderCourse(item) : catalogState === 'loading' ? empty('Loading course', 'Getting the course from the library.') : unknown(); break;
    case 'study':
    case 'watch': {
      const route = activeLesson(view, item, step);
      body = route.item?.lessons?.[route.index] ? renderLesson(route.item, route.index, params)
        : videoErrors.has(id) && view === 'watch' ? empty('Could not load the outline', 'Try again or open the official course.', action('retry-outline', 'Retry loading outline', 'arrow', id))
        : (catalogState === 'loading' || (route.item?.watch && !route.item.lessons)) ? empty('Loading course', 'Getting the official lesson outline.') : unknown();
      break;
    }
    case 'study-space': body = studySpace(); break;
    case 'about': body = about(); break;
    default: body = unknown();
  }
  document.title = (item?.title || ({ catalog:'Course catalog', paths:'Learning paths', 'study-space':'My study' })[view] || 'The self-taught library') + ' · Open Syllabus';
  shell.innerHTML = `<div class="layout">
    <button type="button" class="mobile-overlay ${mobileMenu ? 'open' : ''}" aria-label="Close navigation" data-action="menu"></button>
    <aside class="sidebar ${mobileMenu ? 'open' : ''}" id="navigation"><a class="brand" href="#discover"><img src="./mark.svg" alt="">Open Syllabus</a>
      <nav class="nav" aria-label="Main navigation">
        ${navItem('#discover','home','Discover',!view || view === 'discover')}
        ${navItem('#catalog','grid','Course catalog',view === 'catalog' && !params.get('subject'))}
        ${navItem('#paths','route','Learning paths',view === 'paths' || view === 'path')}
        ${navItem('#study-space','book','My study',view === 'study-space')}
      </nav><div class="section-label">Subjects</div>
      <nav class="nav" aria-label="Subjects">${favorites.map(subject => navItem(browseLink({subject}), subjectIcon[subject], subject, view === 'catalog' && params.get('subject') === subject)).join('')}</nav>
      <div class="sidebar-footer"><a href="#about">${icon('info')} About this library</a></div>
    </aside>
    <header class="topbar">
      ${action('menu', '', mobileMenu ? 'close' : 'menu', '', 'icon-btn menu', 'aria-label="' + (mobileMenu ? 'Close' : 'Open') + ' navigation" aria-controls="navigation" aria-expanded="' + mobileMenu + '"')}
      <form class="top-search" data-form="search" role="search">${icon('search')}<label class="sr" for="top-search">Search the library</label>
        <input id="top-search" name="q" type="search" value="${safe(query)}" placeholder="Search courses, subjects, or skills…"><kbd aria-hidden="true">/</kbd></form>
      <a class="header-link" href="#study-space" aria-label="My study">${icon('book')}<span>My study</span></a>
    </header>
    <main id="main" tabindex="-1" class="content">${notice && !body.includes('role="status">' + safe(notice)) ? '<p class="status" role="status">' + safe(notice) + '</p>' : ''}${body}<footer class="footer"><span>Open Syllabus</span><a href="#about">Catalog sources & privacy</a></footer></main></div>`;
  if (focus) $('#main').focus({ preventScroll:true });
}

function record(item, modify, start = true) {
  const entry = { ...activity(item) };
  modify(entry);
  if (start) entry.updated = Date.now();
  study = { items:{ ...study.items, [studyKey(item)]:entry } };
  return writeStudy(browserStorage, study);
}

function attachVideo(src, title) {
  const player = $('#player');
  if (!player) return;
  const iframe = document.createElement('iframe');
  iframe.src = src;
  iframe.title = title;
  iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
  iframe.allowFullscreen = true;
  iframe.referrerPolicy = 'strict-origin-when-cross-origin';
  player.replaceChildren(iframe);
}

function refreshLocal(button, item) {
  const player = $('#player');
  const iframe = player?.querySelector('iframe');
  if (iframe) {
    const selector = '[data-action="' + button.dataset.action + '"][data-id="' + button.dataset.id + '"]';
    if (button.dataset.action === 'complete-lesson') {
      const next = document.createElement('template');
      next.innerHTML = renderLesson(item, Number(button.dataset.index), locationParts().params);
      button.replaceWith(next.content.querySelector(selector));
      $(selector)?.focus();
      $('.detail aside').replaceWith(next.content.querySelector('.detail aside'));
      if (locationParts().params.get('tab') === 'outline') {
        $('.study-tool-panel').replaceWith(next.content.querySelector('.study-tool-panel'));
      }
    }
    return;
  }
  const selector = '[data-action="' + button.dataset.action + '"][data-id="' + button.dataset.id + '"]';
  render();
  $(selector)?.focus({ preventScroll:true });
}

shell.addEventListener('click', event => {
  const button = event.target.closest('button[data-action]');
  if (!button) {
    if (mobileMenu && event.target.closest('.sidebar a')?.hash === location.hash) {
      mobileMenu = false;
      render({ focus:true });
    }
    return;
  }
  const { action:kind, id, index } = button.dataset;
  const base = byId.get(id);
  const item = locationParts().parts[0] === 'watch' ? videoView(base) : base;
  if (kind === 'menu') {
    mobileMenu = !mobileMenu;
    const menu = $('.menu');
    menu.setAttribute('aria-expanded', String(mobileMenu));
    menu.setAttribute('aria-label', (mobileMenu ? 'Close' : 'Open') + ' navigation');
    $('.sidebar').classList.toggle('open', mobileMenu);
    $('.mobile-overlay').classList.toggle('open', mobileMenu);
    (mobileMenu ? $('.sidebar .brand') : menu).focus();
    return;
  }
  if (!item) return;
  if (kind === 'retry-outline') {
    videoErrors.delete(id);
    enterRoute();
    return;
  }
  if (kind === 'play' && item.lessons?.[index]?.video) {
    attachVideo('https://www.youtube-nocookie.com/embed/' + item.lessons[index].video + '?rel=0', 'YouTube · ' + item.lessons[index].title);
    $('#player iframe')?.focus();
    return;
  }
  let stored;
  if (kind === 'save') stored = record(item, entry => { entry.saved = !entry.saved; }, false);
  if (kind === 'begin') stored = record(item, () => {});
  if (kind === 'complete-source') stored = record(item, entry => { entry.complete = !entry.complete; });
  if (kind === 'complete-lesson') stored = record(item, entry => {
    const done = new Set(entry.done || []);
    const lessonIndex = lessonKey(item, Number(index));
    if (done.has(lessonIndex)) done.delete(lessonIndex); else done.add(lessonIndex);
    entry.done = [...done];
  });
  if (stored === undefined) return;
  notice = stored ? '' : 'Browser storage is unavailable. Changes last until you close this page.';
  refreshLocal(button, item);
});

shell.addEventListener('submit', event => {
  const form = event.target;
  if (!form.dataset.form) return;
  event.preventDefault();
  const values = Object.fromEntries(new FormData(form));
  if (form.dataset.form === 'search' || form.dataset.form === 'filter') {
    values.q = values.q.trim();
    const hash = browseLink(values);
    if (location.hash !== hash) location.hash = hash;
    else render({ focus:true });
    return;
  }
  const base = byId.get(form.dataset.id);
  const item = locationParts().parts[0] === 'watch' ? videoView(base) : base;
  if (!item) return;
  const note = values.note.trim();
  const stored = record(item, entry => {
    entry.notes = { ...entry.notes };
    if (note) entry.notes[form.dataset.key] = note;
    else delete entry.notes[form.dataset.key];
  });
  form.querySelector('.status').textContent = stored ? (note ? 'Note saved on this device.' : 'Note removed.') : 'Saved for this session only.';
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && mobileMenu) { $('.menu').click(); return; }
  if (event.key !== '/' || event.metaKey || event.ctrlKey || event.altKey || /INPUT|SELECT|TEXTAREA/.test(event.target.tagName) || event.target.isContentEditable) return;
  event.preventDefault();
  $('#top-search')?.focus();
});

let lastPath = '';
function enterRoute() {
  const { parts:[view, id, step], params } = locationParts();
  notice = '';
  mobileMenu = false;
  const base = byId.get(id);
  const { item, index } = activeLesson(view, base, step);
  const studying = (view === 'study' || view === 'watch') && item?.lessons?.[index];
  if (view === 'watch' && studying && !step) history.replaceState(null, '', lessonLink(item, index, params.get('tab') || ''));
  const path = [view, id, view === 'watch' && studying ? lessonKey(item, index) : step].join('/');
  if ((view === 'watch' || view === 'course') && base?.videoCourse && !videoView(base).lessons && !videoErrors.has(id)) {
    const pendingHash = location.hash;
    videoLibrary.load(base.videoCourse.shard).then(data => {
      if (!data[id]?.lessons?.length) videoErrors.add(id);
      if (location.hash === pendingHash) enterRoute();
    }).catch(() => {
      videoErrors.add(id);
      if (location.hash === pendingHash) render({ focus:true });
    });
  }
  const panel = $('.study-tool-panel');
  if (studying && path === lastPath && panel) {
    const template = document.createElement('template');
    template.innerHTML = renderLesson(item, index, params);
    const replacement = template.content.querySelector('.study-tool-panel');
    panel.replaceWith(replacement);
    replacement.querySelector('[aria-current="page"]')?.focus({ preventScroll:true });
    return;
  }
  if (studying && path !== lastPath) record(item, () => {});
  lastPath = path;
  render({ focus:true });
  window.scrollTo(0, 0);
}

window.addEventListener('hashchange', enterRoute);
enterRoute();
Promise.all([readJson('./nptel.json'), readJson('./reviews.json'), readJson('./video-data/index.json')]).then(([source, reviews, index]) => {
  catalog = linkVideoCatalog(mergeCatalog(curated, source, reviews), index);
  byId = new Map([...catalog, ...lectures].map(item => [item.id, item]));
  catalogState = 'ready';
  if (!['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) enterRoute();
}).catch(() => {
  catalogState = 'error';
  if (['catalog', 'watch', 'course'].includes(locationParts().parts[0])) render();
});
