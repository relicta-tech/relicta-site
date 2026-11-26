// Content collections, Content Layer API.
//
// Moved here from src/content/config.ts: Astro 6 removed the legacy content
// collections config and refuses to build while it exists —
//
//   [LegacyContentConfigError] Found legacy content config file in
//   "src/content/config.ts". Please move this file to "src/content.config.ts"
//   and ensure each collection has a loader defined.
//
// `type: 'content'` is gone; each collection now declares where its entries
// come from via a loader. The glob loader reproduces the previous behaviour —
// files on disk under src/content/<collection> — so entry ids stay the same
// shape as the old slugs and existing URLs do not change.

import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().default('Relicta'),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
})

export const collections = { blog }
