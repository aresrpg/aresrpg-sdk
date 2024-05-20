import { read_object_bag } from '../read_object_bag.js'
import { parse_item, parse_sui_object } from '../parser.js'
import { enforce_ares_item } from '../supported_nfts.js'
import { get_dynamic_field_object } from '../cache.js'

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

          return Promise.all(
            items
              .flat()
              .map(parse_sui_object)
              .map(async item =>
                enforce_ares_item(context, {
                  ...item,
                  kiosk_id,
                  personal_kiosk_cap_id,
                  storage_id,
                }),
              ),
          )
            .then(result => result.filter(Boolean))
            .then(result => result.map(parse_item({ types, sui_client })))
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
