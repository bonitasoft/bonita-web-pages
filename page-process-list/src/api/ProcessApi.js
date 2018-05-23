import { apiClient, Pagination, generateUrl } from '../common';

class ProcessApi {
  constructor(client) {
    this.apiClient = client;
    this.categoriesByProcessCache = {};
  }

  async fetchProcesses(
    { page = 0, size = 25 } = {},
    { categoryId, search, order }
  ) {
    const url = generateUrl('/bonita/API/bpm/process', {
      p: page,
      c: size,
      s: search,
      o: `displayName ${order}`,
      f:
        categoryId !== '0'
          ? `categoryId=${categoryId}`
          : 'activationState=ENABLED'
    });

    const response = await this.apiClient.get(url);
    const processes = await response.json();

    return {
      unpopulated: Promise.resolve({
        processes: processes.map(process => ({ ...process, categories: [] })),
        pagination: Pagination.from(response.headers.get('Content-Range'))
      }),

      populated: Promise.all(
        processes.map(process =>
          this.fetchCategoriesByProcess(process).then(categories => ({
            ...process,
            categories
          }))
        )
      ).then(processes => ({ processes }))
    };
  }

  async fetchCategoriesByProcess(process) {
    const buildCategoryUrl = processId =>
      generateUrl('/bonita/API/bpm/category', {
        p: 0,
        c: Math.pow(2, 31) - 1,
        f: `id=${processId}`
      });

    if (this.categoriesByProcessCache[process.id]) {
      return Promise.resolve(this.categoriesByProcessCache[process.id]);
    } else {
      const response = await this.apiClient.get(buildCategoryUrl(process.id));
      const categories = await response.json();

      this.categoriesByProcessCache[process.id] = categories;

      return Promise.resolve(categories);
    }
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
