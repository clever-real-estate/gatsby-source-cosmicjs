"use strict";

var md5 = require('md5');

exports.createGatsbyImageResolver = ({
  actions,
  cache,
  createNodeId,
  createResolvers,
  getNode,
  store,
  reporter
}, {
  localMedia = false
}) => {
  if (localMedia) {
    const {
      createRemoteFileNode
    } = require(`gatsby-source-filesystem`);

    const {
      createNode,
      touchNode
    } = actions; // Add all media libary images so they can be queried by Gatsby Image

    createResolvers({
      CosmicjsLocalMedia: {
        transformedImage: {
          type: `File`,

          async resolve(source, _args, _context, _info) {
            if (source.url) {
              let fileNodeID;
              let fileNode;
              const checksum = md5(source.value); // Set the file cacheID, get it (if it has already been set)

              const mediaDataCacheKey = `cosmicjs-media-${checksum}`;
              const cacheMediaData = await cache.get(mediaDataCacheKey); // If we have cached media data and it wasn't modified, reuse

              if (cacheMediaData && checksum === cacheMediaData.checksum) {
                fileNode = getNode(cacheMediaData.fileNodeID); // check if node still exists in cache

                if (fileNode) {
                  fileNodeID = cacheMediaData.fileNodeID;
                  touchNode({
                    nodeId: fileNodeID
                  });
                }
              }

              const BLOG_DEFAULT_IMAGE_URL = 'https://cdn.cosmicjs.com/a47dd4c0-d3fc-11e9-a59e-bf2282b4da3a-cleverplaceholder.jpg'; // If we don't have cached data, download the file

              if (!fileNodeID) {
                try {
                  // Get the filenode
                  fileNode = await createRemoteFileNode({
                    url: source.url ? source.url : BLOG_DEFAULT_IMAGE_URL,
                    store,
                    cache,
                    createNode,
                    createNodeId,
                    reporter
                  });

                  if (fileNode) {
                    fileNodeID = fileNode.id;
                    await cache.set(mediaDataCacheKey, {
                      fileNodeID,
                      checksum: checksum
                    });
                  }
                } catch (e) {
                  // Ignore
                  console.log(e);
                  return null;
                }
              }

              if (fileNode) {
                return fileNode;
              }
            }

            return null;
          }

        }
      }
    });
  }
};