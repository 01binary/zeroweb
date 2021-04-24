'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _graphql = require('graphql');

var _comment = require('../types/comment');

var _database = require('../../database');

exports.default = {
  comments: {
    type: (0, _graphql.GraphQLList)(_comment.Comment),
    description: 'Get post comments',
    args: {
      slug: { type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLString) }
    },
    resolve: function resolve(parent, _ref) {
      var slug = _ref.slug;
      return (0, _database.getComments)(slug);
    }
  }
};