import { parse_sui_object } from '../cache.js'

/** @param {import("../../../types.js").Context} context */
export function get_finished_crafts({ sui_client, types }) {
  return async owner => {
    const { data } = await sui_client.getOwnedObjects({
      owner,
      filter: {
        StructType: `${types.PACKAGE_ID}::item_recipe::FinishedCraft`,
      },
      options: { showContent: true },
    })

    return data.map(object => parse_sui_object({ types }, object))
  }
}
