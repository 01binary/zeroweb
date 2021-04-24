'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _comment = require('../types/comment');

var _database = require('../../database');

var _auth = require('../../auth');

exports.default = {
  addComment: {
    type: _comment.Comment,
    description: 'Creates a new comment or highlight for a post',
    args: {
      comment: { type: _comment.CommentInput }
    },
    resolve: function resolve(parent, _ref) {
      var _ref$comment = _ref.comment,
          slug = _ref$comment.slug,
          paragraph = _ref$comment.paragraph,
          rangeStart = _ref$comment.rangeStart,
          rangeLength = _ref$comment.rangeLength,
          markdown = _ref$comment.markdown;
      return (0, _database.addComment)(slug, (0, _auth.getCurrentUser)(), new Date().getUTCDate(), markdown, paragraph, rangeStart, rangeLength);
    }
  }
};