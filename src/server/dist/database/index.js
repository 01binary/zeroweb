'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var comments = [{
  slug: 'test',
  user: 'tom',
  timestamp: new Date().getUTCDate(),
  markdown: 'hello, *world*!',
  paragraph: 'abc',
  rangeStart: 0,
  rangeLength: 10,
  votes: 2
}, {
  slug: 'test',
  user: 'berry',
  timestamp: new Date().getUTCDate(),
  markdown: 'another comment here',
  paragraph: 'xyz',
  rangeStart: 5,
  rangeLength: 20,
  votes: 0
}];

var getComments = exports.getComments = function getComments(slugFilter) {
  return comments.filter(function (_ref) {
    var slug = _ref.slug;
    return slug == slugFilter;
  });
};

var addComment = exports.addComment = function addComment(slug, user, timestamp, markdown, paragraph, rangeStart, rangeLength) {
  var comment = {
    slug: slug,
    user: user,
    timestamp: timestamp,
    markdown: markdown,
    paragraph: paragraph,
    rangeStart: rangeStart,
    rangeLength: rangeLength,
    votes: 0
  };

  comments.push(comment);

  return comment;
};