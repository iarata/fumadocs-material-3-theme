import react from '@vitejs/plugin-react';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { fumadocsMdx } from 'fumadocs-mdx/vite';
import { nitro } from 'nitro/vite';
import { remarkMdxFiles } from 'fumadocs-core/mdx-plugins/remark-mdx-files';
import { createGenerator, remarkAutoTypeTable } from 'fumadocs-typescript';
import { readdirSync } from 'node:fs';
import { codeThemes } from './src/lib/code-theme.ts';

const typeGenerator = createGenerator();
const docsPages = readdirSync('content/docs', { recursive: true })
  .filter((path): path is string => typeof path === 'string' && /\.mdx?$/.test(path))
  .map(path => ({ path: `/docs/${path.replace(/(^|\/)index\.mdx?$/, '').replace(/\.mdx?$/, '')}`.replace(/\/$/, '') }));
// Unified merges repeated plugin registrations, so give the PascalCase alias
// its own plugin identity to keep both MDX spellings available.
function remarkNamedAutoTypeTable() {
  return remarkAutoTypeTable({ generator: typeGenerator, name: 'AutoTypeTable', shiki: { themes: codeThemes } });
}

export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [
    fumadocsMdx({
      globalOptions: {
        mdxOptions: {
          remarkPlugins: [remarkMdxFiles, [remarkAutoTypeTable, { generator: typeGenerator, shiki: { themes: codeThemes } }], remarkNamedAutoTypeTable],
          rehypeCodeOptions: { themes: codeThemes },
        },
      },
    }),
    tailwindcss(),
    tanstackStart({
      // M3E link properties hydrate on the client; seed every section/version.
      pages: docsPages,
      prerender: {
        enabled: true,
      },
    }),
    react(),
    // please see https://tanstack.com/start/latest/docs/framework/react/guide/hosting#nitro for guides on hosting
    nitro({
      preset: 'vercel',
      // M3E's compiled helpers must be bundled, including tslib's ESM entry.
      noExternals: ['tslib'],
    }),
  ],
  resolve: {
    tsconfigPaths: true,
    alias: {
      tslib: 'tslib/tslib.es6.js',
    },
  },
});
