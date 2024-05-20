import { parse_item, parse_sui_object } from '../parser.js'
import { enforce_ares_item } from '../supported_nfts.js'
import { get_object } from '../cache.js'

/** @param {import("../../types.js").Context} context */
export function get_item_by_id(context) {
  const { types, sui_client } = context

  /** @type {(id: string) => Promise<import("../../types.js").SuiItem>} */
  return async id => {
    const item = await get_object(sui_client, {
      id,
      options: { showContent: true, showDisplay: true },
    })

    const ares_item = await enforce_ares_item(context, parse_sui_object(item))

    return parse_item({ sui_client, types })(ares_item)
  }
}
