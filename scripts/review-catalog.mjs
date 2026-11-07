import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const root = new URL('../dist/', import.meta.url);
const records = JSON.parse(await readFile(new URL('nptel.json', root), 'utf8'));
const file = new URL('reviews.json', root);
const reviews = JSON.parse(await readFile(file, 'utf8'));
const [id, status, ...reasonParts] = process.argv.slice(2);
if (!id) {
  const stats = records.reduce((counts, row) => {
    const state = reviews[row.id]?.status || 'pending';
    counts[state] = (counts[state] || 0) + 1;
    return counts;
  }, {});
  console.log(stats);
  console.table(records.filter(row => !reviews[row.id]).slice(0, 15).map(({ id, title, subject, source }) => ({ id, title, subject, source })));
} else {
  const reason = reasonParts.join(' ').trim();
  if (!records.some(row => row.id === id) || !['approved', 'excluded'].includes(status) || !reason) {
    throw Error('Usage: npm run catalog:review -- <course-id> <approved|excluded> <review notes>');
  }
  reviews[id] = { status, reason, reviewedAt: new Date().toISOString() };
  await writeFile(fileURLToPath(file), JSON.stringify(reviews, null, 2) + '\n');
}
