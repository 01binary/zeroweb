'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addComment = exports.getComments = undefined;

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