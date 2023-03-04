/**
 * Copyright (C) 2018 Bonitasoft S.A.
 * Bonitasoft, 32 rue Gustave Eiffel - 38000 Grenoble
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2.0 of the License, or
 * (at your option) any later version.
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */
import i18n from 'i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import bonitaLanguageDetector from './bonitaLanguageDetector';

const languageDetector = new LanguageDetector();
languageDetector.addDetector(bonitaLanguageDetector);

i18n
  .use(Backend)
  .use(languageDetector)
  .init({
    // we init with resources
    backend: {
      loadPath: './locales/{{lng}}.json',
    },
    fallbackLng: 'en',
    debug: true,
    returnEmptyString: false,

    // have a common namespace used around the full app
    ns: ['translations'],
    defaultNS: 'translations',

    keySeparator: false, // we use content as keys

    interpolation: {
      escapeValue: false, // not needed for react!!
      formatSeparator: ',',
    },

    react: {
      useSuspense: true,
    },
    detection: {
      order: ['bonitaLanguageDetector'],
    },
  });

export default i18n;
