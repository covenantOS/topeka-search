import fs from 'node:fs';
import path from 'node:path';

const dirs = ['src/content/services', 'src/content/blog'];
let cleaned = 0, fixed = 0;

for (const dir of dirs) {
  for (const f of fs.readdirSync(dir)) {
    if (!f.endsWith('.md')) continue;
    const fp = path.join(dir, f);
    let txt = fs.readFileSync(fp, 'utf8').replace(/\r\n/g, '\n');
    const before = txt;

    // 1. If it doesn't start with frontmatter, slice from the first '---' line.
    if (!txt.startsWith('---\n')) {
      const lines = txt.split('\n');
      const idx = lines.findIndex((l) => l.trim() === '---');
      if (idx >= 0) txt = lines.slice(idx).join('\n');
    }

    // 2. Strip a trailing code fence (``` or ```markdown left by the polisher).
    txt = txt.replace(/\n```[a-zA-Z]*\s*$/,'\n').trimEnd() + '\n';

    // 3. Strip any stray opening fence right before frontmatter (safety).
    txt = txt.replace(/^```[a-zA-Z]*\n/, '');

    // 4. Validate frontmatter delimiters exist.
    const fm = txt.match(/^---\n([\s\S]*?)\n---\n/);
    if (!fm) { console.warn(`!! ${fp} has no valid frontmatter`); }

    if (txt !== before) fixed++;
    fs.writeFileSync(fp, txt, 'utf8');
    cleaned++;
  }
}
console.log(`Cleaned ${cleaned} files (${fixed} modified).`);
