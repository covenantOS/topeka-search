export const meta = {
  name: 'topeka-search-content',
  description: 'Generate locally-flavored service + blog markdown for Topeka Search',
  phases: [
    { title: 'Write', detail: 'one writer per service/post' },
    { title: 'Polish', detail: 'enforce style rules + pricing accuracy' },
  ],
};

const TODAY = '2026-06-26';

const BRAND = `
BRAND CONTEXT (use exactly):
- Spoken brand: "Topeka Search". Legal/GBP name (use in title tags + schema): "Topeka SEO & PPC". Endorsed "by ServiceLine Pro".
- Market: Topeka, Kansas and the Topeka DMA. New domain (topekasearch.com), starting at zero.
- Positioning: the local SEO/PPC company that publishes PRICES UPFRONT, and takes only ONE client per industry in Topeka (when a category is claimed, it's gone). Tree Service, Deck Builder, Remodeler, and General Contractor are already claimed in Topeka.
- Track record is real ServiceLine Pro results: Map Pack rank jumps (e.g. 17.6 -> 4.7 in 6 days), Google Ads at $0 agency fee (461% ROI, $2M+ pipeline), websites with 1,000%+ ROI.
- Real Topeka references to weave in naturally (do not overstuff): Downtown Topeka, SW Topeka, NOTO Arts District, College Hill, Shawnee County, Washburn University, the 785 area code, the Topeka Capital-Journal, Gage Park, the Kansas Expocentre.

STYLE RULES (hard constraints):
- NO em dashes (—). Use periods, commas, or parentheses instead.
- Banned words/phrases: "merely", "straightforward", "in today's world", "best practices", "leverage", "seamless", "unlock", "elevate", "world-class" (in body), "robust", "cutting-edge", "navigate the landscape".
- No bait-and-switch "It's not X, it's Y" contrast constructions.
- Vary sentence length. Active voice. Write like a sharp local operator talking to a business owner, not a content mill.
- Use the EXACT price given. Never invent prices. State the price plainly in the body at least once.
- American English. Second person ("you"/"your business").
`;

const CONTRACT = `
OUTPUT: a single markdown file as a STRING with YAML frontmatter then body.

Frontmatter (exact keys):
---
meta_title: "<= 60 chars, includes the service + Topeka, ends with ' | Topeka SEO & PPC'"
meta_description: "<= 155 chars, benefit-led, includes 'Topeka' and a soft CTA"
h1: "<Service> in Topeka, Kansas"
hero_subhead: "one punchy sentence, includes the price or the $0-agency-fee promise"
intro: "an opening paragraph (60-100 words) that includes 'Topeka', the service, and one real local reference. This is the first thing visitors read."
faq:
  - question: "real question a Topeka buyer would ask (mirror Google 'People Also Ask' phrasing)"
    answer: "2-4 sentence answer. Plain, specific, no fluff."
  # 5 to 6 FAQ items total
process:
  - title: "Step name"
    description: "1-2 sentences"
  # exactly 4 steps
---

Body = markdown with 4 to 6 H2 sections (## ). Recommended flow:
## What <service> looks like in Topeka   (what it is + local angle)
## What's included
## Why Topeka businesses choose us   (specific, tie to the $0 fee / one-per-industry / upfront pricing)
## How we report and what to expect
Optionally one more relevant H2.

Body rules:
- 650 to 1000 words in the body.
- Do NOT write a pricing section, an FAQ section, a process section, or a CTA in the body. Those are rendered by the template from the frontmatter/config. Body is the persuasive/educational prose only.
- You MAY use short bold-lead paragraphs ("**Title.** description") and bullet lists; the template turns them into cards.
- Mention the exact price once in the body naturally.
`;

const SERVICES = [
  { slug: 'seo', name: 'SEO', price: '$2,500/month (includes a complimentary 10-day ranking boost, no long-term contract)', angle: 'Local SEO + Google Business Profile + Map Pack domination for Topeka. The single biggest lever is reviews + GBP + proximity.' },
  { slug: 'ai-seo', name: 'AI SEO (Generative Engine Optimization)', price: '$1,500/month, requires an active Local SEO subscription', angle: 'Getting cited by Google AI Overviews, ChatGPT Search, and Perplexity. llms.txt, citability, entity building, schema.' },
  { slug: 'ppc-management', name: 'PPC Management', price: '$0 agency fee (you pick the ad budget; 100% funds the campaigns)', angle: 'Managed paid search across Google + Microsoft for zero agency markup. High-intent Topeka clicks.' },
  { slug: 'google-ads-management', name: 'Google Ads Management', price: '$0 agency fee (you set the Google Ads budget)', angle: 'Search, Performance Max, Display, managed around booked jobs. The one channel we also run for ourselves.' },
  { slug: 'microsoft-bing-ads', name: 'Microsoft & Bing Ads Management', price: '$0 agency fee', angle: 'Bing/Yahoo/DuckDuckGo network. Often a lower cost-per-lead than Google; competitors ignore it.' },
  { slug: 'chatgpt-ads', name: 'ChatGPT Ads Management', price: '$500/month flat management fee plus your ad budget', angle: 'Advertising inside AI assistant answers and emerging ChatGPT placements. Early-mover advantage.' },
  { slug: 'apple-maps-ads', name: 'Apple Maps Ads Management', price: '$500/month flat management fee plus your ad budget', angle: 'Apple Business Connect + Apple Maps placements. Owning the map on every iPhone in Topeka.' },
  { slug: 'yelp-ads', name: 'Yelp Ads Management', price: '$500/month flat management fee plus your Yelp budget', angle: 'Profile optimization + ad management that protects budget and drives qualified leads.' },
  { slug: 'local-services-ads', name: 'Local Services Ads Management (Google Guaranteed)', price: '$500/month flat management fee plus pay-per-lead budget', angle: 'Google Guaranteed badge, pay-per-lead, lead-dispute management to recover bad-lead spend. (We manage LSA for clients; it is sold/managed only.)' },
  { slug: 'ott-streaming-ads', name: 'OTT & Streaming TV Ads', price: '$0 agency fee, with free professional video production via partner Butel Media Group', angle: 'Connected TV / streaming targeted to Topeka households. TV reach at digital prices.' },
  { slug: 'web-design', name: 'Web Design', price: '$250/month (unlimited pages, unlimited updates, hosting, and speed-to-lead included; cancel anytime; one-time custom builds available on request)', angle: 'Brand-new, sub-2-second website on a flat monthly subscription. We design, build, host, and maintain it.' },
  { slug: 'branding', name: 'Branding & Logo Design', price: '$750 logo design package (full brand identity quoted per project)', angle: 'Logo, alternates, 5 revisions, brand asset pack. Makes a Topeka business look like the established leader.' },
  { slug: 'social-media', name: 'Social Media Marketing', price: '$750/month (paid social ad spend billed separately at $0 agency fee)', angle: 'Done-for-you content, scheduling, community management. Consistent, credible presence.' },
];

const POSTS = [
  { slug: 'how-much-does-seo-cost-in-topeka', title: 'How Much Does SEO Cost in Topeka? (Real Prices)', angle: 'Honest breakdown of local SEO pricing in Topeka, why most agencies hide it, what $2,500/mo buys, and how to judge ROI. Position Topeka Search transparent pricing + 10-day boost.' },
  { slug: 'google-ads-vs-seo-topeka', title: 'Google Ads vs. SEO for Topeka Businesses: Which First?', angle: 'When to start with Google Ads ($0 agency fee, instant) vs SEO (compounding, owns the Map Pack). Most Topeka businesses should run both; how to sequence on a budget.' },
  { slug: 'win-google-map-pack-topeka', title: 'How to Win the Google Map Pack in Topeka', angle: 'The 3 levers that decide the Topeka Map Pack: GBP optimization, proximity/categories, and reviews. Why 25-30 reviews beats the local field. Actionable steps.' },
];

phase('Write');

const serviceResults = await pipeline(
  SERVICES,
  (svc) => agent(
    `You are a senior local-SEO copywriter for Topeka Search. Write the SERVICE PAGE markdown for: ${svc.name}.
Exact price to use: ${svc.price}.
Service angle: ${svc.angle}.
${BRAND}
${CONTRACT}
Return ONLY the markdown file string (frontmatter + body). No commentary.`,
    { label: `write:${svc.slug}`, phase: 'Write', schema: {
      type: 'object',
      additionalProperties: false,
      required: ['slug', 'markdown'],
      properties: {
        slug: { type: 'string' },
        markdown: { type: 'string', description: 'full markdown file: frontmatter + body' },
      },
    } }
  ).then(r => r ? { ...r, slug: svc.slug, kind: 'service' } : null),
  (res, svc) => res ? agent(
    `Copy-edit this Topeka Search SERVICE page markdown. Fix ONLY violations; keep the substance and structure.
Checks:
1. Remove every em dash (—); replace with comma/period/parentheses.
2. Remove banned words: merely, straightforward, "in today's world", "best practices", leverage, seamless, unlock, elevate, robust, cutting-edge.
3. Confirm the exact price appears in the body and frontmatter hero_subhead reflects it. Price must be: ${svc.price}.
4. Confirm 5-6 FAQ items and exactly 4 process steps exist.
5. Confirm frontmatter keys: meta_title, meta_description, h1, hero_subhead, intro, faq, process. h1 must end with "in Topeka, Kansas".
6. Valid YAML frontmatter (quote strings containing colons).
Return the corrected full markdown string.

MARKDOWN:
${res.markdown}`,
    { label: `polish:${svc.slug}`, phase: 'Polish', schema: {
      type: 'object', additionalProperties: false, required: ['markdown'],
      properties: { markdown: { type: 'string' } },
    } }
  ).then(p => ({ slug: svc.slug, kind: 'service', markdown: p ? p.markdown : res.markdown })) : null
);

const postResults = await pipeline(
  POSTS,
  (post) => agent(
    `You are a senior local-SEO writer for Topeka Search. Write a BLOG POST markdown for the title: "${post.title}".
Angle: ${post.angle}.
${BRAND}

OUTPUT: a single markdown string with this frontmatter then body:
---
title: "${post.title}"
meta_title: "<= 60 chars, ends with ' | Topeka SEO & PPC'"
meta_description: "<= 155 chars, includes Topeka"
date: "${TODAY}"
author: "William Hamilton"
excerpt: "1-2 sentence summary"
---

Body: 700-1100 words, markdown, 4-6 H2 (## ) sections, helpful and specific to Topeka, with concrete numbers and a soft CTA to a relevant Topeka Search service near the end. Follow all STYLE RULES (no em dashes, no banned words). Return ONLY the markdown string.`,
    { label: `write:${post.slug}`, phase: 'Write', schema: {
      type: 'object', additionalProperties: false, required: ['markdown'],
      properties: { markdown: { type: 'string' } },
    } }
  ).then(r => r ? { slug: post.slug, kind: 'post', markdown: r.markdown } : null)
);

return [...serviceResults, ...postResults].filter(Boolean);
