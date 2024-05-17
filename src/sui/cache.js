import { LRUCache } from 'lru-cache'

const DFIELD_CACHE = new LRUCache({ max: 10000, ttl: 1000 * 60 * 15 })
const OBJECT_CACHE = new LRUCache({ max: 1000, ttl: 1000 * 60 * 15 })

/** @return {Promise<import("@mysten/sui.js/client").SuiObjectResponse>} */
export async function get_dynamic_field_object(sui_client, params) {
  const key = JSON.stringify(params)
  const cached = DFIELD_CACHE.get(key)
  if (cached) return cached

  const result = await sui_client.getDynamicFieldObject(params)
  DFIELD_CACHE.set(key, result)

  return result
}

/** @return {Promise<import("@mysten/sui.js/client").SuiObjectResponse>} */
export async function get_object(sui_client, params) {
  const key = JSON.stringify(params)
  const cached = OBJECT_CACHE.get(key)
  if (cached) return cached

  const result = await sui_client.getObject(params)
  OBJECT_CACHE.set(key, result)

  return result
}
