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
import cookie from './Cookie';

const OPTIONS = {
  credentials: 'same-origin', // automatically send cookies for the current domain
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
};

const headers = () => {
  const csrfToken = cookie.getValue('X-Bonita-API-Token');
  return csrfToken
    ? { ...OPTIONS.headers, 'X-Bonita-API-Token': csrfToken }
    : { ...OPTIONS.headers };
};

class Client {
  constructor() {
    this.interceptors = [];
  }

  get(url) {
    const options = {
      ...OPTIONS,
      method: 'GET',
      headers: headers()
    };

    return this._fetch(url, options);
  }

  post(url, body) {
    const options = {
      ...OPTIONS,
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(body)
    };

    return this._fetch(url, options);
  }

  register(interceptor) {
    this.interceptors.push(interceptor);
  }

  _fetch(url, options) {
    let promise = fetch(url, options).then(response => {
      if (response.ok) {
        return Promise.resolve(response);
      }
      return Promise.reject(response);
    });

    // chain responseError interceptors
    this.interceptors.forEach(({ responseError }) => {
      if (responseError) {
        promise = promise.catch(responseError);
      }
    });

    return promise;
  }
}

export default new Client();
