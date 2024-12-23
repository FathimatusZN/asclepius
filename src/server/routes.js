const {
  postPredictHandler,
  getHistoriesHandler,
} = require("../server/handler");

const routes = [
  {
    path: "/predict",
    method: "POST",
    handler: postPredictHandler,
    options: {
      payload: {
        /*Mengizinkan data berupa gambar*/
        allow: "multipart/form-data",
        multipart: true,
      },
    },
  },
  {
    method: "GET",
    path: "/predict/histories",
    handler: getHistoriesHandler,
  },
];

module.exports = routes;
