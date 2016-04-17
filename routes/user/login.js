const Joi = require('joi');
const rp = require('request-promise');

module.exports = function(server) {

  server.route({
    method: 'GET',
    path: '/user/login',
    handler: function (request, reply) {
      reply.view('login');
    }
  });

  server.route({
    method: 'POST',
    path: '/user/login',
    handler: function (request, reply) {
      const schema = Joi.object().keys({
        email: Joi.string().required(),
        password: Joi.string().required()
      });
      const vehicleData = request.payload;
      var result = Joi.validate(vehicleData, schema);

      if(!result.error) {
        console.log(result);
        var options = {
         method: 'POST',
          uri: 'http://localhost:3000/api/users/login',
          body: result.value,
          json: true
        };
        rp(options)
          .then(result => {
            reply.state('auth', result, {isHttpOnly: true, path:'/'});
            return {value:result};
          })
          .catch(err => {return {error:err}})
          .then(result => {
            console.log(result);
            reply.redirect('/');
          });
      } else {
        reply.view('login', {result:result});
      }

    }
  });
}
