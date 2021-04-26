import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';
import { getCurrentUser } from './auth';
import { getComments, addComment } from './database';

const serializeDate = (value) => {
  if (value instanceof Date) {
    return value.getTime();
  } else if (typeof value === 'number') {
    return Math.trunc(value);
  } else if (typeof value === 'string') {
    return Date.parse(value);
  }

  return null;
};

const parseDate = (value) => {
  if (value === null) return null;
  try {
    return new Date(value);
  } catch(ex) {
    return null;
  }
};

const parseDateFromLiteral = (ast) => {
  if (ast.kind === Kind.INT) {
    const num = parseInt(ast.value, 10);
    return new Date(num);
  } else if (ast.kind === Kind.STRING) {
    return parseDate(ast.value);
  }

  return null;
};

export const resolvers = {
  Timestamp: new GraphQLScalarType({
    name: 'Timestamp',
    serialize: serializeDate,
    parseValue: parseDate,
    parseLiteral: parseDateFromLiteral
  }),
  Query: {
    comments: async (root, { slug }) => getComments(slug)
  },
  Mutation: {
    addComment: async (root, { comment }) => addComment({
      ...comment,
      user: getCurrentUser(),
      timestamp: new Date().valueOf()
    })
  }
};
