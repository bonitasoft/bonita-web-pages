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
import CategoryApi from './CategoryApi';

const mockupCategories = Array(3)
  .fill(null)
  .map((val, i) => ({
    createdBy: '4',
    displayName: 'Tests',
    name: 'tests',
    description: '',
    creation_date: '2018-03-02 11:05:39.490',
    id: i.toString()
  }));

const mockupProcesses = Array(4)
  .fill(null)
  .map((val, i) => ({
    displayDescription: '',
    deploymentDate: '2018-02-14 12:18:34.34',
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

const mockupCache = mockupProcesses.reduce((cache, process) => {
  cache[process.id] = mockupCategories;
  return cache;
}, {});

const extraProcess = mockupProcesses.pop();

describe('Category API', () => {
  const spyApi = jest.spyOn(apiClient, 'get');

  describe('fetchAll', () => {
    let fetchedCategories;

    beforeAll(async () => {
      spyApi.mockReset();

      spyApi.mockImplementation(
        () => new Response(JSON.stringify(mockupCategories))
      );

      fetchedCategories = await CategoryApi.fetchAll();
    });

    it('should fetch all categories', () => {
      expect(fetchedCategories).toEqual(mockupCategories);
    });
  });

  describe('fetchByProcess', () => {
    let fetchedCategories;
    let fetchedCategories2;

    beforeAll(async () => {
      spyApi.mockReset();

      spyApi.mockImplementation(
        () => new Response(JSON.stringify(mockupCategories))
      );

      fetchedCategories = await Promise.all(
        mockupProcesses.map(process => CategoryApi.fetchByProcess(process))
      );

      spyApi.mockClear();

      fetchedCategories2 = await Promise.all([
        ...mockupProcesses.map(process => CategoryApi.fetchByProcess(process)),
        CategoryApi.fetchByProcess(extraProcess)
      ]);
    });

    it('should fetch categories', () => {
      expect(fetchedCategories).toEqual(Array(3).fill(mockupCategories));
    });

    it('should cache all categories', () => {
      expect(CategoryApi.cache).toEqual(mockupCache);
    });

    it('should get categories from cache else network', () => {
      expect(fetchedCategories2).toEqual(Array(4).fill(mockupCategories));
      expect(spyApi).toHaveBeenCalledTimes(1);
    });
  });
});
