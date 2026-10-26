'use client';

import { M3eMenu, M3eMenuItem, M3eMenuTrigger } from '@m3e/react/menu';
import { M3eNavMenu, M3eNavMenuItem } from '@m3e/react/nav-menu';
import { usePathname } from 'fumadocs-core/framework';
import Link from 'fumadocs-core/link';
import { useId, type ComponentRef, type ReactNode } from 'react';
import { Button } from './mdx/actions';
import { CheckIcon, ChevronDownIcon, ExternalLinkIcon, FileTextIcon, FolderIcon } from '@/components/ui/icons';
import { useAppLink } from './link';
import { IconButton as NativeIconButton } from '../ui/button';

interface LinkBase { text: string; icon?: ReactNode; secondary?: boolean; on?: 'all' | 'nav' | 'menu' }
export interface NavigationLink extends LinkBase { type?: 'main' | 'icon'; url: string; label?: string; active?: 'url' | 'nested-url' | 'none'; external?: boolean; description?: string }
export interface NavigationMenu extends LinkBase { type: 'menu'; variant?: 'menu' | 'navigation'; items: NavigationLink[] }
export interface NavigationCustom { type: 'custom'; children: ReactNode; secondary?: boolean; on?: 'all' | 'nav' | 'menu' }
export type LinkItemType = NavigationLink | NavigationMenu | NavigationCustom;
export interface NavOptions { title?: ReactNode; url?: string; enabled?: boolean; component?: ReactNode; transparentMode?: 'always' | 'top' | 'none' }

export const isActiveLink = (link: NavigationLink, pathname: string) => link.active !== 'none' && (pathname === link.url || link.active === 'nested-url' && pathname.startsWith(`${link.url.replace(/\/$/, '')}/`));

function MenuLink({ item, onNavigate }: { item: NavigationLink; onNavigate?: () => void }) {
  const pathname = usePathname();
  const current = !item.external && isActiveLink(item, pathname);
  const navigate = useAppLink(item.external ? undefined : item.url);
  return <M3eMenuItem href={item.url} aria-current={current ? 'page' : undefined} target={item.external ? '_blank' : undefined} rel={item.external ? 'noopener noreferrer' : undefined} onClickCapture={event => {
    navigate(event);
    if (event.defaultPrevented) (event.currentTarget as ComponentRef<typeof M3eMenuItem>).menu?.hideAll(true);
    onNavigate?.();
  }}>
    {item.icon && <span slot="icon">{item.icon}</span>}
    <span className="docs-menu-link-text"><span>{item.text}</span>{item.description && <span className="docs-menu-link-description">{item.description}</span>}</span>
    {item.external ? <ExternalLinkIcon slot="trailing-icon" /> : current && <CheckIcon slot="trailing-icon" />}
  </M3eMenuItem>;
}

function LayoutLink({ item }: { item: NavigationLink }) {
  const pathname = usePathname();
  const selected = isActiveLink(item, pathname);
  const navigate = useAppLink(item.external ? undefined : item.url);
  const destination = { href: item.url, target: item.external ? '_blank' : undefined, rel: item.external ? 'noopener noreferrer' : undefined };
  if (item.type === 'icon') return <NativeIconButton {...destination} aria-label={item.label ?? item.text} className="docs-nav-icon" onClickCapture={navigate}>{item.icon ?? <ExternalLinkIcon />}</NativeIconButton>;
  return <Button {...destination} aria-label={item.label ?? item.text} className="docs-layout-link" variant={selected ? 'tonal' : 'text'} aria-current={selected ? 'page' : undefined} data-current={String(selected)}>
    {item.icon && <span slot="icon">{item.icon}</span>}<span>{item.text}</span>
  </Button>;
}

// In the mobile drawer the site links share the page list's structure: top-level rows
// with a leading icon, and each menu as a folder of text-only rows on a guide line.
// Icon-only header links get their text label here.
function DrawerLink({ item, nested, onNavigate }: { item: NavigationLink; nested?: boolean; onNavigate?: () => void }) {
  const pathname = usePathname();
  const id = useId();
  const selected = !item.external && isActiveLink(item, pathname);
  return <M3eNavMenuItem selected={selected} data-current={String(selected)} aria-labelledby={id}>
    {!nested && <span slot="icon" aria-hidden="true">{item.icon ?? <FileTextIcon />}</span>}
    <Link id={id} slot="label" href={item.url} external={item.external} tabIndex={-1} aria-current={selected ? 'page' : undefined} onClick={onNavigate}>{item.text}</Link>
    {item.external && <ExternalLinkIcon slot="badge" aria-hidden="true" className="docs-nav-external" />}
  </M3eNavMenuItem>;
}

function DrawerMenu({ item, onNavigate }: { item: NavigationMenu; onNavigate?: () => void }) {
  const pathname = usePathname();
  const id = useId();
  return <M3eNavMenuItem className="docs-nav-folder" open={item.items.some(link => !link.external && isActiveLink(link, pathname))} aria-labelledby={id}>
    <span slot="icon" aria-hidden="true">{item.icon ?? <FolderIcon />}</span>
    <span slot="label" id={id}>{item.text}</span>
    <ChevronDownIcon slot="toggle-icon" aria-hidden="true" />
    {item.items.map(link => <DrawerLink key={link.url} item={link} nested onNavigate={onNavigate} />)}
  </M3eNavMenuItem>;
}

function LayoutMenu({ item }: { item: NavigationMenu }) {
  const id = useId();
  return <>
    <Button variant="text" className="docs-layout-link"><M3eMenuTrigger htmlFor={id}><span className="docs-menu-trigger-label">{item.text}<ChevronDownIcon /></span></M3eMenuTrigger></Button>
    <M3eMenu id={id} aria-label={item.text} className={item.variant === 'navigation' ? 'docs-navbar-mega-menu' : 'docs-navbar-menu'}>
      <div className={item.variant === 'navigation' ? 'docs-mega-menu-grid' : 'docs-menu-list'}>{item.items.map(link => <MenuLink key={link.url} item={link} />)}</div>
    </M3eMenu>
  </>;
}

export function LayoutLinks({ links = [], mobile = false, secondary = false, onNavigate }: { links?: LinkItemType[]; mobile?: boolean; secondary?: boolean; onNavigate?: () => void }) {
  const visible = links.filter(item => (mobile ? item.on !== 'nav' : item.on !== 'menu') && (mobile || Boolean(item.secondary ?? item.type === 'icon') === secondary));
  if (!visible.length) return null;
  if (mobile) {
    const custom = visible.filter(item => item.type === 'custom');
    return <nav aria-label="Site navigation" className="docs-mobile-layout-links">
      <M3eNavMenu className="docs-navigation" aria-label="Site links">{visible.map(item => item.type === 'custom' ? null : item.type === 'menu' ? <DrawerMenu key={item.text} item={item} onNavigate={onNavigate} /> : <DrawerLink key={item.url} item={item} onNavigate={onNavigate} />)}</M3eNavMenu>
      {custom.map((item, index) => <span key={index} className="docs-custom-link">{item.children}</span>)}
    </nav>;
  }
  return <nav aria-label={secondary ? 'More links' : 'Site navigation'} className="docs-navbar-links">
    {visible.map((item, index) => item.type === 'custom' ? <span key={index} className="docs-custom-link">{item.children}</span> : item.type === 'menu' ? <LayoutMenu key={item.text} item={item} /> : <LayoutLink key={item.url} item={item} />)}
  </nav>;
}
