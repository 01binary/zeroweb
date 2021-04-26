'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handler = undefined;

var _apolloServerLambda = require('apollo-server-lambda');

var _typeDefs = require('./typeDefs');

var _resolvers = require('./resolvers');

var server = new _apolloServerLambda.ApolloServer({
  typeDefs: _typeDefs.typeDefs,
  resolvers: _resolvers.resolvers
});

var handler = exports.handler = server.createHandler();