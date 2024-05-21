// routes.js

const { postPredictHandler, getPredictHistoriesHandler } = require('./handler'); // Import handler baru

const routes = [
  {
    path: '/predict',
    method: 'POST',
    handler: postPredictHandler,
    options: {
      payload: {
        allow: 'multipart/form-data',
        multipart: true,
        maxBytes: 1000000,
      }
    }
  },
  {
    path: '/predict/histories', // Path untuk endpoint baru
    method: 'GET', // Method GET
    handler: getPredictHistoriesHandler // Menggunakan handler yang baru
  }
];

module.exports = routes;
