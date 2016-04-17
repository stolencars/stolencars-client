const Joi = require('joi');
const rp = require('request-promise');
const api = require('../../api/ApiHelper');

module.exports = function(server) {

  const schema = Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().min(5).required(),
    password_repeat: Joi.any().valid(Joi.ref('password')).required().options({ language: { any: { allowOnly: 'must match password' } } }),
    agree: Joi.boolean().valid(true).required()
  });

  server.route({
    method: 'GET',
    path: '/user/register',
    handler: function (request, reply) {
      reply.view('register');
    }
  });

  server.route({
    method: 'POST',
    path: '/user/register',
    handler: function (request, reply) {

      const transformation = (data) => {
        return {
          email: data.email,
          password: data.password,
        }
      };

      api.post('http://localhost:3000/api/users/create', request.payload, schema, transformation)
        .then(jwtToken => {
          reply.state('auth', jwtToken, {isHttpOnly: true, path:'/'});
          reply.redirect('/');
        })
        .catch(validation => {reply.view('register', {result:validation});});
    }
  });
}
