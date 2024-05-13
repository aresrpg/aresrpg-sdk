export async function read_object_bag({
  sui_client,
  bag_id,
  content = [],
  cursor = undefined,
}) {
  const { data, hasNextPage, nextCursor } = await sui_client.getDynamicFields({
    parentId: bag_id,
    ...(cursor && { cursor }),
  })

  const objects = await Promise.all(
    data.map(({ name }) =>
      sui_client.getDynamicFieldObject({
        parentId: bag_id,
        name,
      }),
    ),
  )

  const result = [...content, ...objects]

  if (hasNextPage)
    return read_object_bag({
      sui_client,
      bag_id,
      content: result,
      cursor: nextCursor,
    })

  return result
}
