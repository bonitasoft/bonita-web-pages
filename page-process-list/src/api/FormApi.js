import { apiClient } from '../common';

class FormApi {
  constructor(client) {
    this.apiClient = client;
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
