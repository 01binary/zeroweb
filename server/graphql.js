const ApolloServer = require('apollo-server').ApolloServer;
const typeDefs = require('./typeDefs').typeDefs;
const resolvers = require('./resolvers').resolvers;

const server = new ApolloServer({
  typeDefs,
  resolvers
});

module.exports.handler = server.createHandler();
