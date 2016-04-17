const Joi = require('joi');
const rp = require('request-promise');

const transformApiError = function(apiError, originalData) {
  console.log(apiError.error);
  return {
    error: {
      details: [apiError.error]
    },
    value: originalData
  };
}

const execute = function(method, url, data, schema, transformation, headers) {

  var validation = Joi.validate(data, schema);

  if(validation.error) {
    return Promise.reject(validation);
  }

  const payload = transformation ? transformation(data) : data;

  const options = {
   method: method,
    uri: url,
    body: payload,
    json: true,
  };

  console.log(headers);

  if(headers) {
    options.headers = headers;
  }

  return rp(options)
    .catch(err => Promise.reject(transformApiError(err, data)));
}

module.exports = {
    execute:execute,
    get: (url, data, schema, transformation, headers) => execute('GET', url, data, schema, transformation, headers),
    post: (url, data, schema, transformation, headers) => execute('POST', url, data, schema, transformation, headers)
}
