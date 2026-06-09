const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    ['^/API', '^/portal'],
    createProxyMiddleware({
      target: 'http://localhost:8080/bonita',
      changeOrigin: true,
    })
  );
};
