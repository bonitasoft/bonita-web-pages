import cookie from "./Cookie";

const OPTIONS = {
  credentials: "same-origin", // automatically send cookies for the current domain
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json"
  }
};

const headers = () => {
  const csrfToken = cookie.getValue("X-Bonita-API-Token");
  return csrfToken
    ? { ...OPTIONS.headers, "X-Bonita-API-Token": csrfToken }
    : { ...OPTIONS.headers };
};

class Client {
  constructor() {
    this.interceptors = [];
  }

  get(url) {
    const options = {
      ...OPTIONS,
      method: "GET",
      headers: headers()
    };

    return this._fetch(url, options);
  }

  post(url, body) {
    const options = {
      ...OPTIONS,
      method: "POST",
      headers: headers(),
      body: JSON.stringify(body)
    };

    return this._fetch(url, options);
  }

  register(interceptor) {
    this.interceptors.push(interceptor);
  }

  _fetch(url, options) {
    let promise = fetch(url, options).then(response => {
      if (response.ok) {
        return Promise.resolve(response);
      }
      return Promise.reject(response);
    });

    // chain responseError interceptors
    this.interceptors.forEach(({ responseError }) => {
      if (responseError) {
        promise = promise.catch(responseError);
      }
    });

    return promise;
  }
}

export default new Client();
