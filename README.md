# Fumadocs Material

A Material 3 documentation theme for [Fumadocs](https://fumadocs.dev) on
[TanStack Start](https://tanstack.com/start). The interface uses
[M3E](https://github.com/matraic/m3e) web components: Material 3 Expressive navigation,
cards, callouts, tabs, dialogs, forms and more, in light and dark themes. Fumadocs Core
and MDX provide the content, page tree, search and syntax highlighting.

Use this repository as the base for a new documentation site.

## Start a new docs site

```bash
gh repo create my-docs --private --template iarata/fumadocs-material --clone
cd my-docs
bun install
bun run dev
```

Or select **Use this template** on GitHub. Install with Bun so the versioned M3E patch in
`patches/` is applied; it adds the radio group's missing value setter, which its native
form reset requires.

Ask AI uses OpenRouter. Copy `.env.example` to `.env.local` and set `OPENROUTER_API_KEY`
(and optionally `OPENROUTER_MODEL`). Everything else works without it.

| Command | Purpose |
| --- | --- |
| `bun run dev` | Development server |
| `bun run build` | Production build |
| `bun run start` | Preview the production build |
| `bun run types:check` | Type-check |
| `bun run lint` | Lint with oxlint |

## Make it yours

1. **Name and repository:** `appName` and `gitConfig` in `src/lib/shared.ts`. They feed the
   header, page titles, Open Graph images and the GitHub and "Edit on GitHub" links.
2. **Logo:** replace `BrandMark` in `src/components/ui/brand-icons.tsx`. Its shape follows
   `--docs-brand`; a part with the `docs-brand-mark-cross` class follows `--docs-on-brand`.
3. **Colours:** see [Colours](#colours). Update the Open Graph colours in `src/lib/og.tsx`
   and the hard-coded colours in `public/images/material-docs-flow.svg` too.
4. **Navigation:** navbar links and menus in `src/lib/layout.shared.tsx`.
5. **Home page:** `src/routes/index.tsx`.
6. **Content:** write pages in `content/docs`. `content/docs/test` (component catalogue,
   navigation, layouts and search) and `content/docs/versions` (a version picker example)
   are samples; keep them for reference or delete them and update `content/docs/meta.json`
   and the links in `layout.shared.tsx`.

## Colours

`src/styles/theme.css` holds the three brand colours: primary blue `#006398`, ink
`#001d32` and accent red `#d61d41`. It also maps the Fumadocs/Tailwind `fd-*` colours onto
Material roles. `color-roles.css` is the single source for every Material role, the
information, tip, success and warning roles, and the syntax roles, in both themes. M3E
falls back to its baseline purple for any undefined `--md-sys-color-*` role, so keep every
role defined in both blocks.

The primary colour marks everything interactive or selected. The accent marks identity
only (the logo, the page-title overline and the expressive banner) and never a state.
Text pairs meet at least 4.5:1, and indicators, control outlines and tracks at least 3:1,
in both themes. Keep these ratios when you rebrand: derive the roles from tonal palettes
(for example with [Material Theme Builder](https://material-foundation.github.io/material-theme-builder/))
and check the pairs. `component-colors.css` chooses which role each M3E component state
uses. Code is highlighted with the Shiki theme in `src/lib/code-theme.ts`, which reads the
`--docs-code-*` roles.

## Project structure

- `src/components/m3e`: the docs shell (layouts, sidebar, navbar, mobile drawer, search,
  page and table of contents).
- `src/components/m3e/mdx`: the MDX component wrappers.
- `src/components/mdx.tsx`: maps MDX elements and generated package-manager tabs to M3E
  components.
- `src/components/ai`: Ask AI chat and page actions.
- `src/styles`: `m3e.css`, `docs-extensions.css`, `navigation.css`, `mdx-components.css`
  and `tabs.css` style the components and layout; `typography.css` defines the Material 3
  type scale.

Interface icons use bundled Material Symbols Rounded SVGs in `src/components/ui/icons.tsx`
(Apache 2.0, see `material-symbols.LICENSE`). Company logos live in `brand-icons.tsx`;
Lucide is the fallback for additional frontmatter icons. Sidebar motion follows the
original Fumadocs 300ms transition and respects reduced-motion preferences.

## Components in MDX

Open `/docs/test/components` for live examples and copyable MDX. All components
are registered globally in `src/components/mdx.tsx`; MDX pages need no imports.

- Content: `Card`, `Cards`, `Callout`, `Badge`, `List`, `ListItem`, `Divider`, `Icon`
- Actions: `Button`, `IconButton`, `ButtonGroup`, `Chip`, `Chips`
- Feedback: `Dialog`, `Tooltip`, `Progress`, `LoadingIndicator`, `Skeleton`
- Inputs: `TextField`, `TextArea`, `Checkbox`, `Switch`, `RadioGroup`, `Select`, `Slider`
- Organization: `Tabs`, `Tab`, `TabsList`, `TabsTrigger`, `TabsContent`, `Accordions`, `Accordion`, `Stepper`, `Steps`, `Step`
- Documentation: `Files`, `File`, `Folder`, `TypeTable`, `InlineTOC`, `CodeBlock`, `Pre`, `DynamicCodeBlock`
- Media and announcements: `ImageZoom`, `Banner`, `GithubInfo` / `GitHubInfo`, `GraphView`, `Preview`

This covers the [Fumadocs UI component catalogue](https://www.fumadocs.dev/docs/ui/components).
Markdown images use `ImageZoom` automatically. File code fences and `<auto-files>`
are compiled into Material file trees by `remarkMdxFiles`. Generate API tables with
`<auto-type-table path="./types.ts" name="Options" />` (or `AutoTypeTable`): the
`fumadocs-typescript` remark plugins in `vite.config.ts` run at build time.
Paths are relative to the MDX file; attributes must be strings.

`Tabs` supports synchronized `groupId` selections, optional `persist`, panel IDs,
and `updateAnchor`. Use object items (`{ label, value, icon }`) or `icon` on
`TabsTrigger` / `Tab` for Material icon tabs. `variant="primary"` stacks icons above
labels; `variant="secondary"` keeps a compact row. Primary tabs also support
`inlineIcons` and `iconOnly` (item labels remain accessible). Use `layout="fixed"`
for equal-width tabs or `layout="scrollable"` for longer lists. Items, triggers,
and panels accept `disabled`, `badge` (a count or `"dot"`), and `badgeLabel`.
See `/docs/test/components/tabs` for all variants. Tabs accept primary, secondary,
or tertiary `tone` values. Icons and chips also accept semantic tones such as
`info`, `success`, `warning`, and `error`; see the live examples for all values.
Dropdowns use matching arrow, focus, and selected-option colours.

`ImageZoom` opens a full-screen viewer with fit, zoom, panning, and Escape dismissal.
`Preview` separates its label from the example canvas; use `align="start"` for
full-width examples. Callouts use filled Material cards in the banner layout: tonal
container, status icon, headline, body text and end-aligned actions.
`Banner` remembers dismissal when given an `id`. `GraphView`
uses the current page tree and lazily loads document references from `/api/docs-graph`.
`GithubInfo` loads public repository statistics and keeps its link usable if the API
is unavailable.

```mdx
<Callout type="tip" title="Ready to use">
  Combine **Markdown** with Material components.
</Callout>
<Button variant="tonal" icon="ArrowRight" href="/docs/test/components/forms">
  Explore form controls
</Button>
```

The wrappers live in `src/components/m3e/mdx`, with scoped styling in
`src/styles/mdx-components.css`. Custom React examples can import these wrappers
from `@/components/m3e/mdx` and use `onValueChange` / `onCheckedChange` for state.
Register custom examples in the MDX component map to make them available in docs.

## Navigation and versions

Configure navbar links in `src/lib/layout.shared.tsx`: text links, labelled icon
links, ordinary menus, navigation menus, and custom content are supported. Mobile
navigation puts these links in a Material drawer alongside search and page links.

Set `root: true` in a folder's `meta.json` to create a sidebar section. Set
`root: "version"` on sibling folders for a version selector. Matching pages are
preserved when switching versions; missing pages fall back to the target index.
Include `"index"` in an explicit `pages` list to retain that landing page.
Search is scoped to the active version. The clearly labelled v1/v2 examples in
`content/docs/versions` demonstrate matching-page and missing-page navigation.

`DocsLayout` also accepts explicit `tabs`, `tabMode`, `versions`, navbar options,
and sidebar options. See `/docs/test/layouts` for complete configuration examples.
