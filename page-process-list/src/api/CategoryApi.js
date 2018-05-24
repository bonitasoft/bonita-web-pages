import { apiClient, generateUrl } from '../common';

class CategoryApi {
  constructor(client) {
    this.apiClient = client;
    this.cache = {};
  }

  async fetchAll() {
    const url = generateUrl('/bonita/API/bpm/category', {
      p: 0,
      c: Math.pow(2, 31) - 1
    });

    const response = await this.apiClient.get(url);
    const categories = await response.json();

    return categories;
  }

  async fetchByProcess({ id }) {
    const buildCategoryUrl = processId =>
      generateUrl('/bonita/API/bpm/category', {
        p: 0,
        c: Math.pow(2, 31) - 1,
        f: `id=${processId}`
      });

    if (this.cache[id]) {
      return Promise.resolve(this.cache[id]);
    } else {
      const response = await this.apiClient.get(buildCategoryUrl(id));
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
