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
import assignIn from 'lodash.assignin'; // deep assign

class Url {
  constructor(url, overridingProps = {}) {
    let props = url;

    if (typeof url === 'string') {
      const parser = document.createElement('a');
      parser.href = url;

      props = ['pathname'].reduce(
        (buffer, key) => {
          buffer[key] = parser[key];
          return buffer;
        },
        {
          queries: Url.parseQueries(parser.search),
          fragments: Url.parseFragments(parser.hash)
        }
      );
    }

    assignIn(this, props, overridingProps);
  }

  set(props) {
    return Object.assign(this, props);
  }

  get() {
    const { queries, fragments } = this;

    const url = [
      this.getPath(),
      Url.stringifyQueries(queries),
      Url.stringifyFragments(fragments)
    ];

    return url.join('');
  }

  getPath() {
    const { pathname } = this;

    return pathname;
  }

  static parseQueries(str) {
    return str
      .replace('?', '')
      .replace(/\+/g, ' ')
      .split('&')
      .filter(param => param) // to have empty array if split on empty str
      .map(param => param.split('='))
      .map(([key, value]) => [key, value])
      .reduce((queries, [key, value]) => {
        queries[key] =
          typeof queries[key] === 'undefined'
            ? value
            : [].concat(queries[key], value);

        return queries;
      }, {});
  }

  static stringifyQueries(obj) {
    const str = Object.keys(obj)
      .map(key => [key, obj[key]])
      .filter(([key, value]) => typeof value !== 'undefined')
      .map(
        ([key, value]) =>
          !Array.isArray(value)
            ? `${key}=${value}`
            : value.map(element => `${key}=${element}`).join('&')
      )
      .join('&');

    return !str ? null : `?${str}`;
  }

  static parseFragments(str) {
    const parsedStr = str
      .replace('#', '')
      .replace(/([a-zA-Z0-9_]*):/g, '"$1":')
      .replace(/:([a-zA-Z0-9._]*)/g, (match, p1) => (p1 ? `:"${p1}"` : ':'))
      .replace(/([[,])([a-zA-Z0-9._]*)([\],])/g, '$1"$2"$3')
      .replace(/,([a-zA-Z0-9._]*),/g, ',"$1",')
      .replace(/.*/, '{$&}');

    return JSON.parse(parsedStr);
  }

  static stringifyFragments(obj) {
    const str = JSON.stringify(obj)
      .replace(/"/g, '') // remove all "
      .slice(1, -1); // remove the two { and } that wrap the string

    return !str ? null : `#${str}`;
  }
}

export default Url;
