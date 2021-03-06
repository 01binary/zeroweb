
const { ApolloServer } = require('apollo-server');
const { typeDefs } = require('./typeDefs');
const { resolvers } = require('./resolvers');

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  playground: true,
  context: () => ({
    user: {
      id: 'playground',
      authenticated: true,
      provider: 'playground',
      providerId: 'playground',
    }
  })
});

server
  .listen()
  .then(({ url }) => {
    console.log(`apollo server ready at ${url}`);
  });
