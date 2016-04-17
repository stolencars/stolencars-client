const rp = require('request-promise');

module.exports = function(server) {
  server.route({
      method: 'GET',
      path:'/vozidlo/{id}',
      handler: function (request, reply) {

      var options = {
        uri: 'http://localhost:3000/api/vehicles/' + request.params.id,
        json: true
      }

      rp(options)
        .then(data => {
          reply.view('detail', {
            title: 'Index',
            vehicle: data
          });
        })
        .catch(err => {console.log(err);reply(err);});


      }
  });

};
