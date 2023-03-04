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
import { apiClient, Pagination, Url } from '../common';
import CategoryApi from './CategoryApi';
import { sessionTimeoutInterceptor } from '../common/SessionTimeoutInterceptor';

class ProcessApi {
  constructor(client) {
    this.apiClient = client;
    this.apiClient.register({ responseError: sessionTimeoutInterceptor });
  }

  async fetchProcesses(
    { page = 0, size = 25 } = {},
    { queryParams, search, order } = {}
  ) {
    const url = new Url('../API/bpm/process', {
      queries: {
        p: page,
        c: size,
        s: search,
        o: order ? `displayName ${order}` : undefined,
        f: queryParams,
      },
    });

    const response = await this.apiClient.get(url.get());
    const processes = await response.json();

    return {
      unpopulated: Promise.resolve({
        processes: processes.map((process) => ({ ...process, categories: [] })),
        pagination: Pagination.from(response.headers.get('Content-Range')),
      }),

      populated: Promise.all(
        processes.map((process) =>
          CategoryApi.fetchByProcess(process).then((categories) => ({
            ...process,
            categories,
          }))
        )
      ).then((processes) => ({ processes })),
    };
  }

  fetchProcessByNameAndVersion(processName, processVersion) {
    const response = this.apiClient.get(
      `../API/bpm/process?c=1&p=0&f=name=${processName}&f=version=${processVersion}`
    );

    return response
      .then((body) => body.json())
      .then((responseJson) => responseJson[0])
      .catch(() => {
        return undefined;
      });
  }

  async instantiateProcess(processId) {
    return this.apiClient
      .post(`../API/bpm/process/${processId}/instantiation`)
      .then((response) => {
        return response.json();
      })
      .catch(function (response) {
        return response;
      });
  }
}

export default new ProcessApi(apiClient);

/* A process looks like that :
{
  "displayDescription": "",
  "deploymentDate": "2018-02-14 12:18:34.254",
  "displayName": "Pool",
  "name": "Pool",
  "description": "",
  "deployedBy": "4",
  "id": "7544905540282516773",
  "activationState": "ENABLED",
  "version": "1.0",
  "configurationState": "RESOLVED",
  "last_update_date": "2018-02-14 12:18:34.723",
  "actorinitiatorid": "1"
}
*/
