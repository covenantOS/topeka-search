import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import fs from 'node:fs';
import YAML from 'yaml';

const siteConfig = YAML.parse(fs.readFileSync('./site.config.yaml', 'utf8'));

export default defineConfig({
  site: `https://${siteConfig.seo.domain}`,
  output: 'static',
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },
  integrations: [
    sitemap(),
  ],
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
  },
  build: {
    inlineStylesheets: 'auto',
  },
});
