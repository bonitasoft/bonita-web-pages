import { apiClient, Pagination, generateUrl } from '../common';

// I use a class syntax here but we can use a more functional approach if we want.
class ProcessApi {

  constructor(client) {
    this.apiClient = client;
  }

  async fetchPage({ page = 0, size = 10 } = {}, { categoryId, search }) {

    const url = generateUrl('/bonita/API/bpm/process', {
      'p': page,
      'c': size,
      's': search,
      'f': (categoryId !== '0') ? { 'categoryId': categoryId } : { 'activationState': 'ENABLED' }
    });

    const response = await this.apiClient.get(url);
    const processes = await response.json();

    return {
      processes: processes.map(process => ({ ...process, categories: [] })),
      pagination: Pagination.from(response.headers.get("Content-Range"))
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