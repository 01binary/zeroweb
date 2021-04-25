import {
  GraphQLNonNull,
  GraphQLString,
  GraphQLList,
} from 'graphql';
import { Comment } from '../types/comment';
import { getComments } from '../../database';

export default {
  comments: {
    type: GraphQLList(Comment),
    description: 'Get post comments',
    args: {
      slug: { type: GraphQLNonNull(GraphQLString) }
    },
    resolve: (parent, { slug }) => getComments(slug)
  }
};
