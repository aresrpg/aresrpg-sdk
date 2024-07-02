import { parse_sui_object } from '../cache.js'
import { parse_character } from '../parser.js'

/** @param {import("../../../types.js").Context} context */
export function get_character_by_id(context) {
  const { types, sui_client } = context
  return async id => {
    const character = parse_sui_object(
      { types },
      await sui_client.getObject({
        id,
        options: { showContent: true, showType: true, showDisplay: true },
      }),
    )
    if (!character) return
    return parse_character(context)(character)
  }
}
