"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.Node = void 0;

var _gatsbyNodeHelpers = _interopRequireDefault(require("gatsby-node-helpers"));

const {
  createNodeFactory
} = (0, _gatsbyNodeHelpers.default)({
  typePrefix: 'Cosmicjs'
});
/**
 * Node factory with `type` option based on
 * original `createNodeFactory`.
 *
 * @param {string} type - Node type
 * @param {object} node - Node
 * @constructor
 */

const Node = (type, node) => createNodeFactory(type, node => {
  node.id = node._id;
  delete node._id;
  return node;
})(node);

exports.Node = Node;