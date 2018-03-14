
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

  return fetch(url, options).then(function (response) {
    if (response.ok) {
      const range = response.headers.get("Content-Range");
      let pagination = {};
      console.log('response headers content-range: ', response.headers.get("Content-Range"));

      if (range) {
        const regexp = new RegExp(/^items=(\d+)-(\d+)\/(\d+)$/);
        const result = range.match(regexp);

        pagination = {
          start: result[0],
          end: result[1],
          total: result[2],
          page: params.p,
          count: params.c
        };
      }
      return response.json().then((data) => Promise.resolve({data, pagination}));
    }
    return Promise.reject(response.error);
  });
}

export default {
  get: request('GET'),
  post: request('POST'),
  put: request('PUT'),
  delete: request('DELETE')
}