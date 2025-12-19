import { defineConfig } from 'astro/config';
import mermaid from 'astro-mermaid';

import mdx from '@astrojs/mdx';

export default defineConfig({
  // Marketing site only; docs live in separate `docs/` project.
  site: 'https://relicta.tech',
  output: 'static',
  integrations: [
    mermaid({
      themeVariables: {
        fontFamily: 'Manrope, system-ui, sans-serif',
        primaryColor: '#0c1020', // --color-bg
        primaryTextColor: '#eef3ff', // --color-text
        primaryBorderColor: '#5cf0c8', // --color-accent
        lineColor: '#dce6f5', // --color-muted
        secondaryColor: 'rgba(16, 22, 42, 0.75)', // --color-surface
        tertiaryColor: 'rgba(255, 255, 255, 0.04)', // --color-card
        noteBkgColor: 'rgba(255, 255, 255, 0.04)',
        noteTextColor: '#eef3ff',
        textColor: '#eef3ff',
        mainBkg: '#0c1020',
        nodeBorder: '#5cf0c8',
        clusterBkg: 'rgba(255, 255, 255, 0.04)',
        clusterBorder: 'rgba(255, 255, 255, 0.14)',
        defaultLinkColor: '#dce6f5',
        edgeLabelBackground: '#0c1020',
      }
    }),
    mdx()
  ],
});