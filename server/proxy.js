const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Proxy configuration
const proxyOptions = {
  target: 'https://developer.nrel.gov', // Replace with the actual API base URL
  changeOrigin: true,
  pathRewrite: {
    '^/api': '/api/alt-fuel-stations/v1.geojson', // Replace '/api' with the base path of your API, if necessary
  },
};

// Create the proxy middleware
const proxy = createProxyMiddleware(proxyOptions);

// Use the proxy for requests starting with '/api'
app.use('/api', proxy);

// Start the server
app.listen(3035, () => {
  console.log('Proxy server is running on port 3035');
});
