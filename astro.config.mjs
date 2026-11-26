import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

export default defineConfig({
  // Marketing site only; docs live in separate `docs/` project.
  site: 'https://relicta.tech',
  output: 'static',
  integrations: [mdx()],
});
