'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CommentInput = exports.Comment = undefined;

var _graphql = require('graphql');

var _graphqlIsoDate = require('graphql-iso-date');

var Comment = exports.Comment = new _graphql.GraphQLObjectType({
  name: 'CommentType',
  description: "Blog comment or highlight",
  fields: {
    slug: { type: _graphql.GraphQLString },
    timestamp: { type: _graphqlIsoDate.GraphQLDateTime },
    paragraph: { type: _graphql.GraphQLString },
    rangeStart: { type: _graphql.GraphQLInt },
    rangeLength: { type: _graphql.GraphQLInt },
    user: { type: _graphql.GraphQLString },
    markdown: { type: _graphql.GraphQLString },
    votes: { type: _graphql.GraphQLInt }
  }
});

var CommentInput = exports.CommentInput = new _graphql.GraphQLInputObjectType({
  name: 'CommentInput',
  fields: {
    slug: { type: new _graphql.GraphQLNonNull(_graphql.GraphQLString) },
    paragraph: { type: _graphql.GraphQLString },
    rangeStart: { type: _graphql.GraphQLInt },
    rangeEnd: { type: _graphql.GraphQLInt },
    markdown: { type: _graphql.GraphQLString }
  }
});