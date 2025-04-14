
// export default function getAllPageIds (collectionQuery, collectionId, collectionView, viewIds) {
//   if (!collectionQuery && !collectionView) {
//     return []
//   }
//   // 优先按照第一个视图排序
//   let pageIds = []
//   try {
//     if (viewIds && viewIds.length > 0) {
//       const ids = collectionQuery[collectionId][viewIds[0]]?.collection_group_results?.blockIds
//       for (const id of ids) {
//         pageIds.push(id)
//       }
//     }
//   } catch (error) {
//     console.error('Error fetching page IDs:', error);
//     return [];
//   }

//   // 否则按照数据库原始排序
//   if (pageIds.length === 0 && collectionQuery && Object.values(collectionQuery).length > 0) {
//     const pageSet = new Set()
//     Object.values(collectionQuery[collectionId]).forEach(view => {
//       view?.blockIds?.forEach(id => pageSet.add(id)) // group视图
//       view?.collection_group_results?.blockIds?.forEach(id => pageSet.add(id)) // table视图
//     })
//     pageIds = [...pageSet]
//     // console.log('PageIds: 从collectionQuery获取', collectionQuery, pageIds.length)
//   }
//   return pageIds
// }

export default function getAllPageIds(collectionQuery, collectionId, collectionView, viewIds) {
  // 🧪 DEBUG: 打印输入参数状态
  console.log('[DEBUG] collectionQuery:', !!collectionQuery)
  console.log('[DEBUG] collectionId:', collectionId)
  console.log('[DEBUG] collectionView:', !!collectionView)
  console.log('[DEBUG] viewIds:', viewIds?.length)

  if (!collectionQuery && !viewIds) {
    return []
  }

  // 优先按照第一个视图排序
  let pageIds = []
  try {
    if (viewIds && viewIds.length > 0) {
      const ids = collectionQuery[collectionId][viewIds[0]]?.collection_group_results?.blockIds
      for (const id of ids) {
        pageIds.push(id)
      }
    }
  } catch (error) {
    console.error('Error fetching page IDs:', error)
    return []
  }

  // 若没有按照视图提取成功，则提取所有
  if (pageIds.length === 0 && collectionQuery && Object.values(collectionQuery).length > 0) {
    const pageSet = new Set()
    Object.values(collectionQuery[collectionId]).forEach(view => {
      view?.blockIds?.forEach(id => pageSet.add(id)) // group视图
      view?.collection_group_results?.blockIds?.forEach(id => pageSet.add(id)) // table视图
    })
    pageIds = [...pageSet]
  }

  // 🧪 DEBUG: 打印获取结果
  console.log('[DEBUG] getAllPageIds: total pages fetched =', pageIds.length)
  console.log('[DEBUG] Sample page IDs:', pageIds.slice(0, 5))  // 只打印前5个防止爆炸

  return pageIds
}

