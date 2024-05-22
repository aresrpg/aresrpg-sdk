import { read_object_bag } from '../read_object_bag.js'
import { parse_character } from '../parser.js'
import { get_dynamic_field_object, parse_sui_object } from '../cache.js'

/** @param {import("../../../types.js").Context} context */
export function get_locked_characters({ kiosk_client, types, sui_client }) {
  /** @type {(address: string) => Promise<import("../../../types.js").SuiCharacter[]>} */
  return async address => {
    const { kioskOwnerCaps } = await kiosk_client.getOwnedKiosks({
      address,
    })

    const personal_kiosks = kioskOwnerCaps.filter(
      ({ isPersonal }) => !!isPersonal,
    )

    const character_promises = await Promise.all(
      personal_kiosks.flatMap(async ({ kioskId, objectId }) => {
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
              type: `${types.PACKAGE_ID}::extension::StorageKey<${types.PACKAGE_ID}::character::Character>`,
              value: {
                dummy_field: false,
              },
            },
          })

          // @ts-ignore
          const object_bag_id = data.content.fields.value.fields.id.id

          const all_characters = await read_object_bag({
            sui_client,
            bag_id: object_bag_id,
          })

          return all_characters
            .flat()
            .map(object => parse_sui_object({ types }, object))
            .map(character => ({
              ...character,
              kiosk_id,
              personal_kiosk_cap_id,
            }))
            .map(parse_character({ sui_client, types }))
        } catch (error) {
          console.error('getKioskExtension error', error.message)
          return null
        }
      }),
    )

    const result = await Promise.all(character_promises.flat())

    return result.filter(Boolean)
  }
}
