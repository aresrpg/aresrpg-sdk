import { LRUCache } from 'lru-cache'

const cache = new LRUCache({ max: 1000 })

async function get_caps({
  address,
  cursor = null,
  results = [],
  kiosk_client,
}) {
  const { kioskOwnerCaps, hasNextPage, nextCursor } =
    await kiosk_client.getOwnedKiosks({ address, pagination: { cursor } })

  results.push(...kioskOwnerCaps)

  if (hasNextPage)
    return get_caps({ address, cursor: nextCursor, results, kiosk_client })

  return results
}

/** @param {import("../../../types.js").Context} context */
export function get_kiosk_owner_cap({ kiosk_client }) {
  return async ({ address, kiosk_id }) => {
    const cached = cache.get(kiosk_id)
    // @ts-ignore
    if (cached) return cached.objectId

    const kiosks = await get_caps({ address, kiosk_client })

    const kiosk = kiosks.find(({ kioskId }) => kioskId === kiosk_id)

    if (!kiosk) return

    cache.set(kiosk_id, kiosk)

    return {
      id: kiosk.objectId,
      personal: kiosk.isPersonal,
    }
  }
}
