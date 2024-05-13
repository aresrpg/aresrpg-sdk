import { iter } from 'iterator-helper'

import { read_object_bag } from '../read_object_bag.js'
import { parse_item, parse_sui_object } from '../parser.js'

/** @param {import("../../types.js").Context} context */
export function get_locked_items({ kiosk_client, types, sui_client }) {
  /** @type {(address: string) => Promise<import("../../types.js").SuiItem[]>} */
  return async address => {
    const { kioskOwnerCaps } = await kiosk_client.getOwnedKiosks({
      address,
    })

    const personal_kiosks = kioskOwnerCaps.filter(
      ({ isPersonal }) => !!isPersonal,
    )

    const all_items = await iter(personal_kiosks)
      .toAsyncIterator()
      .map(async ({ kioskId, objectId }) => {
        // find the AresRPG extension for the kiosk
        try {
          const extension = await kiosk_client.getKioskExtension({
            kioskId,
            type: `${types.PACKAGE_ID}::extension::AresRPG`,
          })

          if (!extension) return null

          return {
            storage_id: extension.storageId,
            kiosk_id: kioskId,
            personal_kiosk_cap_id: objectId,
          }
        } catch (error) {
          console.error('getKioskExtension error', error.message)
          return null
        }
      })
      // in case extension is not found, filter out
      .filter(Boolean)
      // retrieve the ObjectBag<String, Character>
      .map(async ({ storage_id, kiosk_id, personal_kiosk_cap_id }) => {
        try {
          // retrieve the ObjectBag<String, Character>
          const { data } = await sui_client.getDynamicFieldObject({
            parentId: storage_id,
            name: {
              type: 'vector<u8>',
              value: [...new TextEncoder().encode('items')],
            },
          })

          if (!data?.content) return null

          return {
            storage_id,
            kiosk_id,
            personal_kiosk_cap_id,
            // @ts-ignore
            object_bag_id: data.content.fields.value.fields.id.id,
          }
        } catch (error) {
          console.error('getDynamicFieldObject error', error)
          return null
        }
      })
      .filter(Boolean)
      .map(async ({ kiosk_id, object_bag_id, personal_kiosk_cap_id }) => {
        const items = await read_object_bag({
          sui_client,
          bag_id: object_bag_id,
        })

        return items
          .flat()
          .map(parse_sui_object)
          .map(item => ({
            ...item,
            is_aresrpg_item: true,
            kiosk_id,
            personal_kiosk_cap_id,
          }))
      })
      .toArray()

    return await iter(all_items.flat())
      .toAsyncIterator()
      .map(parse_item({ types, sui_client }))
      .toArray()
  }
}
