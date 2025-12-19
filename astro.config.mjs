import { defineConfig } from 'astro/config';
import mermaid from 'astro-mermaid';

export default defineConfig({
  // Marketing site only; docs live in separate `docs/` project.
  site: 'https://relicta.tech',
  output: 'static',
  integrations: [mermaid()],
});
