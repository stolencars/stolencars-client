const TypesEnum = require('../../enums/VehicleType.js');
const api = require('../../api/ApiHelper');
const Joi = require('joi');

module.exports = function(server) {

  server.route({
      method: 'GET',
      path:'/add',
      handler: function (request, reply) {
          reply.view('add-vehicle',
            {'TypesEnum': TypesEnum}
          );
        }
  });

  const schema = Joi.object().keys({
    vehicle_class: Joi.string().default('osobní vozidlo'),
    type: Joi.string().min(1).required(),
    registration_code: Joi.string().min(1),
    color: Joi.string(),
    vin: Joi.string().min(1).required(),
    year: Joi.number().integer().required(),
    stolen_date: Joi.date().default(Date.now, 'time of theft'),
    engine_code: Joi.string().allow(''),
    note: Joi.string().allow('')
  });

  server.route({
      method: 'POST',
      path:'/add',
      handler: function (request, reply) {
        api.post('http://localhost:3000/api/vehicles', request.payload, schema, null, {authorization:request.state.auth})
          .then(result => {console.log(result);reply.redirect('/vehicle/' + result._id);})
          .catch(validation => {reply.view('add-vehicle', {result:validation, 'TypesEnum': TypesEnum});});
      }
  });
};
