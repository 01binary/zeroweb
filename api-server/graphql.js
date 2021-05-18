const { ApolloServer } = require('apollo-server-lambda');
const { typeDefs } = require('./typeDefs');
const { resolvers } = require('./resolvers');
const { getUser } = require('./auth');

exports.handler = (event, context, callback) => {
  const apolloHandler = new ApolloServer({
    typeDefs,
    resolvers,
    context: () => ({
      user: getUser(event.requestContext)
    }),
  }).createHandler();

  apolloHandler(event, context, callback);
};
