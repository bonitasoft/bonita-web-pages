/**
 * Generate the AsciiDoc dependency list for the Bonita documentation site
 * (bonitasoft/bonita-doc, e.g. `modules/ROOT/pages/svelte-page-dependencies.adoc`).
 *
 * Pipe a `license-checker --production --json` report into this script:
 *
 *     npm run generate-dependencies-doc > svelte-page-dependencies.adoc
 *
 * It emits an Antora-ready page: a title, a description, and a three-column
 * (name | version | license) table sorted by package name. The page's own
 * private/UNLICENSED entry is filtered out (matched by name against the local
 * package.json), but bundled UNLICENSED deps (e.g. a vendored theme) are kept.
 *
 * This replaces the React-era toolchain (`license-checker` piped through
 * `@bonitasoft/dependency-list-to-markdown`), which emitted GitHub-flavoured
 * markdown. The doc site is AsciiDoc now, so we emit `|===` tables directly
 * and skip the markdown-to-adoc conversion step.
 *
 * Title/description default to the Svelte wording used by the doc site and can
 * be overridden with the DEPS_DOC_TITLE / DEPS_DOC_DESCRIPTION env vars when
 * scaffolding the doc page for a different page.
 */
import { readFileSync } from 'node:fs';

const TITLE = process.env.DEPS_DOC_TITLE || 'Svelte page dependencies';
const DESCRIPTION =
    process.env.DEPS_DOC_DESCRIPTION ||
    'This page lists the production dependencies of the Bonita pages that are built using the Svelte framework.';

// Exclude the page's own private package (license-checker reports the root
// package keyed by its own name@version).
const selfName = JSON.parse(readFileSync('package.json', 'utf8')).name;

// fd 0 is stdin — the piped `license-checker --json` output.
const report = JSON.parse(readFileSync(0, 'utf8'));

const rows = Object.entries(report)
    .map(([key, value]) => {
        // Keys are "name@version"; split on the LAST '@' so scoped packages
        // (@scope/name@version) keep their leading '@'.
        const at = key.lastIndexOf('@');
        const licenses = value.licenses;
        return {
            name: key.slice(0, at),
            version: key.slice(at + 1),
            license: Array.isArray(licenses) ? licenses.join(', ') : licenses,
        };
    })
    .filter((dep) => dep.name !== selfName)
    .sort((a, b) => a.name.localeCompare(b.name));

const lines = [
    `= ${TITLE}`,
    `:description: ${DESCRIPTION}`,
    '',
    '{description}',
    '',
    '[discrete]',
    '=== Frontend',
    '',
    '|===',
    '| name | version | license',
    '',
];
for (const dep of rows) {
    lines.push(`| ${dep.name}`, `| ${dep.version}`, `| ${dep.license}`, '');
}
lines.push('|===', '');

process.stdout.write(lines.join('\n'));
