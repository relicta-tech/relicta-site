import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://docs.relicta.tech',
  output: 'static',
  integrations: [
    starlight({
      title: 'Relicta Docs',
      logo: {
        light: './src/assets/brand/relicta-logo-light.svg',
        dark: './src/assets/brand/relicta-logo-dark.svg',
        alt: 'Relicta',
      },
      sidebar: [
        { label: 'Overview', link: '/' },
        {
          label: 'Guides',
          items: [
            { label: 'Install the CLI', link: '/install' },
            { label: 'Workflow', link: '/workflow' },
            { label: 'CLI commands', link: '/cli' },
            { label: 'CI/CD (GitHub Action)', link: '/ci-cd' },
            { label: 'Configuration', link: '/configuration' },
            { label: 'Plugins', link: '/plugins' },
          ],
        },
      ],
    }),
  ],
});
