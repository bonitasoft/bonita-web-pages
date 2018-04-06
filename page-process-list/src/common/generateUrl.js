function parseParams(params) {
  return Object.keys(params)
               .map(k => {
                 if (Array.isArray(params[k])) {
                   return params[k]
                     .map((val) => encodeURIComponent(k) + '[]=' + encodeURIComponent(val))
                     .join('&');
                 }

                 if (params[k] !== null && typeof params[k] === 'object') {
                   return encodeURIComponent(k) + '=' + parseParams(params[k]);
                 }

                 return encodeURIComponent(k) + '=' + encodeURIComponent(params[k]);
               })
               .join('&');
}


const generateUrl = (url, params) => (params && Object.keys(params).length > 0) ? `${url}?${parseParams(params)}` : url;

export default generateUrl