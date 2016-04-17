'use strict';

const Hapi = require('hapi');
const Vision = require('vision');
const Inert = require('inert');
const Path = require('path');
const Nunjucks = require('./views/Nunjucks');
const jwt = require('jwt-decode');

var env = process.env.NODE_ENV || 'production';

// Create a server with a host and port
const server = new Hapi.Server();
server.connection({
    host: 'localhost',
    port: 3001
});

server.register([Vision, Inert], (err) => {
    if (err) {
        console.log("Failed to load vision.");
    } else {
      server.views({
            engines: {
                html: Nunjucks
            },
            helpersPath: Path.join(__dirname, 'views', 'helpers'),
            path: Path.join(__dirname, 'views', 'templates'),
            isCached: env === 'production',
            context: function(request) {
              const context = {};
              const cookies = request.state;

              console.log(cookies);

              if(cookies.auth) {
                context.user = jwt(cookies.auth);
              }
              return context;
            }
        });

      require('./routes/vehicle/all')(server, {});
      require('./routes/vehicle/add')(server, {});
      require('./routes/detail')(server, {});
      require('./routes/user/login')(server, {});
      require('./routes/user/register')(server, {});
      require('./routes/user/logout')(server, {});
      require('./routes/assets')(server, {});

      // Start the server
      server.start((err) => {

          if (err) {
              throw err;
          }
          console.log('Server running at:', server.info.uri);
      });
    }
});
