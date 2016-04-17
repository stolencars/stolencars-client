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

  server.route({
      method: 'GET',
      path:'/add',
      handler: function (request, reply) {
          reply.view('add-vehicle',
            {'TypesEnum': require('../enums/VehicleType.js')}
          );
        }
  });

  server.route({
      method: 'POST',
      path:'/add',
      handler: function (request, reply) {
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
        const vehicleData = request.payload;
        var result = Joi.validate(vehicleData, schema);

        if(!result.error) {
          console.log(vehicleData);
          var options = {
           method: 'POST',
            uri: 'http://localhost:3000/api/vehicles',
            body: vehicleData,
            json: true
          };
          rp(options)
            .then(result => {return {value:value}})
            .catch(err => {return {value:vehicleData, error:{details:[err.error]}}})
            .then(result => {
              console.log(result);
              reply.view('add-vehicle', {
                'TypesEnum': require('../enums/VehicleType.js'),
                'result' : result
              });
            });
        } else {
          reply.view('add-vehicle', {
            'TypesEnum': require('../enums/VehicleType.js'),
            'result' : result
          });
        }
      }
  });
};
