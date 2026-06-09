import '@testing-library/jest-dom/vitest';
import { init, addMessages } from 'svelte-i18n';
import enMessages from '../i18n/locales/en.json';

addMessages('en', enMessages);
init({ fallbackLocale: 'en', initialLocale: 'en' });
