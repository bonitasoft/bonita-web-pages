
const defaultOptions = {
  credentials: 'include', // automatically send cookies for the current domain
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    // 'Cookie': document.cookie,
    'Access-Control-Allow-Origin': '*'
  },
  mode: 'cors',
  cache: 'default'
};

function parseParams(params) {
  return Object.keys(params)
    .map(k => {
      if (Array.isArray(params[k])) {
        return params[k]
          .map((val) => encodeURIComponent(k) + '[]=' + encodeURIComponent(val))
          .join('&');
      }

      if (params[k] !== null & typeof params[k] === 'object') {
        return encodeURIComponent(k) + '=' + parseParams(params[k]);
      }

      return encodeURIComponent(k) + '=' + encodeURIComponent(params[k]);
    })
    .join('&');
}

// return a promise with data (processes, tasks, categories, ...)
const request = (method) => (baseUrl, params) => {
  const options = { ...defaultOptions, method };
  let url = baseUrl;

  if (['GET', 'DELETE'].indexOf(method) > -1) {
    url += '?' + parseParams(params);
  } else { // POST or PUT
    options.body = JSON.stringify(params);
  }

  return fetch(url, options)
    .catch((err) => console.error(`Network error : fetching ${url}\n`, err))
    .then((response) => response.json().then((data) => {
      const range = response.headers.get("Content-Range");
      let pagination = {};

      if (range) {
        const { p: page, c: count } = params;

        pagination = {
          start: page * count + ((data.length) ? 1 : 0),
          end: page * count + data.length,
          total: parseInt(range.split('/')[1], 10),
          page,
          count
        };
      }

      return Promise.resolve({ data, pagination }); //return a promise
    }));
}

export default {
  get: request('GET'),
  post: request('POST'),
  put: request('PUT'),
  delete: request('DELETE')
}