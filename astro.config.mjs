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
        primaryColor: 'var(--color-bg)', // was: '#0c1020'
        primaryTextColor: 'var(--color-text)', // was: '#eef3ff'
        primaryBorderColor: 'var(--color-accent)', // was: '#5cf0c8'
        lineColor: 'var(--color-muted)', // was: '#dce6f5'
        secondaryColor: 'var(--color-surface)', // was: 'rgba(16, 22, 42, 0.75)'
        tertiaryColor: 'var(--color-card)', // was: 'rgba(255, 255, 255, 0.04)'
        noteBkgColor: 'var(--color-card)', // was: 'rgba(255, 255, 255, 0.04)'
        noteTextColor: 'var(--color-text)', // was: '#eef3ff'
        textColor: 'var(--color-text)', // was: '#eef3ff'
        mainBkg: 'var(--color-bg)', // was: '#0c1020'
        nodeBorder: 'var(--color-accent)', // was: '#5cf0c8'
        clusterBkg: 'var(--color-card)', // was: 'rgba(255, 255, 255, 0.04)'
        clusterBorder: 'var(--color-border-subtle)', // was: 'rgba(255, 255, 255, 0.14)'
        defaultLinkColor: 'var(--color-muted)', // was: '#dce6f5'
        edgeLabelBackground: 'var(--color-bg)', // was: '#0c1020'
      }
    }),
    mdx()
  ],
});