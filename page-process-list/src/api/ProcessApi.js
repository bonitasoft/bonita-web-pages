import { apiClient, Pagination, Url } from '../common';
import CategoryApi from './CategoryApi';

class ProcessApi {
  constructor(client) {
    this.apiClient = client;
  }

  async fetchProcesses(
    { page = 0, size = 25 } = {},
    { categoryId, search, order } = {}
  ) {
    const url = new Url('../API/bpm/process', {
      queries: {
        p: page,
        c: size,
        s: search,
        o: order ? `displayName ${order}` : undefined,
        f:
          categoryId && categoryId !== '0'
            ? `categoryId=${categoryId}`
            : 'activationState=ENABLED'
      }
    });

    const response = await this.apiClient.get(url.get());
    const processes = await response.json();

    return {
      unpopulated: Promise.resolve({
        processes: processes.map(process => ({ ...process, categories: [] })),
        pagination: Pagination.from(response.headers.get('Content-Range'))
      }),

      populated: Promise.all(
        processes.map(process =>
          CategoryApi.fetchByProcess(process).then(categories => ({
            ...process,
            categories
          }))
        )
      ).then(processes => ({ processes }))
    };
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
