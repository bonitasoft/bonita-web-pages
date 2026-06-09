import { describe, it, expect } from 'vitest';
import { get } from 'svelte/store';
import { _ } from 'svelte-i18n';
import enMessages from '../i18n/locales/en.json';
import frMessages from '../i18n/locales/fr.json';
import esMessages from '../i18n/locales/es.json';
import jaMessages from '../i18n/locales/ja.json';
import ptBRMessages from '../i18n/locales/pt-BR.json';

describe('i18n setup', () => {
    it('loads the English fallback locale and resolves a known key', () => {
        const t = get(_);
        expect(t('Processes')).toBe('Processes');
    });

    it('resolves a key with interpolation using ICU MessageFormat braces', () => {
        const t = get(_);
        expect(t('The case {caseId} has been started successfully.', { values: { caseId: '42' } }))
            .toBe('The case 42 has been started successfully.');
    });
});

describe('locale parity', () => {
    // All five locales must define the same set of keys so missing translations
    // surface as test failures rather than as untranslated UI in production.
    const enKeys = Object.keys(enMessages).sort();

    it.each([
        ['fr', frMessages],
        ['es', esMessages],
        ['ja', jaMessages],
        ['pt-BR', ptBRMessages],
    ])('%s defines the same keys as en', (_label, messages) => {
        expect(Object.keys(messages).sort()).toEqual(enKeys);
    });

    it('all interpolation placeholders use ICU braces ({var}, not {{var}})', () => {
        const i18nextStyle = /\{\{\w+\}\}/;
        for (const [name, messages] of [
            ['en', enMessages],
            ['fr', frMessages],
            ['es', esMessages],
            ['ja', jaMessages],
            ['pt-BR', ptBRMessages],
        ]) {
            for (const [key, value] of Object.entries(messages)) {
                expect(i18nextStyle.test(value), `${name}.${key} contains i18next-style {{var}}`).toBe(false);
            }
        }
    });

    // Translations must preserve the same set of `{var}` placeholders as the
    // English source. A translator dropping `{caseId}` from a non-en locale
    // would silently render the toast with the case id missing — this guard
    // catches that.
    function placeholders(value) {
        return new Set(Array.from(value.matchAll(/\{(\w+)\}/g), (m) => m[1]));
    }

    it.each([
        ['fr', frMessages],
        ['es', esMessages],
        ['ja', jaMessages],
        ['pt-BR', ptBRMessages],
    ])('%s preserves the same interpolation placeholders as en for every key', (label, messages) => {
        for (const [key, enValue] of Object.entries(enMessages)) {
            const enPlaceholders = placeholders(enValue);
            const localePlaceholders = placeholders(messages[key]);
            expect(
                localePlaceholders,
                `${label}.${key}: expected placeholders {${[...enPlaceholders].join(', ')}}, got {${[...localePlaceholders].join(', ')}}`,
            ).toEqual(enPlaceholders);
        }
    });
});
