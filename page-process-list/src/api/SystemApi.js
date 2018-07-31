import { apiClient } from '../common';

const sessionTimeoutInterceptor = response => {
  if (response.status === 401) {
    window.parent.location.reload();
  }
  return Promise.reject(response);
};

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
