import fs from 'node:fs';
import path from 'node:path';

const outFile = process.argv[2];
const root = process.argv[3] || '.';
const raw = fs.readFileSync(outFile, 'utf8');

// The .output file is a JSON object; the items live under .result (or
// the first array-valued property).
const parsed = JSON.parse(raw);
let items = Array.isArray(parsed) ? parsed : parsed.result;
if (!Array.isArray(items)) {
  items = Object.values(parsed).find((v) => Array.isArray(v));
}
if (!Array.isArray(items)) throw new Error('Could not locate items array in output file');

function decode(s) {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&rsquo;/g, '’')
    .replace(/&lsquo;/g, '‘')
    .replace(/&ldquo;/g, '“')
    .replace(/&rdquo;/g, '”')
    .replace(/&mdash;/g, ',')
    .replace(/—/g, ',')   // strip any stray em dashes
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ');
}

let svc = 0, post = 0;
for (const it of items) {
  if (!it || !it.markdown) continue;
  const dir = it.kind === 'post' ? 'src/content/blog' : 'src/content/services';
  const file = path.join(root, dir, `${it.slug}.md`);
  let md = decode(it.markdown).replace(/\r\n/g, '\n').trim() + '\n';
  fs.writeFileSync(file, md, 'utf8');
  if (it.kind === 'post') post++; else svc++;
  console.log(`wrote ${file} (${md.length} chars)`);
}
console.log(`\nDone: ${svc} services, ${post} posts`);
