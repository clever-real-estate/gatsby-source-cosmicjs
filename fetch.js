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
        limit = _ref2.limit,
        depth = _ref2.depth,
        getIDs = _ref2.getIDs,
        apiAccess = _ref2.apiAccess,
        hideMetafields = _ref2.hideMetafields,
        isDevelopment = _ref2.isDevelopment,
        logging = _ref2.logging;

    var timeLabel, objects, skip, apiEndpoint, options, documents, additionalCallsRequired, response, i, skipEndpoint, _response;

    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            timeLabel = 'Fetch Cosmic JS data for (' + objectType + ')';

            console.time(timeLabel);
            console.log('Starting to fetch data from Cosmic JS (' + objectType + ') Limit: ' + limit + ' Depth: ' + depth + ' Filter: ' + (getIDs ? getIDs : 'none'));
            objects = [];
            skip = 0;
            // Define API endpoint.

            apiEndpoint = apiURL + '/' + bucketSlug + '/objects?type=' + objectType;


            if (apiAccess.hasOwnProperty('read_key') && apiAccess.read_key.length !== 0) {
              apiEndpoint = apiEndpoint + ('&read_key=' + apiAccess.read_key);
              apiEndpoint = apiEndpoint + ('&limit=' + limit);
              // TODO: current bug on hide metafields
              if (hideMetafields) {
                apiEndpoint = apiEndpoint + ('&hide_metafields=' + hideMetafields);
              }
              apiEndpoint = apiEndpoint + ('&depth=' + depth);

              if (getIDs !== null && Array.isArray(getIDs)) {
                apiEndpoint = apiEndpoint + ('&filters[_id]=' + getIDs.join(','));
              } else if (getIDs !== null && typeof getIDs === 'string') {
                apiEndpoint = apiEndpoint + ('&filters[_id]=' + getIDs);
              }
            }
            if (logging) {
              console.log(apiEndpoint);
            }
            options = {
              headers: { 'Accept-Encoding': 'gzip,deflate' }
              // Make initial API request.
            };
            _context.next = 11;
            return (0, _axios2.default)(apiEndpoint, options);

          case 11:
            documents = _context.sent;

            if (!(documents.data.objects === undefined)) {
              _context.next = 16;
              break;
            }

            console.error(objectType + ' error: ' + documents.message + ' limit: ' + limit);
            console.timeEnd(timeLabel);
            return _context.abrupt('return', objects);

          case 16:

            if (documents.data.objects) {
              objects = documents.data.objects;
            }

            // check if there's more that request limit of objects for object type

            if (!(documents.data.total && documents.data.total > limit)) {
              _context.next = 42;
              break;
            }

            // Query all data from endpoint
            // calculate number of calls to retrieve entire object type
            additionalCallsRequired = Math.ceil(documents.data.total / limit) - 1;

            if (!isDevelopment) {
              _context.next = 26;
              break;
            }

            _context.next = 22;
            return (0, _axios2.default)(apiEndpoint, options);

          case 22:
            response = _context.sent;

            if (response.data.objects) {
              objects = (0, _lodash.concat)(objects, response.data.objects);
            } else {
              console.error(objectType + ' fetch issue: ' + documents.message);
            }
            _context.next = 42;
            break;

          case 26:
            i = 0;

          case 27:
            if (!(i < additionalCallsRequired)) {
              _context.next = 42;
              break;
            }

            // skip previously requested objects
            skip = skip + limit;
            skipEndpoint = apiEndpoint + ('&skip=' + skip);
            // Query next batch from endpoint

            _context.next = 32;
            return (0, _axios2.default)(skipEndpoint, options);

          case 32:
            _response = _context.sent;

            if (!_response.data.objects) {
              _context.next = 37;
              break;
            }

            objects = (0, _lodash.concat)(objects, _response.data.objects);
            _context.next = 39;
            break;

          case 37:
            console.error(objectType + ' fetch issue: ' + documents.message);
            return _context.abrupt('break', 42);

          case 39:
            i += 1;
            _context.next = 27;
            break;

          case 42:

            console.log('Fetched ' + objects.length + ' ' + (objects.length === 1 ? 'object' : 'objects') + ' for object type: ' + objectType);
            console.timeEnd(timeLabel);

            // Map and clean data.
            if (objects.length > 0) {
              objects = objects.map(function (item) {
                return clean(item);
              });
            }

            return _context.abrupt('return', objects);

          case 46:
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
    if (key.length < 1 || key.match(/^[_a-zA-Z][_a-zA-Z0-9]*$/g)) {
      console.log('COSMIC KEY ERROR');
      console.log(item.slug);
      console.log(item._id);
    }
  });

  return item;
};