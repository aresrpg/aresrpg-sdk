import { iter } from 'iterator-helper'

import { parse_character, parse_sui_object } from '../parser.js'

/** @param {import("../../types.js").Context} context */
export function get_unlocked_characters({ kiosk_client, types, sui_client }) {
  /** @type {(address: string) => Promise<import("../../types.js").SuiCharacter[]>} */
  return async address => {
    const { kioskOwnerCaps } = await kiosk_client.getOwnedKiosks({
      address,
    })

    const personal_kiosks = kioskOwnerCaps.filter(
      ({ isPersonal }) => !!isPersonal,
    )

    // sequential to avoid huge node spam
    const result = await iter(personal_kiosks)
      .toAsyncIterator()
      .map(async ({ kioskId, objectId }) => {
        return {
          kiosk_id: kioskId,
          personal_kiosk_cap_id: objectId,
          kiosk: await kiosk_client.getKiosk({
            id: kioskId,
            options: {
              withObjects: true,
              objectOptions: { showContent: true },
            },
          }),
        }
      })
      // in the mean time, we fetch the objects separately
      .map(({ kiosk_id, personal_kiosk_cap_id, kiosk: { items } }) => ({
        kiosk_id,
        personal_kiosk_cap_id,
        characters: items,
      }))
      .map(({ kiosk_id, personal_kiosk_cap_id, characters }) => {
        return characters
          .map(parse_sui_object)
          .filter(
            // @ts-ignore
            ({ _type }) =>
              _type === `${types.PACKAGE_ID}::character::Character`,
          )
          .map(character => ({
            ...character,
            kiosk_id,
            personal_kiosk_cap_id,
          }))
      })
      .toArray()

    // flatMap doesn't work in iterator-helper, so we double step

    return await iter(result.flat())
      .toAsyncIterator()
      .map(parse_character({ sui_client, types }))
      .toArray()
  }
}
