import { read_object_bag } from '../read_object_bag.js'
import { get_dynamic_field_object, get_items } from '../cache.js'

/** @param {import("../../types.js").Context} context */
export function get_locked_items(context) {
  const { kiosk_client, types, sui_client } = context
  /** @type {(address: string) => Promise<import("../../types.js").SuiItem[]>} */
  return async address => {
    const { kioskOwnerCaps } = await kiosk_client.getOwnedKiosks({
      address,
    })

    const personal_kiosks = kioskOwnerCaps.filter(
      ({ isPersonal }) => !!isPersonal,
    )

    const all_items = await Promise.all(
      personal_kiosks.map(async ({ kioskId, objectId }) => {
        // find the AresRPG extension for the kiosk
        try {
          const extension = await kiosk_client.getKioskExtension({
            kioskId,
            type: `${types.PACKAGE_ID}::extension::AresRPG`,
          })

          // in case extension is not found, filter out
          if (!extension) return null

          const storage_id = extension.storageId
          const kiosk_id = kioskId
          const personal_kiosk_cap_id = objectId

          // retrieve the ObjectBag<String, Character>
          const { data } = await get_dynamic_field_object(sui_client, {
            parentId: storage_id,
            name: {
              type: `${types.PACKAGE_ID}::extension::StorageKey<${types.PACKAGE_ID}::item::Item>`,
              value: {
                dummy_field: false,
              },
            },
          })

          if (!data?.content) return null

          const items = await read_object_bag({
            sui_client,
            // @ts-ignore
            bag_id: data.content.fields.value.fields.id.id,
          })
          const ids = items.flat().map(({ data: { objectId } }) => objectId)

          const parsed_items = await get_items(context, ids)
          return [...parsed_items.values()].map(item => ({
            ...item,
            kiosk_id,
            personal_kiosk_cap_id,
          }))
        } catch (error) {
          console.error('getKioskExtension error', error.message)
          return null
        }
      }),
    )

    const result = await Promise.all(all_items.flat())

    return result.filter(Boolean)
  }
}
