import sharp from 'sharp';
import fs from 'node:fs';
const dir = 'public/media/team';
const jobs = [
  { in: 'william-hamilton.webp', out: 'william-hamilton.webp', w: 720, h: 720, fit: 'cover' },
  { in: 'victoria-hamilton.webp', out: 'victoria-hamilton.webp', w: 720, h: 760, fit: 'cover' },
  { in: 'team-photo.webp', out: 'team-photo.webp', w: 1200, fit: 'inside' },
];
for (const j of jobs) {
  const src = `${dir}/${j.in}`;
  if (!fs.existsSync(src)) { console.log('skip', j.in); continue; }
  const buf = fs.readFileSync(src);
  let img = sharp(buf).rotate();
  if (j.h) img = img.resize(j.w, j.h, { fit: j.fit, position: 'top' });
  else img = img.resize(j.w, null, { fit: j.fit });
  const out = await img.webp({ quality: 82 }).toBuffer();
  fs.writeFileSync(`${dir}/${j.out}`, out);
  console.log(j.out, out.length, 'bytes');
}
// clean up unused downloads that failed to parse
for (const f of ['daniel-gomez.webp','kevin-morales.webp','jonah-galobardi.webp']) {
  const p = `${dir}/${f}`;
  if (fs.existsSync(p)) { fs.unlinkSync(p); console.log('removed', f); }
}
