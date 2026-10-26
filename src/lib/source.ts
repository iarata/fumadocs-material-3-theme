import { llms, loader } from 'fumadocs-core/source';
import { defineDocs } from 'fumadocs-mdx/macro';
import { icons as lucideIcons } from 'lucide-react';
import { createElement } from 'react';
import { materialIcons } from '@/components/ui/icons';
import { docsRoute } from './shared';

export const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    async: true,
    postprocess: {
      includeProcessedMarkdown: true,
      extractLinkReferences: true,
    },
  },
});

export const source = loader({
  source: docs.toFumadocsSource(),
  baseUrl: docsRoute,
  icon(name) {
    if (!name) return;
    const Icon = materialIcons[name as keyof typeof materialIcons] ?? lucideIcons[name as keyof typeof lucideIcons];
    return Icon ? createElement(Icon) : undefined;
  },
});

export const docsLlms = llms(source, {
  renderPage: async (page) => `# ${page.data.title} (${page.url})

${await page.data.getText('processed')}`,
});
