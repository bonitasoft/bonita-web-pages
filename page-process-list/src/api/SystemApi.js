import { apiClient } from '../common';
import { sessionTimeoutInterceptor } from '../common/SessionTimeoutInterceptor';

class SystemApi {
  constructor(client) {
    this.apiClient = client;
    this.apiClient.register({ responseError: sessionTimeoutInterceptor });
  }

  async fetchSession() {
    return this.apiClient
      .get('../API/system/session/unusedId')
      .then(response => response.json());
  }
}

export default new SystemApi(apiClient);
