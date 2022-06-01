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
import { apiClient } from '../common';
import { sessionTimeoutInterceptor } from '../common/SessionTimeoutInterceptor';

class FormApi {
  constructor(client) {
    this.apiClient = client;
    this.apiClient.register({ responseError: sessionTimeoutInterceptor });
  }

  async fetchStartFormMapping(processId) {
    return this.apiClient
      .get(
        '../API/form/mapping?c=10&p=0&f=processDefinitionId%3D' +
          processId +
          '&f=type%3DPROCESS_START'
      )
      .then(response => response.json());
  }
}

export default new FormApi(apiClient);
