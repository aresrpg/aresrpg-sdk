import { parse_sui_object } from '../cache.js'
import { parse_character } from '../parser.js'

/** @param {import("../../../types.js").Context} context */
export function get_unlocked_characters({ kiosk_client, types, sui_client }) {
  /** @type {(address: string) => Promise<import("../../../types.js").SuiCharacter[]>} */
  return async address => {
    const { kioskOwnerCaps } = await kiosk_client.getOwnedKiosks({
      address,
    })

    const personal_kiosks = kioskOwnerCaps.filter(
      ({ isPersonal }) => !!isPersonal,
    )

    // sequential to avoid huge node spam
    const result = await Promise.all(
      personal_kiosks.map(async ({ kioskId, objectId }) => {
        const kiosk_id = kioskId
        const personal_kiosk_cap_id = objectId
        // in the mean time, we fetch the objects separately
        const { items: characters } = await kiosk_client.getKiosk({
          id: kioskId,
          options: {
            withObjects: false,
          },
        })

        const all_characters = await sui_client.multiGetObjects({
          ids: characters
            .filter(
              // @ts-ignore
              ({ type }) =>
                type === `${types.PACKAGE_ID}::character::Character`,
            )
            .filter(({ listing }) => !listing)
            .map(({ objectId }) => objectId),
          options: { showContent: true, showDisplay: true },
        })

        return all_characters
          .map(object => parse_sui_object({ types }, object))
          .map(character => ({
            ...character,
            kiosk_id,
            personal_kiosk_cap_id,
          }))
          .map(parse_character({ sui_client, types }))
      }),
    )

    const characters = await Promise.all(result.flat())

    return characters.filter(Boolean)
  }
}
