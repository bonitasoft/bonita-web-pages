import { apiClient } from '../common';

export class UserAPI {
  constructor(client) {
    this.client = client;
    // should be activated if this page goes as custom page in a LA
    // this.client.register({ responseError: sessionTimeoutInterceptor });
  }

  async getUsers() {
    const response = await this.client.get(`../API/identity/user?p=0&c=9999`);
    return response.json();
  }

}

export default new UserAPI(apiClient);