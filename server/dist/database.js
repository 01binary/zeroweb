'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteComment = exports.voteComment = exports.editComment = exports.addComment = exports.getComments = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _awsSdk = require('aws-sdk');

var _awsSdk2 = _interopRequireDefault(_awsSdk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_awsSdk2.default.config.update({ region: 'us-west-2' });

var db = new _awsSdk2.default.DynamoDB.DocumentClient();

var getComments = exports.getComments = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(slug) {
    var _ref2, Items;

    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return db.query({
              TableName: 'zeroweb-comments',
              KeyConditionExpression: 'slug = :slug',
              ExpressionAttributeValues: {
                ':slug': slug
              }
            }).promise();

          case 2:
            _ref2 = _context.sent;
            Items = _ref2.Items;
            return _context.abrupt('return', Items);

          case 5:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function getComments(_x) {
    return _ref.apply(this, arguments);
  };
}();

var addComment = exports.addComment = function () {
  var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(comment) {
    var Item;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            Item = (0, _extends3.default)({}, comment, { votes: 0 });
            _context2.next = 3;
            return db.put({
              TableName: 'zeroweb-comments',
              Item: Item
            }).promise();

          case 3:
            return _context2.abrupt('return', Item);

          case 4:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function addComment(_x2) {
    return _ref3.apply(this, arguments);
  };
}();

var editComment = exports.editComment = function () {
  var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(slug, timestamp, markdown) {
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  }));

  return function editComment(_x3, _x4, _x5) {
    return _ref4.apply(this, arguments);
  };
}();

var voteComment = exports.voteComment = function () {
  var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(slug, timestamp, upVote) {
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, undefined);
  }));

  return function voteComment(_x6, _x7, _x8) {
    return _ref5.apply(this, arguments);
  };
}();

var deleteComment = exports.deleteComment = function () {
  var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(comment) {
    var slug, timestamp;
    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            slug = comment.slug, timestamp = comment.timestamp;
            _context5.next = 3;
            return db.delete({
              TableName: 'zeroweb-comments',
              Key: {
                slug: slug,
                timestamp: timestamp
              }
            }).promise();

          case 3:
            return _context5.abrupt('return', comment);

          case 4:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, undefined);
  }));

  return function deleteComment(_x9) {
    return _ref6.apply(this, arguments);
  };
}();