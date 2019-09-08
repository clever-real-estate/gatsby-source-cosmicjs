'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _fetch = require('./fetch');

var _fetch2 = _interopRequireDefault(_fetch);

var _nodes = require('./nodes');

var _lodash = require('lodash');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.sourceNodes = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(_ref2, _ref3) {
    var boundActionCreators = _ref2.boundActionCreators;
    var _ref3$apiURL = _ref3.apiURL,
        apiURL = _ref3$apiURL === undefined ? 'https://api.cosmicjs.com/v1' : _ref3$apiURL,
        _ref3$bucketSlug = _ref3.bucketSlug,
        bucketSlug = _ref3$bucketSlug === undefined ? '' : _ref3$bucketSlug,
        _ref3$objectTypes = _ref3.objectTypes,
        objectTypes = _ref3$objectTypes === undefined ? [] : _ref3$objectTypes,
        _ref3$apiAccess = _ref3.apiAccess,
        apiAccess = _ref3$apiAccess === undefined ? {} : _ref3$apiAccess,
        _ref3$hideMetafields = _ref3.hideMetafields,
        hideMetafields = _ref3$hideMetafields === undefined ? false : _ref3$hideMetafields;
    var createNode, defaultLimit, promises, data;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            createNode = boundActionCreators.createNode;
            defaultLimit = 1000;
            promises = objectTypes.map(function (objectType) {
              if (typeof objectType === 'string') {
                return (0, _fetch2.default)({
                  apiURL: apiURL,
                  bucketSlug: bucketSlug,
                  objectType: objectType,
                  limit: defaultLimit,
                  apiAccess: apiAccess,
                  hideMetafields: hideMetafields
                });
              } else if ((typeof objectType === 'undefined' ? 'undefined' : (0, _typeof3.default)(objectType)) === 'object') {
                return (0, _fetch2.default)({
                  apiURL: apiURL,
                  bucketSlug: bucketSlug,
                  objectType: objectType.objectType,
                  limit: objectType.limit,
                  apiAccess: apiAccess,
                  hideMetafields: hideMetafields
                });
              }
            });

            // Execute the promises.

            _context.next = 5;
            return _promise2.default.all(promises);

          case 5:
            data = _context.sent;


            // Create nodes.
            objectTypes.forEach(function (objectType, i) {
              var items = data[i];
              items.forEach(function (item) {
                var node = (0, _nodes.Node)((0, _lodash.capitalize)(objectType), item);
                createNode(node);
              });
            });

          case 7:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();