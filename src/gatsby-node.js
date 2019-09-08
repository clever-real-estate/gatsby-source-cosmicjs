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
  }
) => {
  const { createNode } = boundActionCreators
  const defaultLimit = 1000;
  
  const promises = objectTypes.map(objectType => {
    if (typeof objectType === 'string') {
      return fetchData({
        apiURL,
        bucketSlug,
        objectType,
        limit: defaultLimit,
        apiAccess,
        hideMetafields,
      })
    } else if(typeof objectType === 'object') {
      return fetchData({
        apiURL,
        bucketSlug,
        objectType: objectType.objectType,
        limit: objectType.limit,
        apiAccess,
        hideMetafields,
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
