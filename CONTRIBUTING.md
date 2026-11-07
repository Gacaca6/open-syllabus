# Contributing to Open Syllabus

Thank you for helping make independent learning easier to find. Open Syllabus is a
community-friendly, monochrome study library for open courses, guided learning paths,
and lectures. Contributions of every size are welcome — code, catalog reviews,
documentation, and accessibility fixes all move the mission forward.

By participating, you agree to uphold our [Code of Conduct](CODE_OF_CONDUCT.md).

## Ways to contribute

- **Review a course.** The most valuable contribution is verifying that a listed course
  actually teaches what it claims. See [Catalog reviews](#catalog-reviews) below.
- **Report a bug or broken playback.** Open an issue with the course or lesson URL and
  what you expected versus what happened.
- **Improve the interface.** Accessibility, keyboard navigation, mobile layout, and
  clearer copy are always appreciated.
- **Add a learning path or curated starter.** Propose it in an issue first so we can
  agree on scope and sourcing.
- **Write documentation.** Clarify setup, deployment, or the catalog pipeline.

## Development setup

Requires Node.js 22 or later. There are no package dependencies and no build step.

```sh
git clone https://github.com/Gacaca6/open-syllabus.git
cd open-syllabus
npm run dev     # serves dist/ at http://127.0.0.1:4173
npm test        # runs the Node test suite
```

The app is plain ES modules served from `dist/`. Routes are hash-based, so it works on
any static host without rewrite rules.

## Code guidelines

- Keep the interface monochrome, calm, and readable. Prefer plain HTML, CSS, and
  vanilla ES modules over frameworks or build tooling.
- Match the existing style: small pure functions, no dependencies, no build step.
- Escape all user- and provider-supplied text before inserting it into the DOM
  (see the `safe()` helper in `dist/app.js`).
- Store study activity in the browser only; never add tracking or external analytics.
- Add or update a test in `test/` for any behavior change. `npm test` must pass.

## Catalog reviews

Source listings are indexed from provider directories and are labeled as provider
listings until reviewed individually. To review one:

1. Open the provider page and verify the title, usable lesson sequence, availability,
   access requirements, and attribution.
2. Record the decision:

   ```sh
   npm run catalog:review -- nptel-101101079 approved "Checked official sequence, lesson availability, and provider attribution"
   npm run catalog:review -- nptel-101101079 excluded "Core lessons are inaccessible"
   ```

3. Run `npm test` and open a pull request describing what you verified.

Only add language, duration, subtitle, or exercise metadata when the provider supports
the claim. Course videos, audio, exercises, and transcripts belong to their respective
providers; always credit the source and link to official materials.

## Pull request process

1. Fork the repository and create a branch from `main`.
2. Make your change with a focused commit history and clear commit messages.
3. Ensure `npm test` passes and, for interface changes, check the result in a browser
   at both desktop and mobile widths.
4. Open a pull request using the template. Link any related issue and describe how you
   verified the change.
5. A maintainer will review. Small, well-scoped pull requests are merged fastest.

## Reporting security or privacy issues

Please do not open a public issue for security or privacy problems. Contact the
maintainer privately first (see the repository owner's GitHub profile) so we can
address it before disclosure.

## License

By contributing, you agree that your contributions are licensed under the
[MIT License](LICENSE) that covers this project.