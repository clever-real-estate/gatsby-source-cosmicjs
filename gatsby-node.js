'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

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
        hideMetafields = _ref3$hideMetafields === undefined ? true : _ref3$hideMetafields,
        _ref3$isDevelopment = _ref3.isDevelopment,
        isDevelopment = _ref3$isDevelopment === undefined ? false : _ref3$isDevelopment,
        _ref3$logging = _ref3.logging,
        logging = _ref3$logging === undefined ? false : _ref3$logging;
    var createNode, limit, depth, promises, data;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            createNode = boundActionCreators.createNode;
            limit = 1000;
            depth = 3;
            promises = objectTypes.map(function (objectType) {
              return (0, _fetch2.default)({
                apiURL: apiURL,
                bucketSlug: bucketSlug,
                objectType: objectType.objectType ? objectType.objectType : objectType,
                limit: objectType.limit ? objectType.limit : limit,
                depth: objectType.depth ? objectType.depth : depth,
                getIDs: objectType.getIDs ? objectType.getIDs : null,
                apiAccess: apiAccess,
                hideMetafields: objectType.hideMetafields !== undefined ? objectType.hideMetafields : hideMetafields,
                isDevelopment: isDevelopment,
                logging: logging
              });
            });

            // Execute the promises.

            _context.next = 6;
            return _promise2.default.all(promises);

          case 6:
            data = _context.sent;


            // Create nodes.
            objectTypes.forEach(function (objectType, i) {
              var items = data[i];
              items.forEach(function (item) {
                var title = objectType.objectType ? objectType.objectType : objectType;
                var node = (0, _nodes.Node)((0, _lodash.capitalize)(title), item);
                createNode(node);
              });
            });

          case 8:
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