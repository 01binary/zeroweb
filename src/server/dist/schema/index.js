'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _graphql = require('graphql');

var _comments = require('./queries/comments');

var _comments2 = _interopRequireDefault(_comments);

var _addComment = require('./mutations/addComment');

var _addComment2 = _interopRequireDefault(_addComment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = new _graphql.GraphQLSchema({
  query: new _graphql.GraphQLObjectType({
    name: 'RootQuery',
    fields: _extends({}, _comments2.default)
  }),

  mutation: new _graphql.GraphQLObjectType({
    name: 'RootMutation',
    fields: _extends({}, _addComment2.default)
  })
});

exports.default = Schema;