<div align="center">

# Open Syllabus

**A quiet, monochrome study library for open courses, guided learning paths, and lectures worth exploring.**

Learn anything. Go deeper. — free, self-paced, and sourced from the educators who publish it.

[![CI](https://github.com/Gacaca6/open-syllabus/actions/workflows/ci.yml/badge.svg)](https://github.com/Gacaca6/open-syllabus/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D22-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

</div>

---

Open Syllabus brings independent learning material into one searchable, distraction-free
library. It indexes thousands of open course listings, pairs a hand-curated layer of
guided starters with them, and plays official lesson sequences through the provider's
own YouTube embeds — in the order the educator published them.

No accounts, no tracking, no build step. Your notes, saved courses, and progress stay in
your browser.

## Highlights

- **Searchable catalog** with filters for subject, discipline, format, level, time, study
  location, teaching language, target language, captions, and practice.
- **Official video sequences.** Matched courses play their full provider-published lesson
  outline, grouped into the provider's own units/chapters.
- **Guided starters & learning paths** that sequence selected lessons across providers.
- **Skill feed** — a shuffled shelf of hand-picked YouTube videos that each teach one
  concrete skill, from prompt engineering to Photoshop to public speaking. Filter by
  topic, search, shuffle, mark videos as watched, and resume them from your study space.
- **A focused player** using the official, privacy-respecting YouTube embed, loaded only
  when you ask for it.
- **Personal study space** — save courses, keep a notebook, answer practice prompts, and
  track progress, all stored locally in your browser.
- **Source library** for provider materials whose full video sequence is still being
  traced, so nothing is hidden or overstated.

## Quick start

Requires **Node.js 22+**. There are no package dependencies and no build step.

```sh
git clone https://github.com/Gacaca6/open-syllabus.git
cd open-syllabus
npm run dev
```

Open <http://127.0.0.1:4173>. Run the tests with `npm test`.

The app is plain ES modules served from `dist/` and uses hash-based routes, so the
`dist/` directory deploys to **any static host** without rewrite rules.

## How the catalog works

The release includes thousands of distinct source listings plus a smaller hand-curated
layer. Source-listed items are indexed from the official NPTEL course directory and are
labeled as *provider listings* until reviewed individually. Guided starters cover
selected lessons and link to the provider's full course.

```sh
npm run catalog:import     # refresh the NPTEL snapshot
npm run catalog:review     # list review decisions
npm run catalog:review -- nptel-101101079 approved "Checked official sequence, lesson availability, and provider attribution"
npm run catalog:review -- nptel-101101079 excluded "Core lessons are inaccessible"
npm test
```

The importer uses a public NPTEL catalog snapshot, excludes active runs and short event
categories, deduplicates titles and IDs, and preserves the existing snapshot if a new
import yields fewer than 2,000 entries. Review decisions live in `dist/reviews.json` and
are applied independently of the import. Hand-curated courses and paths live in
`dist/curated.js`.

Video sequences are traced from official provider outlines and published as sharded JSON
under `dist/video-data/`, so a course loads only the shard it needs. Coverage and
unresolved listings are recorded honestly in `dist/video-data/coverage.json`.

For each approval, open the provider page and verify the title, usable lesson sequence,
availability, access requirements, and attribution. Add language, duration, subtitle, or
exercise metadata only when the provider supports the claim. Course videos, audio,
exercises, and transcripts belong to their respective providers.

## Contributing

Open Syllabus exists to facilitate learning, and it gets better with every review,
accessibility fix, and clarified doc. Whether you want to verify a course, report broken
playback, improve the interface, or propose a learning path — start here:

- [Contributing guide](CONTRIBUTING.md) — setup, code guidelines, catalog reviews, and the
  pull-request process.
- [Code of Conduct](CODE_OF_CONDUCT.md) — our commitment to a welcoming community.
- [Open an issue](https://github.com/Gacaca6/open-syllabus/issues/new/choose) — bug
  reports and feature requests use guided templates.

Good first contributions: review a provider listing, fix a mobile layout edge case, or
improve a practice prompt.

## Privacy & playback

Notes, saved courses, and progress are stored in your browser only. Loading an embedded
video connects your browser to YouTube and uses YouTube's player and policies. Playback
availability may vary by video and region; every course links back to its official source.

## Research references

| Pattern | Reference |
| --- | --- |
| Provider catalogs, normalized records, and source attribution | [OERSI](https://gitlab.com/oersi), [MIT Learn](https://github.com/mitodl/mit-learn), [Class Central](https://www.classcentral.com/about), [Schema.org Course](https://schema.org/Course) |
| Community lists and guided curricula | [OSSU](https://github.com/ossu/computer-science), [roadmap.sh](https://roadmap.sh/), [CS Video Courses](https://github.com/Developer-Y/cs-video-courses), [Free Programming Books](https://github.com/EbookFoundation/free-programming-books) |
| Lesson navigation, completion, and a focused player | [Open edX](https://github.com/openedx/frontend-app-learning), [Moodle](https://github.com/moodle/moodle), [Canvas](https://github.com/instructure/canvas-lms), [UnplugLearn](https://unpluglearn.com/), [FreeTube](https://github.com/FreeTubeApp/FreeTube), [Invidious](https://github.com/iv-org/invidious) |
| Practice and feedback | [freeCodeCamp](https://github.com/freeCodeCamp/freeCodeCamp), [Oppia](https://github.com/oppia/oppia), [Perseus](https://github.com/Khan/perseus) |
| Content review and ingestion | [Kolibri](https://github.com/learningequality/kolibri), [Studio](https://github.com/learningequality/studio), [Ricecooker](https://github.com/learningequality/ricecooker) |

These projects informed the design. Open Syllabus implements its own interface and study
workflow. Course sources are credited alongside each listing.

## License

[MIT](LICENSE) © GACACA Godwin. Free to use, modify, and share — please keep the credit to
original course providers intact.