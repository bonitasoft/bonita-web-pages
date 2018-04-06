import { apiClient, generateUrl } from '../common';

// I use a class syntax here but we can use a more functional approach if we want.
class ProcessApi {

  constructor(client) {
    this.apiClient = client;
  }

  fetchPage({ page = 0, count = 10 } = {}, options) {

    const url = generateUrl('/bonita/API/bpm/process', {
      'p': page,
      'c': count
    });

    return this.apiClient.get(url, options)
                         .then(response => response.json())
                         .then(processes => processes.map(process => ({ ...process, categories: [] })))
                         .catch(err => console.error(err));
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