import { apiClient, Pagination, generateUrl } from '../common';

// I use a class syntax here but we can use a more functional approach if we want.
class ProcessApi {

  constructor(client) {
    this.apiClient = client;
    this.categoriesByProcessCache = {};
  }

  fetchCategoriesByProcess(process) {
    const generateCategoryUrl = (processId) => generateUrl('/bonita/API/bpm/category', {
      'p': 0,
      'c': Number.MAX_SAFE_INTEGER % 1, // some working cast,
      'f': { 'id': processId }
    });

    return this.categoriesByProcessCache[process.id]
              ? Promise.resolve(this.categoriesByProcessCache[process.id])
              : this.apiClient.get(generateCategoryUrl(process.id))
                              .then(response => response.json())
                              .then(categories => this.categoriesByProcessCache[process.id] = categories);
  }

  async fetchPage({ page = 0, size = 50 } = {}, { categoryId, search, order }) {

    const url = generateUrl('/bonita/API/bpm/process', {
      'p': page,
      'c': size,
      's': search,
      'o': `name ${order}`,
      'f': (categoryId !== '0') ? { 'categoryId': categoryId } : { 'activationState': 'ENABLED' }
    });

    const response = await this.apiClient.get(url);
    const processes = await response.json();


    return {
      unpopulated: Promise.resolve({
                     processes: processes.map(process => ({ ...process, categories: [] })),
                     pagination: Pagination.from(response.headers.get("Content-Range"))
                   }),

      populated: Promise.all(processes.map(process =>
                   this.fetchCategoriesByProcess(process)
                       .then(categories => ({...process, categories})))
                 )
                 .then(processes => ({ processes }))
    };

  }
}

export default new ProcessApi(apiClient)


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