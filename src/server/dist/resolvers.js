'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resolvers = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _graphql = require('graphql');

var _language = require('graphql/language');

var _auth = require('./auth');

var _database = require('./database');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var serializeDate = function serializeDate(value) {
  if (value instanceof Date) {
    return value.getTime();
  } else if (typeof value === 'number') {
    return Math.trunc(value);
  } else if (typeof value === 'string') {
    return Date.parse(value);
  }

  return null;
};

var parseDate = function parseDate(value) {
  if (value === null) return null;
  try {
    return new Date(value);
  } catch (ex) {
    return null;
  }
};

var parseDateFromLiteral = function parseDateFromLiteral(ast) {
  if (ast.kind === _language.Kind.INT) {
    var num = parseInt(ast.value, 10);
    return new Date(num);
  } else if (ast.kind === _language.Kind.STRING) {
    return parseDate(ast.value);
  }

  return null;
};

var resolvers = exports.resolvers = {
  Timestamp: new _graphql.GraphQLScalarType({
    name: 'Timestamp',
    serialize: serializeDate,
    parseValue: parseDate,
    parseLiteral: parseDateFromLiteral
  }),
  Query: {
    comments: function () {
      var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(root, _ref) {
        var slug = _ref.slug;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                return _context.abrupt('return', (0, _database.getComments)(slug));

              case 1:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, undefined);
      }));

      function comments(_x, _x2) {
        return _ref2.apply(this, arguments);
      }

      return comments;
    }()
  },
  Mutation: {
    addComment: function () {
      var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(root, _ref3) {
        var comment = _ref3.comment;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                return _context2.abrupt('return', (0, _database.addComment)((0, _extends3.default)({}, comment, {
                  user: (0, _auth.getCurrentUser)(),
                  timestamp: new Date().valueOf()
                })));

              case 1:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, undefined);
      }));

      function addComment(_x3, _x4) {
        return _ref4.apply(this, arguments);
      }

      return addComment;
    }()
  }
};