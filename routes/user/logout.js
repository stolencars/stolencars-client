module.exports = function(server) {
  server.route({
    method: 'GET',
    path: '/user/logout',
    handler: function (request, reply) {
        reply.unstate('auth', {path:'/'});
        reply.redirect('/');
    }
  });
}
