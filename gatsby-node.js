"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _fetch = _interopRequireDefault(require("./fetch"));

var _nodes = require("./nodes");

var _lodash = require("lodash");

var _utils = require("./utils");

var _gatsbyImageResolver = require("./gatsby-image-resolver");

exports.sourceNodes = async ({
  actions,
  webhookBody,
  createContentDigest,
  getNode
}, {
  apiURL = 'https://api.cosmicjs.com/v1',
  bucketSlug = '',
  objectTypes = [],
  apiAccess = {},
  hideMetafields = true,
  isDevelopment = false,
  logging = false
}) => {
  const {
    createNode,
    deleteNode
  } = actions;
  const helperObject = {
    createContentDigest,
    createNode,
    localMedia
  };
  let limit = 1000;
  let depth = 3;
  const promises = objectTypes.map(objectType => {
    return (0, _fetch.default)({
      apiURL,
      bucketSlug,
      objectType: objectType.objectType ? objectType.objectType : objectType,
      limit: objectType.limit ? objectType.limit : limit,
      depth: objectType.depth ? objectType.depth : depth,
      getIDs: objectType.getIDs ? objectType.getIDs : null,
      apiAccess,
      hideMetafields: objectType.hideMetafields !== undefined ? objectType.hideMetafields : hideMetafields,
      isDevelopment,
      logging
    });
  }); // Execute the promises.

  const data = await Promise.all(promises); // Create nodes.

  objectTypes.forEach((objectType, i) => {
    var items = data[i];
    items.forEach(item => {
      let title = objectType.objectType ? objectType.objectType : objectType;
      const node = (0, _nodes.Node)((0, _lodash.capitalize)(title), item);
      (0, _utils.createNodeHelper)(node, helperObject); // createNode(node)
    });
  });
};

exports.createResolvers = _gatsbyImageResolver.createGatsbyImageResolver;