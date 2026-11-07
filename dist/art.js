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

export function art(kind) {
  let lines = '';
  if (kind === 'mind') {
    for (let i = 0; i < 17; i++) lines += '<ellipse cx="181" cy="85" rx="' + (18+i*4) + '" ry="63" transform="rotate(' + (i*10-25) + ' 181 85)" opacity=".45"/>';
  } else if (kind === 'land') {
    for (let i = 0; i < 15; i++) lines += '<path d="M-20 ' + (75+i*8) + 'Q83 ' + (2+i*7) + ' 165 ' + (74+i*4) + 'T350 ' + (61+i*8) + '" opacity=".66"/>';
    lines += '<circle cx="235" cy="54" r="24" fill="#deded9"/><path d="M235 24v60M205 54h60" opacity=".5"/>';
  } else if (kind === 'language') {
    lines = '<path d="M78 41h139v68H135l-35 24v-24H78z" fill="#e4e4df"/><path d="M166 76h93v53h-17v19l-31-19h-45z" fill="#d1d1cb"/><path d="M101 66h87m-87 12h54m36 21h51m-51 9h34" stroke-width="2"/>';
  } else if (kind === 'code') {
    lines = '<path d="M72 37h185v102H72z" fill="#e1e1dd"/><path d="M72 57h185m-157 25-13 11 13 11m38-22 13 11-13 11m-10-26-12 32m62-21h59m-59 13h39"/><circle cx="85" cy="47" r="2"/><circle cx="94" cy="47" r="2"/><circle cx="103" cy="47" r="2"/>';
  } else {
    for (let i = 0; i < 12; i++) lines += '<rect x="' + (112+i*4) + '" y="' + (29+i*4) + '" width="108" height="108" transform="rotate(' + (i*6) + ' 165 84)" opacity=".43"/>';
  }
  return '<svg aria-hidden="true" viewBox="0 0 330 180" preserveAspectRatio="xMidYMid slice"><rect width="330" height="180" fill="#eaeae6"/><path d="M0 90h330M165 0v180" stroke="#d5d5d0" stroke-dasharray="2 5"/><g fill="none" stroke="#424241" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round">' + lines + '</g><path d="M307 158v9m-5-4.5h10" stroke="#787873"/></svg>';
}
