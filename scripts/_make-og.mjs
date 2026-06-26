import sharp from 'sharp';
import fs from 'node:fs';

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0a1633"/>
      <stop offset="1" stop-color="#060f24"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.85" cy="0.1" r="0.6">
      <stop offset="0" stop-color="#c0392b" stop-opacity="0.5"/>
      <stop offset="1" stop-color="#c0392b" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <g transform="translate(90,150)">
    <rect width="96" height="96" rx="24" fill="#c0392b"/>
    <circle cx="41" cy="41" r="22" stroke="#ffffff" stroke-width="7" fill="none"/>
    <line x1="57" y1="57" x2="78" y2="78" stroke="#ffffff" stroke-width="9" stroke-linecap="round"/>
    <rect x="29" y="42" width="6" height="10" rx="2" fill="#f0a019"/>
    <rect x="38" y="35" width="6" height="17" rx="2" fill="#f0a019"/>
    <rect x="47" y="28" width="6" height="24" rx="2" fill="#f0a019"/>
  </g>
  <text x="210" y="222" font-family="Arial, Helvetica, sans-serif" font-size="64" font-weight="700" fill="#ffffff">Topeka <tspan fill="#e74c3c">SEO &amp; PPC</tspan></text>
  <text x="92" y="330" font-family="Arial, Helvetica, sans-serif" font-size="50" font-weight="700" fill="#ffffff">Prices upfront. One client per industry.</text>
  <text x="92" y="392" font-family="Arial, Helvetica, sans-serif" font-size="32" font-weight="400" fill="#a39e96">SEO, Google Ads &amp; websites that win Google in Topeka, KS.</text>
  <g transform="translate(92,470)">
    <rect width="250" height="56" rx="28" fill="#f0a019"/>
    <text x="125" y="37" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="26" font-weight="700" fill="#1a1a1a">$0 agency fee on ads</text>
  </g>
  <text x="92" y="585" font-family="Arial, Helvetica, sans-serif" font-size="26" font-weight="400" fill="#78736b">Born and raised in Topeka  ·  by ServiceLine Pro</text>
</svg>`;

await sharp(Buffer.from(svg)).png().toFile('public/media/og-default.png');
const st = fs.statSync('public/media/og-default.png');
console.log('og-default.png written:', st.size, 'bytes');
