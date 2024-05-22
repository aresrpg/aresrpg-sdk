import { get_items } from '../cache.js'

/** @param {import("../../../types.js").Context} context */
export function get_item_by_id(context) {
  /** @type {(id: string) => Promise<import("../../../types.js").SuiItem>} */
  return async id => {
    const items = await get_items(context, [id])
    return items.get(id)
  }
}
