import { createFileRoute, notFound } from '@tanstack/react-router';
import { DocsLayout } from '@/components/ai/layout';
import { createServerFn } from '@tanstack/react-start';
import { docs, source } from '@/lib/source';
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from '@/components/m3e/page';
import { MarkdownCopyButton, ViewOptionsPopover } from '@/components/ai/page-actions';
import { baseOptions } from '@/lib/layout.shared';
import { getPageImageUrl, getPageMarkdownUrl, gitConfig } from '@/lib/shared';
import { useFumadocsLoader } from 'fumadocs-core/source/client';
import { Suspense, use } from 'react';
import { useMDXComponents } from '@/components/mdx';
import { getSearchPages } from '@/components/m3e/search-results';
import { buildDocsGraph } from '@/lib/docs-graph';

export const Route = createFileRoute('/docs/$')({
  component: Page,
  loader: async ({ params }) => {
    const slugs = params._splat?.split('/') ?? [];
    const data = await serverLoader({ data: slugs });
    await docs.getPage(data.path)?.preload();
    return data;
  },
  head: ({ loaderData }) => ({
    meta: loaderData ? [{ property: 'og:image', content: loaderData.imageUrl }] : [],
  }),
});

const serverLoader = createServerFn({
  method: 'GET',
})
  .validator((slugs: string[]) => slugs)
  .handler(async ({ data: slugs }) => {
    const page = source.getPage(slugs);
    if (!page) throw notFound();

    return {
      path: page.path,
      markdownUrl: getPageMarkdownUrl(page).url,
      imageUrl: getPageImageUrl(page).url,
      pageTree: await source.serializePageTree(source.getPageTree()),
      searchPages: getSearchPages(source.getPageTree()),
      graph: buildDocsGraph(),
    };
  });

function Content({ path, markdownUrl }: { path: string; markdownUrl: string }) {
  const page = docs.getPage(path);
  if (!page) throw new Error(`unknown page: ${path}`);

  const { toc } = use(page.load());
  const MDX = page.body;

  return (
    <DocsPage toc={toc}>
      <DocsTitle>{page.title}</DocsTitle>
      <DocsDescription>{page.description}</DocsDescription>
      <div className="flex flex-row flex-wrap gap-2 items-center border-b -mt-4 pb-6">
        <MarkdownCopyButton markdownUrl={markdownUrl} />
        <ViewOptionsPopover
          markdownUrl={markdownUrl}
          githubUrl={`https://github.com/${gitConfig.user}/${gitConfig.repo}/blob/${gitConfig.branch}/content/docs/${path}`}
        />
      </div>
      <DocsBody>
        <MDX components={useMDXComponents()} />
      </DocsBody>
    </DocsPage>
  );
}

function Page() {
  const { path, pageTree, searchPages, markdownUrl, graph } = useFumadocsLoader(Route.useLoaderData());

  return (
    <DocsLayout {...baseOptions()} tree={pageTree} searchPages={searchPages} graph={graph}>
      <Suspense>
        <Content path={path} markdownUrl={markdownUrl} />
      </Suspense>
    </DocsLayout>
  );
}
