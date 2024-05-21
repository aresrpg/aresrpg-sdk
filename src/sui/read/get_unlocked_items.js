import { get_items } from '../cache.js'

/** @param {import("../../types.js").Context} context */
export function get_unlocked_items(context) {
  const { kiosk_client } = context
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
            withObjects: false,
          },
        })

        return items
          .filter(({ listing }) => !listing)
          .map(({ objectId }) => ({
            id: objectId,
            kiosk_id,
            personal_kiosk_cap_id,
            is_kiosk_personal,
          }))
      }),
    )

    const objects = result.flat()
    const items = await get_items(
      context,
      objects.map(({ id }) => id),
    )

    return objects
      .map(item => {
        const { id, ...rest } = item
        const parsed = items.get(id)
        if (!parsed) return null

        return {
          id,
          ...parsed,
          ...rest,
        }
      })
      .filter(Boolean)
  }
}
