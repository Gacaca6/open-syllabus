const paths = {
 home:'M3 11 12 4l9 7v9h-6v-6H9v6H3z',
 grid:'M4 4h6v6H4z M14 4h6v6h-6z M4 14h6v6H4z M14 14h6v6h-6z',
 route:'M6 5a2 2 0 1 0 0 4 2 2 0 0 0 0-4z M18 15a2 2 0 1 0 0 4 2 2 0 0 0 0-4z M8 7h6a3 3 0 0 1 0 6h-4a2 2 0 0 0 0 4h6',
 book:'M12 6v14M12 7C9 4 5 4 3 5v13c4-1 7 0 9 2 2-2 5-3 9-2V5c-2-1-6-1-9 2Z',
 search:'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14z M16 16l4 4',
 arrow:'M4 12h15m-6-6 6 6-6 6',
 back:'M20 12H5m6-6-6 6 6 6',
 external:'M13 5h6v6m0-6-9 9m7-1v6H5V7h6',
 save:'M6 4h12v16l-6-4-6 4z',
 play:'M8 5l12 7-12 7z',
 menu:'M4 6h16M4 12h16M4 18h16',
 close:'M5 5l14 14M19 5 5 19',
 check:'m5 12 4 4L19 6',
 brain:'M12 6c-2-4-7-2-7 1-3 1-3 5-1 6-2 3 0 6 3 6 1 3 5 2 5-1m0-12c2-4 7-2 7 1 3 1 3 5 1 6 2 3 0 6-3 6-1 3-5 2-5-1M12 6v12M5 7c0 2 2 3 3 3m11-3c0 2-2 3-3 3',
 sprout:'M12 21v-8M12 14C5 14 3 9 3 6c5 0 9 2 9 8Zm0 0c0-6 4-9 9-9 0 5-4 9-9 9Z',
 language:'M3 5h12v10H8l-4 3v-3H3z M17 9h4v10h-3v2l-3-2h-4v-2M6 9h6m-3-2v5',
 code:'m8 6-6 6 6 6m8-12 6 6-6 6m-2-14-4 16',
 spark:'M12 2v20M2 12h20M5 5l14 14M19 5 5 19',
 clock:'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M12 7v5l3 2',
 headphones:'M4 14v-2a8 8 0 0 1 16 0v2M4 12h4v7H4zm12 0h4v7h-4z',
 info:'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M12 11v6m0-10v.1',
 briefcase:'M4 8h16v12H4z M9 8V5h6v3 M4 13h16',
 palette:'M12 3a9 9 0 1 0 0 18c2 0 3-1 3-2.5S14 16 14 15s1-2 2.5-2H19a2 2 0 0 0 2-2c0-4.5-4-8-9-8z M8 10v.1M12 7v.1M16 10v.1',
 draft:'M12 3v4 M12 7a2 2 0 1 0 0 4 2 2 0 0 0 0-4z M10.5 10.5 5 21 M13.5 10.5 19 21 M7 17h10',
 robot:'M7 9h10v9H7z M12 9V5 M12 5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z M4 12v3 M20 12v3 M10 13v.1M14 13v.1 M10 16h4',
 megaphone:'M3 10v4l4 1 3 5h2l-1-5 9 4V5L10 9H3z M20 9v6',
 chart:'M4 20h16 M7 20v-7 M12 20V6 M17 20v-10',
 globe:'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M3 12h18 M12 3c3 3 3 15 0 18-3-3-3-15 0-18z',
 pen:'M4 20l1-4L16 5l3 3L8 19l-4 1z M14 7l3 3',
};

export const icon = (name) => '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + (paths[name] || paths.book) + '"/></svg>';

export const subjectIcon = { Psychology:'brain', Agriculture:'sprout', Languages:'language', Computing:'code', Humanities:'book', Science:'spark', Environment:'sprout', Mathematics:'spark' };

export function heroArt() {
  let curves = '';
  for (let index = 0; index < 26; index++) {
    curves += '<ellipse cx="365" cy="153" rx="118" ry="121" transform="rotate(' + (index * 7) + ' 365 153) scale(1 1)" stroke-dasharray="' + (2 + index % 3) + ' 3" opacity=".38"/>';
    curves += '<ellipse cx="365" cy="153" rx="' + (17 + index * 4) + '" ry="121" transform="rotate(-32 365 153)" opacity=".54"/>';
  }
  return '<svg class="hero-art" aria-hidden="true" viewBox="0 0 620 304" preserveAspectRatio="xMidYMid slice"><g fill="none" stroke="#d7d7d2" stroke-width=".65">' + curves + '<path d="M155 153h420M365 14v278" stroke-dasharray="3 6" opacity=".4"/><circle cx="494" cy="76" r="2" fill="#eee"/><circle cx="251" cy="239" r="2" fill="#eee"/></g><text x="509" y="78" fill="#aaa" font-size="8" font-family="monospace">FIG. 01</text></svg>';
}

// Reading order of the four-by-four subject cover sheet.
export const illustratedSubjects = [
  'Agriculture', 'Business', 'Computing', 'Design & arts',
  'Engineering', 'Environment', 'Health', 'History',
  'Humanities', 'Interdisciplinary', 'Languages', 'Mathematics',
  'Psychology', 'Science', 'Society & law', 'Study skills'
];

export function subjectCover(subject) {
  const match = illustratedSubjects.indexOf(subject);
  const index = match < 0 ? illustratedSubjects.indexOf('Study skills') : match;
  const x = -(index % 4) * 100;
  const y = -Math.floor(index / 4) * 100;
  return '<span class="subject-cover" aria-hidden="true"><img src="./images/subject-covers.webp" alt="" width="1672" height="941" decoding="async" style="left:' + x + '%;top:' + y + '%"></span>';
}
