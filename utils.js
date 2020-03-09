"use strict";

const _ = require('lodash');

var md5 = require('md5');

const {
  processObject
} = require('./normalize');

const generateTypeSlug = slug => {
  let typeSlug = _.camelCase(slug);

  typeSlug = typeSlug.charAt(0).toUpperCase() + typeSlug.slice(1);
  return typeSlug;
};

const createMediaArray = (item, {
  createContentDigest,
  createNode
}) => {
  if (item.metafields === undefined) {
    return item;
  }

  item.metafields.forEach(metafield => {
    if (metafield.type === 'file' && metafield.url && metafield.url.startsWith('https://cdn.cosmicjs.com')) {
      const {
        value,
        url,
        imgix_url,
        key
      } = metafield;
      const id = md5(metafield.value);
      let media = {
        _id: id,
        value,
        url,
        imgix_url
      };
      const node = processObject('LocalMedia', media, createContentDigest);
      createNode(node);
      item.metadata[`${key}___NODE`] = id;
      delete item.metadata[key];
    } ////
    // TODO: You could also do this for Parent & Repeater types
    ////


    if (metafield.type === 'object') {
      item.metadata[metafield.key] = createMediaArray(metafield.object, {
        createContentDigest,
        createNode
      });
    }

    if (metafield.type === 'objects') {
      for (let i = 0; metafield.objects.length > i; i += 1) {
        item.metadata[metafield.key][i] = createMediaArray(metafield.objects[i], {
          createContentDigest,
          createNode
        });
      }
    }
  });
  return item;
};

exports.createNodeHelper = (item, helperObject) => {
  const {
    createContentDigest,
    createNode,
    localMedia
  } = helperObject;

  if (localMedia) {
    item = createMediaArray(item, helperObject);
  }

  let typeSlug = generateTypeSlug(item.type_slug);
  const node = processObject(typeSlug, item, createContentDigest);
  createNode(node);
};