import { ApolloServer } from 'apollo-server-lambda';
import { typeDefs } from './typeDefs';
import { resolvers } from './resolvers';

const server = new ApolloServer({
  typeDefs,
  resolvers
});

export const handler = server.createHandler();
