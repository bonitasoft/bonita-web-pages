import { init, addMessages, getLocaleFromNavigator } from 'svelte-i18n';
import en from './locales/en.json';
import fr from './locales/fr.json';
import es from './locales/es.json';
import ja from './locales/ja.json';
import ptBR from './locales/pt-BR.json';

const SUPPORTED_LOCALES = { en, fr, es, ja, 'pt-BR': ptBR };

function getBonitaLocale() {
    const match = document.cookie.match(/(?:^|;\s*)BOS_Locale=([^;]*)/);
    if (!match) return null;
    return match[1].replace('_', '-');
}

function detectLocale() {
    const bonita = getBonitaLocale();
    if (bonita && bonita in SUPPORTED_LOCALES) return bonita;

    const nav = getLocaleFromNavigator();
    if (nav && nav in SUPPORTED_LOCALES) return nav;
    const navBase = nav?.split('-')[0];
    if (navBase && navBase in SUPPORTED_LOCALES) return navBase;

    return 'en';
}

Object.entries(SUPPORTED_LOCALES).forEach(([key, msgs]) => addMessages(key, msgs));

init({
    fallbackLocale: 'en',
    initialLocale: detectLocale(),
});
