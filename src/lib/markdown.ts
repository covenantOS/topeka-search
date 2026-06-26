import { marked } from 'marked';
import YAML from 'yaml';

marked.setOptions({
  gfm: true,
  breaks: false,
});

export function renderMarkdown(md: string): string {
  return marked.parse(md, { async: false }) as string;
}

/**
 * Transform rendered HTML to add visual modules so long-form content
 * reads like a designed page instead of a blog dump:
 *  - 2+ consecutive bold-lead paragraphs -> feature card grid
 *  - single bold-lead paragraph          -> callout box
 *  - lists with 4+ items                  -> two-column visual list
 */
function transformToModules(html: string): string {
  // 1. Consecutive <p><strong>Title.</strong> desc</p> -> feature cards
  html = html.replace(
    /(<p><strong>[^<]+<\/strong>[^<]*<\/p>\s*){2,}/g,
    (match) => {
      const cards = match.match(/<p><strong>([^<]+)<\/strong>\s*([\s\S]*?)<\/p>/g);
      if (!cards || cards.length < 2) return match;
      const cardHtml = cards.map(card => {
        const m = card.match(/<p><strong>([^<]+)<\/strong>\s*([\s\S]*?)<\/p>/);
        if (!m) return card;
        const title = m[1].replace(/\.$/, '');
        const desc = m[2].trim();
        return `<div class="feature-card"><h4 class="feature-card-title">${title}</h4><p class="feature-card-desc">${desc}</p></div>`;
      }).join('\n');
      return `<div class="feature-grid">${cardHtml}</div>`;
    }
  );

  // 2. Single bold-lead paragraph -> callout box
  html = html.replace(
    /<p><strong>([^<]+)<\/strong>\s*([\s\S]*?)<\/p>/g,
    (match, title, desc) => {
      if (!desc.trim()) return match;
      const cleanTitle = title.replace(/\.$/, '');
      return `<div class="callout-box"><strong class="callout-title">${cleanTitle}</strong><p class="callout-desc">${desc.trim()}</p></div>`;
    }
  );

  // 3. Lists with 4+ items -> visual list grid
  html = html.replace(
    /<ul>\s*((?:<li>[\s\S]*?<\/li>\s*){4,})<\/ul>/g,
    (_match, items) => `<ul class="visual-list">${items}</ul>`
  );

  return html;
}

/**
 * Split markdown at H2 boundaries into sections: { heading, html }.
 * Each section is module-transformed.
 */
export function splitMarkdownSections(md: string): { heading: string; html: string }[] {
  const parts = md.split(/^(?=## )/m);
  return parts.map(part => {
    const trimmed = part.trim();
    if (!trimmed) return null;
    const headingMatch = trimmed.match(/^## (.+)/m);
    const heading = headingMatch ? headingMatch[1].trim() : '';
    let html = marked.parse(trimmed, { async: false }) as string;
    html = transformToModules(html);
    return { heading, html };
  }).filter(Boolean) as { heading: string; html: string }[];
}

/** Parse YAML frontmatter + body from a raw markdown file. */
export function parseFrontmatter(raw: string): { data: any; body: string } {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!m) return { data: {}, body: raw };
  return { data: YAML.parse(m[1]) || {}, body: m[2] };
}
