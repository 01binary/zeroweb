import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLInt,
  GraphQLInputObjectType,
} from 'graphql';
import { GraphQLDateTime } from 'graphql-iso-date';

export const Comment = new GraphQLObjectType({
  name: 'CommentType',
  description: "Blog comment or highlight",
  fields: {
    slug: { type: GraphQLString },
    timestamp: { type: GraphQLDateTime },
    paragraph: { type: GraphQLString },
    rangeStart: { type: GraphQLInt },
    rangeLength: { type: GraphQLInt },
    user: { type: GraphQLString },
    markdown: { type: GraphQLString },
    votes: { type: GraphQLInt }
  }
});

export const CommentInput = new GraphQLInputObjectType({
  name: 'CommentInput',
  fields: {
    slug: { type: new GraphQLNonNull(GraphQLString) },
    paragraph: { type: GraphQLString },
    rangeStart: { type: GraphQLInt },
    rangeEnd: { type: GraphQLInt },
    markdown: { type: GraphQLString }
  }
});
