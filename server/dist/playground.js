'use strict';

var _apolloServer = require('apollo-server');

var _typeDefs = require('./typeDefs');

var _resolvers = require('./resolvers');

var server = new _apolloServer.ApolloServer({
  typeDefs: _typeDefs.typeDefs,
  resolvers: _resolvers.resolvers,
  introspection: true,
  playground: true
});

server.listen().then(function (_ref) {
  var url = _ref.url;

  console.log('apollo server ready at ' + url);
});