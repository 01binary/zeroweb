import {
  GraphQLSchema,
  GraphQLObjectType,
} from 'graphql';

import comments from './queries/comments';
import addComment from './mutations/addComment';

const Schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQuery',
    fields: {
      ...comments,
    }
  }),
  
  mutation: new GraphQLObjectType({
    name: 'RootMutation',
    fields: {
      ...addComment,
    }
  })
});

export default Schema;
