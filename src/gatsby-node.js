import fetchData from './fetch'
import { Node } from './nodes'
import { capitalize } from 'lodash'

exports.sourceNodes = async (
  { boundActionCreators },
  {
    apiURL = 'https://api.cosmicjs.com/v1',
    bucketSlug = '',
    objectTypes = [],
    apiAccess = {},
    hideMetafields = true,
    isDevelopment = false,
    logging = false,
  }
) => {
  const { createNode } = boundActionCreators
  let limit = 1000
  let depth = 3
  const promises = objectTypes.map(objectType => {
    return fetchData({
      apiURL,
      bucketSlug,
      objectType: objectType.objectType ? objectType.objectType : objectType,
      limit: objectType.limit ? objectType.limit : limit,
      depth: objectType.depth ? objectType.depth : depth,
      getIDs: objectType.getIDs ? objectType.getIDs : null,
      apiAccess,
      hideMetafields:
        objectType.hideMetafields !== undefined
          ? objectType.hideMetafields
          : hideMetafields,
      isDevelopment,
      logging,
    })
  })

  // Execute the promises.
  const data = await Promise.all(promises)

  // Create nodes.
  objectTypes.forEach((objectType, i) => {
    var items = data[i]
    items.forEach(item => {
      let title = objectType.objectType ? objectType.objectType : objectType
      const node = Node(capitalize(title), item)
      createNode(node)
    })
  })
}
