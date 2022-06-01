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
import ProcessApi from './ProcessApi';
import CategoryApi from './CategoryApi';

const mockupCategories = Array(10).fill({
  createdBy: '4',
  displayName: 'Tests',
  name: 'tests',
  description: '',
  creation_date: '2018-03-02 11:05:39.490',
  id: '101'
});

const mockupProcesses = Array(25)
  .fill(null)
  .map((val, i) => ({
    displayDescription: '',
    deploymentDate: '2018-02-14 12:18:34.254',
    displayName: 'Pool',
    name: 'Pool',
    description: '',
    deployedBy: '4',
    id: i.toString(),
    activationState: 'ENABLED',
    version: '1.0',
    configurationState: 'RESOLVED',
    last_update_date: '2018-02-14 12:18:34.723',
    actorinitiatorid: '1',
    categories: []
  }));

const processSet = mockupProcesses.slice(0, 10);
const processSetPopulated = processSet.map(process => ({
  ...process,
  categories: mockupCategories
}));

describe('Process API', () => {
  const spyApi = jest.spyOn(apiClient, 'get');

  describe('fetchProcesses', () => {
    let responses = {};

    beforeAll(async () => {
      spyApi.mockReset();

      spyApi.mockImplementation(
        () =>
          new Response(JSON.stringify(processSet), {
            headers: {
              'Content-Range': '0-10/25'
            }
          })
      );

      const spyCategories = jest.spyOn(CategoryApi, 'fetchByProcess');
      spyCategories.mockImplementation(() => Promise.resolve(mockupCategories));

      const { unpopulated, populated } = await ProcessApi.fetchProcesses(
        {
          page: 0,
          count: 10
        },
        {}
      );

      responses.unpopulated = await unpopulated;
      responses.populated = await populated;
    });

    it('should fetch processes', () => {
      expect(responses.unpopulated.processes).toEqual(processSet);
    });

    it('should compute pagination', () => {
      expect(responses.unpopulated.pagination).toEqual({
        page: 0,
        size: 10,
        total: 25
      });
    });

    it('should populate processes', () => {
      expect(responses.populated.processes).toEqual(processSetPopulated);
    });
  });
});
