import { parse_sui_object } from '../cache.js'
import { parse_character } from '../parser.js'

/** @param {import("../../../types.js").Context} context */
export function get_character_by_id({ sui_client, types }) {
  return async id => {
    const character = parse_sui_object(
      { types },
      await sui_client.getObject({
        id,
        options: { showContent: true, showType: true, showDisplay: true },
      }),
    )
    if (!character) return
    if (character._type !== `${types.PACKAGE_ID}::character::Character`)
      throw new Error(`INVALID_CONTRACT`)
    return parse_character({ sui_client, types })(character)
  }
}
