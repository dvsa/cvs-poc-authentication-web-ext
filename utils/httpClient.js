// TODO: Clean up use of this.
var axios = require('axios');

var createInstance = (baseURL, headers) => axios.create({
  baseURL: baseURL,
  headers: headers,
});

module.exports = createInstance;