
const ApolloServer = require('apollo-server').ApolloServer;
const typeDefs = require('./typeDefs').typeDefs;
const resolvers = require('./resolvers').resolvers;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  playground: true
});

server
  .listen()
  .then(({ url }) => {
    console.log(`apollo server ready at ${url}`);
  });
