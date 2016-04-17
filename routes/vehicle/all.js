const rp = require('request-promise');
const Joi = require('joi');

module.exports = function(server) {
  server.route({
      method: 'GET',
      path:'/',
      handler: function (request, reply) {

      var options = {
        uri: 'http://localhost:3000/api/vehicles',
        qs: {
            offset: 1,
            limit: 10
        },
        json: true
      }

      rp(options)
        .then(data => {
          reply.view('index', {
            title: 'Index',
            vehicles: data
          });
        })
        .catch(err => {console.log(err);reply(err);});


      }
  });

};
