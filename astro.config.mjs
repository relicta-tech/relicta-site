import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  // Set to your production docs domain for correct sitemaps/canonicals.
  // Update before deploying the custom domain.
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
      social: [
        { label: 'GitHub', icon: 'github', href: 'https://github.com/relicta-tech/relicta' },
      ],
      sidebar: [
        {
          label: 'Overview',
          link: '/docs/',
        },
        {
          label: 'Guides',
          items: [
            { label: 'Install the CLI', link: '/docs/install' },
            { label: 'Workflow', link: '/docs/workflow' },
            { label: 'CI/CD (GitHub Action)', link: '/docs/ci-cd' },
            { label: 'Configuration', link: '/docs/configuration' },
            { label: 'Plugins', link: '/docs/plugins' },
          ],
        },
      ],
    }),
  ],
});
