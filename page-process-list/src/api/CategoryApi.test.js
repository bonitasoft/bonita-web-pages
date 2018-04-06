import { apiClient } from '../common';
import CategoryApi from './CategoryApi';

const mockupCategories = Array(25).fill({
  createdBy: '4',
  displayName: 'azdfesfe',
  name: 'azdfesfe',
  description: '',
  creation_date: '2018-03-02 11:05:39.490',
  id: '101'
});

describe('Category API', () => {
  const spyGet = jest.spyOn(apiClient, 'get');

  beforeEach(() => {
    spyGet.mockReset();
    spyGet.mockRestore();
  });

  it('should fetch all categories', () => {
    const spyGet = jest.spyOn(CategoryApi, 'fetchAll');
    spyGet.mockImplementation(() => Promise.resolve(mockupCategories));

    CategoryApi.fetchAll().then(categories =>
      expect(categories).toEqual(mockupCategories)
    );
  });
});
