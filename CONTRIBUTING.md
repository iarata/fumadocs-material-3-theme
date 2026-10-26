# Contributing

Thanks for helping improve Fumadocs Material. Bug reports, ideas and pull requests are all welcome.

## Report a bug or suggest a feature

[Open an issue](https://github.com/iarata/fumadocs-material-3-theme/issues) with:

- what you expected and what happened
- steps to reproduce, or a short MDX snippet
- your browser, and whether it happens in the light theme, the dark theme or both
- a screenshot for visual problems

## Set up

```bash
git clone https://github.com/iarata/fumadocs-material-3-theme.git
cd fumadocs-material-3-theme
bun install
bun run dev
```

Use Bun, because it applies the M3E fix in `patches/` on install. Ask AI is optional; see `.env.example`.

## Make a change

1. Create a branch from `main`.
2. Make your change. Keep it focused on one thing.
3. Run the checks:

   ```bash
   bun run types:check
   bun run lint
   bun run build
   ```

4. Check it in the browser:
   - in both the light and the dark theme
   - at phone width (390px)
   - using only the keyboard (Tab, the arrow keys, Enter and Escape)
5. Open a pull request. For visual changes, include before and after screenshots in both themes.

## Guidelines

| Area | Guideline |
| --- | --- |
| Colour | Use the roles in `src/styles/color-roles.css`; don't hard-code colours in components. Text needs 4.5:1 contrast and indicators need 3:1, in both themes. Primary marks what is interactive or selected; the accent marks identity only. |
| Components | Put MDX wrappers in `src/components/m3e/mdx`, register them in `src/components/mdx.tsx`, and add a live example with copyable MDX under `content/docs/test/components`. |
| Styles | Component styles live in `src/styles`. Follow the Material 3 specs for spacing, shape and type, using the scale in `typography.css`. |
| Accessibility | Every control needs a name and a visible focus state, and must work with the keyboard. Respect `prefers-reduced-motion`. |
| Docs | Update the README and the matching sample page when you change behaviour or options. |
| Commits | Write short, imperative messages, such as "Add dense list variant". |

### Updating M3E

`@m3e/web` is pinned and patched. To upgrade it, update both `@m3e/web` and `@m3e/react`. Then check whether the fix in `patches/` is still needed, and regenerate it with `bun patch @m3e/web@<version>`, or remove it.

## License

By contributing, you agree that your contributions are licensed under the [MIT License](LICENSE).
