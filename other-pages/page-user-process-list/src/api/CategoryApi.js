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
import { apiClient, Url } from '../common';
import { sessionTimeoutInterceptor } from '../common/SessionTimeoutInterceptor';

class CategoryApi {
  constructor(client) {
    this.apiClient = client;
    this.apiClient.register({ responseError: sessionTimeoutInterceptor });
    this.cache = {};
  }

  async fetchAll() {
    const url = new Url('../API/bpm/category', {
      queries: {
        p: 0,
        c: Math.pow(2, 31) - 1,
      },
    });

    const response = await this.apiClient.get(url.get());
    const categories = await response.json();

    return categories;
  }

  async fetchByProcess({ id }) {
    const buildCategoryUrl = (processId) =>
      new Url('../API/bpm/category', {
        queries: {
          p: 0,
          c: Math.pow(2, 31) - 1,
          f: processId ? `id=${processId}` : undefined,
        },
      });

    if (this.cache[id]) {
      return Promise.resolve(this.cache[id]);
    } else {
      const response = await this.apiClient.get(buildCategoryUrl(id).get());
      const categories = await response.json();

      this.cache[id] = categories;

      return Promise.resolve(categories);
    }
  }
}

export default new CategoryApi(apiClient);

/* A category looks like that :
{
  "createdBy":"4",
  "displayName":"Tests",
  "name":"tests",
  "description":"",
  "creation_date":"2018-03-02 11:05:39.490",
  "id":"101"
}
*/
