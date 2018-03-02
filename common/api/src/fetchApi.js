
const defaultOptions = {
  credentials: 'same-origin', // automatically send cookies for the current domain
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    // 'Cookie': document.cookie,
    //'Access-Control-Allow-Origin': '*'
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

      return encodeURIComponent(k) + '=' + encodeURIComponent(params[k]);
    })
    .join('&');
}

// return a promise with data (processes, tasks, categories, ...)
function request(baseUrl, params, method) {
  const options = { ...defaultOptions, method };
  const url = baseUrl;

  if (['GET', 'DELETE'].indexOf(method) > -1)
    url += '?' + parseParams(params);
  else // POST or PUT
    options.body = JSON.stringify(params);

  return fetch(url, options).then(function (response) {
    if (response.ok) {
      return Promise.resolve(response.json());
    }
    return Promise.reject(response.error());
  });
}

export default {
  get: (params) => request(url, params, {method: 'GET'}),
  post: (params) => request(url, params, {method: 'POST'}),
  put: (params) => request(url, params, {method: 'PUT'}),
  delete: (params) => request(url, params, {method: 'DELETE'})
}