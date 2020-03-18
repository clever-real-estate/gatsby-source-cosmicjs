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
  ////
  // Check for base case
  ////
  if (item.metafields === undefined || item.metafields === null) {
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


    if (metafield.type === 'repeater' && Array.isArray(metafield.repeater_fields) && Array.isArray(metafield.children)) {
      const repeaterKeys = metafield.repeater_fields.map(repeating_item => repeating_item.key);

      for (let i = 0; metafield.children.length > i; i += 1) {
        for (let keyIdx = 0; repeaterKeys.length > keyIdx; keyIdx += 1) {
          const subKey = repeaterKeys[keyIdx];
          item.metadata[metafield.key][i][subKey] = createMediaArray(item.metadata[metafield.key][i][subKey], {
            createContentDigest,
            createNode
          });
        }
      }
    }

    if (metafield.type === 'object' && metafield.object) {
      item.metadata[metafield.key] = createMediaArray(metafield.object, {
        createContentDigest,
        createNode
      });
    }

    if (metafield.type === 'objects' && metafield.objects && Array.isArray(metafield.objects)) {
      for (let i = 0; metafield.objects.length > i; i += 1) {
        ////
        // Recursive call for images of related objects
        // For us this is related blog post images.
        ////
        item.metadata[metafield.key][i] = createMediaArray(metafield.objects[i], {
          createContentDigest,
          createNode
        });
      }
    }
  });
  return item;
};

const deleteItemMetadata = item => {
  if (typeof item === 'object') {
    delete item.metafields;

    const keys = _.keys(item);

    for (let i = 0; keys.length > i; i += 1) {
      const key = keys[i];
      item[key] = deleteItemMetadata(item[key]);
    }
  } else if (Array.isArray(item)) {
    return _.map(item, sub => deleteItemMetadata(sub));
  }

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
  const cleanedItem = deleteItemMetadata(item);
  const node = processObject(typeSlug, cleanedItem, createContentDigest);
  createNode(node);
};