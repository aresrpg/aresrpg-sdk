import { parse_item, parse_sui_object } from '../parser.js'
import { enforce_ares_item } from '../supported_nfts.js'

/** @param {import("../../types.js").Context} context */
export function get_unlocked_items(context) {
  const { kiosk_client, types, sui_client } = context
  /** @type {(address: string) => Promise<import("../../types.js").SuiItem[]>} */
  return async address => {
    const { kioskOwnerCaps } = await kiosk_client.getOwnedKiosks({
      address,
    })

    // sequential to avoid huge node spam
    const result = await Promise.all(
      kioskOwnerCaps.map(async ({ kioskId, objectId, isPersonal }) => {
        const kiosk_id = kioskId
        const personal_kiosk_cap_id = objectId
        const is_kiosk_personal = isPersonal
        const { items } = await kiosk_client.getKiosk({
          id: kioskId,
          options: {
            withObjects: true,
            objectOptions: { showContent: true, showDisplay: true },
          },
        })
        return Promise.all(
          items.map(parse_sui_object).map(async item =>
            enforce_ares_item(context, {
              ...item,
              kiosk_id,
              is_kiosk_personal,
              personal_kiosk_cap_id,
            }),
          ),
        )
          .then(result => result.filter(Boolean))
          .then(result => result.map(parse_item({ types, sui_client })))
      }),
    )

    const items = await Promise.all(result.flat())
    return items.filter(Boolean)
  }
}
