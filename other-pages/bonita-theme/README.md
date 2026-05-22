# Bonita Theme

Application theme for Bonita Living Applications. SCSS sources in `src/scss/` extend [bootstrap-sass](https://getbootstrap.com/docs/3.3/) 3.4.1 with Bonita branding (colors, typography, buttons, pager…) and compile to a single autoprefixed CSS file.

## Build

From the repository root:

```bash
./gradlew :other-pages:bonita-theme:buildPage
```

Or directly from this folder:

```bash
npm install
npm run build:only
```

Both compile `src/scss/main.scss` to `public/theme.css` and copy icons/fonts/images from `src/assets/` into `public/`.

## Preview the theme locally

`test/index.html` is a static demo page that exercises every component the theme styles: navbar, buttons, typography, tables, forms, navs, indicators, progress bars, containers and dialogs. Loading it through a local HTTP server lets you inspect the built theme without a Bonita runtime.

The page loads its CSS from `../public/theme.css`, so the HTTP server must expose both `test/` and `public/`. Start it from this directory with the current directory as the explicit document root:

```bash
npx http-server . -c-1
```

The trailing `.` matters: without it `http-server` auto-selects `./public` as the document root and `test/` becomes unreachable. `-c-1` disables caching so rebuilds are picked up on refresh without forcing a hard reload.

Open <http://localhost:8080/test/> in a browser. Rebuild the theme (`npm run build:only`) and refresh the page to see changes.
