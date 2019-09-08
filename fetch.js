'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _lodash = require('lodash');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(_ref2) {
    var apiURL = _ref2.apiURL,
        bucketSlug = _ref2.bucketSlug,
        objectType = _ref2.objectType,
        apiAccess = _ref2.apiAccess,
        hideMetafields = _ref2.hideMetafields,
        isDevelopment = _ref2.isDevelopment;

    var timeLabel, objects, limit, skip, apiEndpoint, documents, additionalCallsRequired, response, i, skipEndpoint, _response;

    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            timeLabel = 'Fetch Cosmic JS data for (' + objectType + ')';

            console.time(timeLabel);
            console.log('Starting to fetch data from Cosmic JS (' + objectType + ')');
            objects = [];
            limit = 1000;
            skip = 0;
            // Define API endpoint.

            apiEndpoint = apiURL + '/' + bucketSlug + '/objects?type=' + objectType;


            if (apiAccess.hasOwnProperty('read_key') && apiAccess.read_key.length !== 0) {
              apiEndpoint = apiEndpoint + ('&read_key=' + apiAccess.read_key);
              apiEndpoint = apiEndpoint + ('&limit=' + limit);
              apiEndpoint = apiEndpoint + ('&hide_metafields=' + hideMetafields);
            }

            // Make initial API request.
            _context.next = 10;
            return (0, _axios2.default)(apiEndpoint);

          case 10:
            documents = _context.sent;

            if (!(documents.data.objects === undefined)) {
              _context.next = 15;
              break;
            }

            console.error(objectType + ' error: ' + documents.message);
            console.timeEnd(timeLabel);
            return _context.abrupt('return', objects);

          case 15:

            if (documents.data.objects) {
              objects = documents.data.objects;
            }

            // check if there's more that request limit of objects for object type

            if (!(documents.data.total && documents.data.total > limit)) {
              _context.next = 41;
              break;
            }

            // Query all data from endpoint
            // calculate number of calls to retrieve entire object type
            additionalCallsRequired = Math.ceil(documents.data.total / limit) - 1;

            if (!isDevelopment) {
              _context.next = 25;
              break;
            }

            _context.next = 21;
            return (0, _axios2.default)(apiEndpoint);

          case 21:
            response = _context.sent;

            if (response.data.objects) {
              objects = (0, _lodash.concat)(objects, response.data.objects);
            } else {
              console.error(objectType + ' fetch issue: ' + documents.message);
            }
            _context.next = 41;
            break;

          case 25:
            i = 0;

          case 26:
            if (!(i < additionalCallsRequired)) {
              _context.next = 41;
              break;
            }

            // skip previously requested objects
            skip = skip + limit;
            skipEndpoint = apiEndpoint + ('&skip=' + skip);
            // Query next batch from endpoint

            _context.next = 31;
            return (0, _axios2.default)(skipEndpoint);

          case 31:
            _response = _context.sent;

            if (!_response.data.objects) {
              _context.next = 36;
              break;
            }

            objects = (0, _lodash.concat)(objects, _response.data.objects);
            _context.next = 38;
            break;

          case 36:
            console.error(objectType + ' fetch issue: ' + documents.message);
            return _context.abrupt('break', 41);

          case 38:
            i += 1;
            _context.next = 26;
            break;

          case 41:

            console.log('Fetched ' + objects.length + ' ' + (objects.length === 1 ? 'object' : 'objects') + ' for object type: ' + objectType);
            console.timeEnd(timeLabel);

            // Map and clean data.
            if (objects.length > 0) {
              objects = objects.map(function (item) {
                return clean(item);
              });
            }

            return _context.abrupt('return', objects);

          case 45:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}();

/**
 * Remove fields starting with `_` symbol.
 *
 * @param {object} item - Entry needing clean
 * @returns {object} output - Object cleaned
 */
var clean = function clean(item) {
  (0, _lodash.forEach)(item, function (value, key) {
    if ((0, _lodash.startsWith)(key, '__')) {
      delete item[key];
    } else if ((0, _lodash.isObject)(value)) {
      item[key] = clean(value);
    }
  });

  return item;
};