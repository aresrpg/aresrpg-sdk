import { parse_sui_object } from '../cache.js'
import { parse_character } from '../parser.js'

/** @param {import("../../../types.js").Context} context */
export function get_locked_characters_by_ids({ sui_client, types }) {
  /** @type {(ids: string[]) => Promise<Map<string, import("../../../types.js").SuiCharacter>>} */
  return async ids => {
    const objects = await sui_client.multiGetObjects({
      ids,
      options: { showContent: true, showType: true },
    })

    const characters = await Promise.all(
      objects
        // filter out the objects that are not found (maybe deleted)
        .filter(({ error }) => !error)
        .map(object => parse_sui_object({ types })(object))
        // filter out the characters that are not selected
        .filter(({ selected }) => !!selected)
        .map(object => parse_character({ sui_client, types })(object)),
    )

    return new Map(
      characters
        .filter(
          character =>
            character._type === `${types.PACKAGE_ID}::character::Character`,
        )
        .map(character => [character.id, character]),
    )
  }
}
