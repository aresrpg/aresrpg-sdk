import { iter } from 'iterator-helper'

import { parse_item, parse_sui_object } from '../parser.js'
import { enforce_ares_item } from '../supported_nfts.js'

/** @param {import("../../types.js").Context} context */
export function get_unlocked_items({ kiosk_client, types, sui_client }) {
  /** @type {(address: string) => Promise<import("../../types.js").SuiItem[]>} */
  return async address => {
    const { kioskOwnerCaps } = await kiosk_client.getOwnedKiosks({
      address,
    })

    // sequential to avoid huge node spam
    const result = await iter(kioskOwnerCaps)
      .toAsyncIterator()
      .map(async ({ kioskId, objectId, isPersonal }) => {
        return {
          kiosk_id: kioskId,
          is_kiosk_personal: isPersonal,
          personal_kiosk_cap_id: objectId,
          kiosk: await kiosk_client.getKiosk({
            id: kioskId,
            options: {
              withObjects: true,
              objectOptions: { showContent: true, showDisplay: true },
            },
          }),
        }
      })
      // in the mean time, we fetch the objects separately
      .map(
        ({
          kiosk_id,
          personal_kiosk_cap_id,
          is_kiosk_personal,
          kiosk: { items },
        }) => ({
          kiosk_id,
          personal_kiosk_cap_id,
          items,
          is_kiosk_personal,
        }),
      )
      .map(({ kiosk_id, personal_kiosk_cap_id, is_kiosk_personal, items }) => {
        return items
          .map(parse_sui_object)
          .map(item =>
            enforce_ares_item(
              {
                ...item,
                kiosk_id,
                is_kiosk_personal,
                personal_kiosk_cap_id,
              },
              types,
            ),
          )
          .filter(Boolean)
      })
      .toArray()

    // flatMap doesn't work in iterator-helper, so we double step

    return await iter(result.flat())
      .toAsyncIterator()
      .map(parse_item({ sui_client, types }))
      .toArray()
  }
}
