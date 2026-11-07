# Open Syllabus

Open Syllabus is a monochrome study library for open courses, guided learning paths, and lectures worth exploring.

## Run locally

Requires Node.js 22 or later. The application has no package dependencies or build step.

```sh
npm run dev
npm test
```

Open http://127.0.0.1:4173. Deploy the `dist/` directory to a static host. The app uses hash-based routes, so links work on static hosting without rewrite rules.

## Student experience

- Search course records with filters for subject, format, level, time, study location, teaching language, target language, source transcripts, and practice.
- Follow a guided course starter or a path through multiple providers. Explore standalone lectures separately.
- Play selected lectures through the official YouTube embed, or open the original provider for reading, audio, and other materials.
- Save courses, keep a notebook, complete practice prompts, and track progress. This version stores study activity in the current browser.

## Catalog operations

The release includes thousands of distinct source listings and a smaller hand-curated layer. Source-listed items are indexed from the official NPTEL course directory. They are labeled as provider listings until reviewed individually. The source listing count includes no individual lessons or learning paths. Guided starters cover selected lessons and link to the provider’s full course.

```sh
npm run catalog:import
npm run catalog:review
npm run catalog:review -- nptel-101101079 approved "Checked official sequence, lesson availability, and provider attribution"
npm run catalog:review -- nptel-101101079 excluded "Core lessons are inaccessible"
npm test
```

The importer uses a public NPTEL catalog snapshot and supports an optional local copy of the response. It excludes active runs and short event categories, deduplicates course titles and IDs, and preserves the existing snapshot if the next import yields fewer than 2,000 entries. Review decisions live in `dist/reviews.json` and are applied independently of the import. Add hand-curated courses and paths in `dist/curated.js`.

For each approval, open the provider page and verify the title, usable lesson sequence, availability, access requirements, and attribution. Add language, duration, subtitles, or exercise metadata only when the provider supports the claim. Link to third-party learning materials and use official embeds where available. Course videos, audio, exercises, and transcripts belong to their respective providers.

## Research references

| Pattern | Reference |
| --- | --- |
| Provider catalogs, normalized records, and source attribution | [OERSI](https://gitlab.com/oersi), [MIT Learn](https://github.com/mitodl/mit-learn), [Class Central](https://www.classcentral.com/about), [Schema.org Course](https://schema.org/Course) |
| Community lists and guided curricula | [OSSU](https://github.com/ossu/computer-science), [roadmap.sh](https://roadmap.sh/), [CS Video Courses](https://github.com/Developer-Y/cs-video-courses), [Free Programming Books](https://github.com/EbookFoundation/free-programming-books) |
| Lesson navigation, completion, and a focused player | [Open edX](https://github.com/openedx/frontend-app-learning), [Moodle](https://github.com/moodle/moodle), [Canvas](https://github.com/instructure/canvas-lms), [UnplugLearn](https://unpluglearn.com/), [FreeTube](https://github.com/FreeTubeApp/FreeTube), [Invidious](https://github.com/iv-org/invidious) |
| Practice and feedback | [freeCodeCamp](https://github.com/freeCodeCamp/freeCodeCamp), [Oppia](https://github.com/oppia/oppia), [Perseus](https://github.com/Khan/perseus) |
| Content review and ingestion | [Kolibri](https://github.com/learningequality/kolibri), [Studio](https://github.com/learningequality/studio), [Ricecooker](https://github.com/learningequality/ricecooker) |

These projects informed the design. Open Syllabus implements its own interface and study workflow. Course sources are credited alongside each listing.
