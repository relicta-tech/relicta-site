#!/usr/bin/env node
// Asserts that a built site rendered what the source asked for.
//
// `astro build` exiting 0 is not evidence the output is correct. An Astro major
// upgrade once produced a green build whose mermaid diagrams had become raw
// source text: the code fences still appeared in the HTML, but as
// `<pre data-language="mermaid">` rather than the `<pre class="mermaid">` that
// mermaid's client script looks for. Nothing failed. Five diagrams silently
// turned into walls of unrendered graph syntax.
//
// The checks below are deliberately narrow. They assert properties the source
// determines — how many mermaid fences exist, that each became a mermaid-ready
// element, that pages are non-trivial — so that a renderer change that drops
// content fails here instead of on the live site.

import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

const [, , sourceDir, distDir] = process.argv
if (!sourceDir || !distDir) {
  console.error('usage: verify-build.mjs <source-dir> <dist-dir>')
  process.exit(2)
}

/** walk returns every file under dir whose name matches predicate. */
function walk(dir, predicate, acc = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) {
      if (entry === 'node_modules' || entry === '.git') continue
      walk(full, predicate, acc)
    } else if (predicate(entry)) {
      acc.push(full)
    }
  }
  return acc
}

const failures = []
const notes = []

// --- mermaid: every source fence must become a mermaid-ready element ---------
//
// Counting fences in source and mermaid elements in output means this check
// keeps working as diagrams are added or removed; it is not a hardcoded total.
const contentFiles = walk(sourceDir, (f) => /\.(md|mdx)$/.test(f))
let sourceFences = 0
for (const file of contentFiles) {
  // Fences may be indented (inside a list item), so leading whitespace is
  // allowed — anchoring on the line start alone silently undercounts.
  const matches = readFileSync(file, 'utf8').match(/^[ \t]*```mermaid\b/gm)
  if (matches) sourceFences += matches.length
}

const htmlFiles = walk(distDir, (f) => f.endsWith('.html'))
let renderedBlocks = 0
const rawLanguageBlocks = []
for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8')
  renderedBlocks += (html.match(/class="[^"]*\bmermaid\b[^"]*"/g) || []).length
  // The exact shape Astro 7 produced instead. Named explicitly so the failure
  // message points at the cause rather than just a count mismatch.
  if (/data-language="mermaid"/.test(html)) {
    rawLanguageBlocks.push(relative(distDir, file))
  }
}

if (sourceFences === 0) {
  notes.push('no mermaid fences in source — diagram check skipped')
} else if (renderedBlocks < sourceFences) {
  failures.push(
    `mermaid: source declares ${sourceFences} diagram(s) but the build produced ` +
      `${renderedBlocks} mermaid element(s). Diagrams that do not carry ` +
      `class="mermaid" are never initialised and render as raw graph syntax.`,
  )
} else {
  notes.push(`mermaid: ${renderedBlocks} diagram(s) rendered for ${sourceFences} source fence(s)`)
}

if (rawLanguageBlocks.length > 0) {
  failures.push(
    `mermaid: found data-language="mermaid" in ${rawLanguageBlocks.length} page(s) ` +
      `(${rawLanguageBlocks.slice(0, 3).join(', ')}). This is the syntax-highlighted ` +
      `code-block form, not a mermaid diagram — the diagram will not render.`,
  )
}

// --- pages must not be empty shells -----------------------------------------
//
// A renderer that loses its content pipeline still emits well-formed pages with
// the layout intact, which is why a byte-size floor catches what a build exit
// code does not.
const MIN_BYTES = 1024
const thin = htmlFiles
  .map((f) => ({ file: relative(distDir, f), size: statSync(f).size }))
  .filter((p) => p.size < MIN_BYTES)

if (htmlFiles.length === 0) {
  failures.push(`no HTML files found in ${distDir} — the build produced nothing`)
} else if (thin.length > 0) {
  failures.push(
    `${thin.length} page(s) under ${MIN_BYTES} bytes: ` +
      thin.map((p) => `${p.file} (${p.size}B)`).slice(0, 5).join(', '),
  )
} else {
  notes.push(`${htmlFiles.length} page(s) built, all >= ${MIN_BYTES} bytes`)
}

for (const n of notes) console.log(`  ok    ${n}`)
for (const f of failures) console.error(`  FAIL  ${f}`)

if (failures.length > 0) {
  console.error(`\n${failures.length} build verification check(s) failed for ${distDir}`)
  process.exit(1)
}
console.log(`\nbuild verification passed for ${distDir}`)
