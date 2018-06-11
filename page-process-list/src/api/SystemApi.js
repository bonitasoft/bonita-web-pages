import { apiClient } from '../common';

class SystemApi {
  constructor(client) {
    this.apiClient = client;
  }

  async fetchSession() {
    return this.apiClient
      .get('../API/system/session/unusedId')
      .then(response => response.json());
  }
}

export default new SystemApi(apiClient);
