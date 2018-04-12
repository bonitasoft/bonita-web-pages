import { apiClient, Pagination } from "../common";

export class UserAPI {
  constructor(client) {
    this.client = client;
    // should be activated if this page goes as custom page in a LA
    // this.client.register({ responseError: sessionTimeoutInterceptor });
  }

  async getUsers(pagination) {
    const response = await this.client.get(`../API/identity/user?p=${pagination.page}&c=${pagination.size}`);
    return {
        data: await response.json(),
        pagination: Pagination.from(response.headers.get('content-range'))
    }
  }
}

export default new UserAPI(apiClient);
