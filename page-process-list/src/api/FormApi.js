import { apiClient } from '../common';
import { sessionTimeoutInterceptor } from '../common/SessionTimeoutInterceptor';

class FormApi {
  constructor(client) {
    this.apiClient = client;
    this.apiClient.register({ responseError: sessionTimeoutInterceptor });
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
