import { parse_sui_object } from '../cache.js'

/** @param {import("../../../types.js").Context} context */
export function get_pet_feed_value({ sui_client, types }) {
  return async pet_id => {
    const result = await sui_client.getDynamicFieldObject({
      parentId: pet_id,
      name: {
        type: `${types.PACKAGE_ID}::item_feed::FeedKey`,
        value: {
          dummy_field: false,
        },
      },
    })

    if (!result.data) return { last_feed: 0, stomach: 0 }

    // @ts-ignore
    const { last_feed = 0, stomach = 0 } = parse_sui_object({ types }, result)
    return { last_feed, stomach }
  }
}
