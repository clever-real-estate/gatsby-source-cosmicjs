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
    hideMetafields = false,
    isDevelopment = false,
  }
) => {
  const { createNode } = boundActionCreators
  let limit = 1000
  let depth = 3
  const promises = objectTypes.map(objectType => {
    if (typeof objectType === 'string') {
      return fetchData({
        apiURL,
        bucketSlug,
        objectType,
        limit,
        depth,
        apiAccess,
        hideMetafields,
        isDevelopment,
      })
    } else if (typeof objectType === 'object') {

      return fetchData({
        apiURL,
        bucketSlug,
        objectType: objectType.objectType,
        limit: objectType.limit ? objectType.limit : limit,
        depth: objectType.depth ? objectType.depth : depth,
        apiAccess,
        hideMetafields,
        isDevelopment,
      })
    }
  })

  // Execute the promises.
  const data = await Promise.all(promises)

  // Create nodes.
  objectTypes.forEach((objectType, i) => {
    var items = data[i]
    items.forEach(item => {
      const node = Node(capitalize(objectType), item)
      createNode(node)
    })
  })
}
