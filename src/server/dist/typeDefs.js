'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.typeDefs = undefined;

var _taggedTemplateLiteral2 = require('babel-runtime/helpers/taggedTemplateLiteral');

var _taggedTemplateLiteral3 = _interopRequireDefault(_taggedTemplateLiteral2);

var _templateObject = (0, _taggedTemplateLiteral3.default)(['\n  scalar Timestamp\n\n  type Comment {\n    slug: String!\n    timestamp: Timestamp!\n    user: String!\n    votes: Int\n    markdown: String\n    paragraph: String\n    rangeStart: Int\n    rangeLength: Int\n  }\n\n  input CommentInput {\n    slug: String!\n    markdown: String\n    paragraph: String\n    rangeStart: Int\n    rangeLength: Int\n  }\n\n  type Query {\n    comments(slug: String!): [Comment!]!\n  }\n\n  type Mutation {\n    addComment(comment: CommentInput!): Comment\n  }\n\n  schema {\n    query: Query\n    mutation: Mutation\n  }\n'], ['\n  scalar Timestamp\n\n  type Comment {\n    slug: String!\n    timestamp: Timestamp!\n    user: String!\n    votes: Int\n    markdown: String\n    paragraph: String\n    rangeStart: Int\n    rangeLength: Int\n  }\n\n  input CommentInput {\n    slug: String!\n    markdown: String\n    paragraph: String\n    rangeStart: Int\n    rangeLength: Int\n  }\n\n  type Query {\n    comments(slug: String!): [Comment!]!\n  }\n\n  type Mutation {\n    addComment(comment: CommentInput!): Comment\n  }\n\n  schema {\n    query: Query\n    mutation: Mutation\n  }\n']);

var _apolloServerLambda = require('apollo-server-lambda');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var typeDefs = exports.typeDefs = (0, _apolloServerLambda.gql)(_templateObject);