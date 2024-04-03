/**
 * Copyright (C) 2020 Bonitasoft S.A.
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
import Cookies from 'js-cookie';

export default {
  name: 'bonitaLanguageDetector',

  lookup(options) {
    let reactLocale;

    if (typeof document !== 'undefined') {
      let locale = Cookies.get('BOS_Locale');

      if (locale === 'pt_BR') {
        reactLocale = 'pt-BR';
      } else if (locale) {
        reactLocale = locale;
      }
    }

    return reactLocale;
  },

  cacheUserLanguage(lng, options) {},
};
