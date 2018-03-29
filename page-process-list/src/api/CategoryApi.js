import { apiClient } from '../common';

// I use a class syntax here but we can use a more functional approach if we want.
class CategoryApi {

  constructor(client) {
    this.apiClient = client;
  }

  fetchAll() {
    // TODO to be implemented using this.apiClient
  }
}

export default new CategoryApi(apiClient);