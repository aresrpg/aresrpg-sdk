import { parse_character, parse_sui_object } from '../parser.js'

/** @param {import("../../types.js").Context} context */
export function get_character_by_id({ sui_client, types }) {
  return async id => {
    const character = parse_sui_object(
      await sui_client.getObject({
        id,
        options: { showContent: true, showType: true },
      }),
    )
    if (character._type !== `${types.PACKAGE_ID}::character::Character`)
      throw new Error(`INVALID_CONTRACT`)
    return parse_character({ sui_client, types })(character)
  }
}