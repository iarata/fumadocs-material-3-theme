import type { BaseLayoutProps } from '@/components/m3e/layout';
import { appName, gitConfig } from './shared';
import { FileTextIcon, FolderIcon, InfoIcon, LinkIcon, SquarePenIcon } from '@/components/ui/icons';
import { BrandMark } from '@/components/ui/brand-icons';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      // JSX supported
      title: <span className="docs-site-title"><BrandMark className="docs-brand-mark" />{appName}</span>,
    },
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
    links: [
      { text: 'Docs', url: '/docs', active: 'url' },
      { text: 'Components', url: '/docs/test/components', active: 'nested-url' },
      { type: 'icon', text: 'Documentation map', url: '/docs/test/components/graph', icon: <LinkIcon /> },
      { type: 'menu', text: 'Guides', items: [
        { text: 'Navigation', description: 'Links, sidebar tabs, and mobile navigation', url: '/docs/test/navigation', icon: <FolderIcon /> },
        { text: 'Versioning', description: 'Explore the versioned example docs', url: '/docs/versions/v2', icon: <FileTextIcon /> },
      ] },
      { type: 'menu', variant: 'navigation', text: 'Resources', items: [
        { text: 'Component catalogue', description: 'Live Material examples for MDX', url: '/docs/test/components', icon: <SquarePenIcon /> },
        { text: 'Layout configuration', description: 'Configure navigation and versions', url: '/docs/test/layouts', icon: <FolderIcon /> },
        { text: 'Fumadocs', description: 'Content framework documentation', url: 'https://www.fumadocs.dev/docs', external: true, icon: <FileTextIcon /> },
        { text: 'Material Design 3', description: 'Colour, typography, and components', url: 'https://m3.material.io', external: true, icon: <InfoIcon /> },
      ] },
    ],
  };
}
