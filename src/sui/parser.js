import { get_dynamic_field_object, get_object } from './cache.js'
import { enforce_ares_item } from './supported_nfts.js'

export function parse_sui_object(object) {
  const {
    content: { fields },
    display,
  } = object.data
  return {
    _type: object.data.type ?? object.data.content.type,
    ...fields,
    image_url: display?.data?.image_url,
    name: display?.data?.name || fields.name,
    id: fields.id.id,
  }
}

export function parse_character(context) {
  const { sui_client, types } = context

  /** @return {Promise<import("../types.js").SuiCharacter>} */
  return async character => {
    const stats = await sui_client.getDynamicFieldObject({
      parentId: character.id,
      name: {
        type: `${types.PACKAGE_ID}::character_stats::StatsKey`,
        value: {
          dummy_field: false,
        },
      },
    })

    // @ts-ignore
    const inventory_id = character.inventory.fields.id.id

    const inventory = await sui_client.getDynamicFields({
      parentId: inventory_id,
    })

    const items = Object.fromEntries(
      await Promise.all(
        inventory.data.map(async ({ objectId, name: { value } }) => {
          const purchase_cap = await get_object(sui_client, {
            id: objectId,
            options: { showContent: true },
          })
          const { item_id, kiosk_id } = parse_sui_object(purchase_cap)
          const item = await get_object(sui_client, {
            id: item_id,
            options: { showContent: true, showDisplay: true },
          })

          const parsed_item = await enforce_ares_item(context, {
            ...parse_sui_object(item),
            kiosk_id,
          })
          const parsed = await parse_item({ sui_client, types })(parsed_item)
          return [value.slot, parsed]
        }),
      ),
    )

    return {
      ...character,
      position: JSON.parse(character.position),
      // @ts-ignore
      ...stats.data.content.fields.value.fields,
      ...items,
    }
  }
}

export function parse_item({ sui_client, types }) {
  /** @return {Promise<import("../types.js").SuiItem>} */
  return async item => {
    const stats = await get_dynamic_field_object(sui_client, {
      parentId: item.id,
      name: {
        type: `${types.PACKAGE_ID}::item_stats::StatsKey`,
        value: {
          dummy_field: false,
        },
      },
    })

    const damages = await get_dynamic_field_object(sui_client, {
      parentId: item.id,
      name: {
        type: `${types.PACKAGE_ID}::item_damages::DamagesKey`,
        value: {
          dummy_field: false,
        },
      },
    })

    // @ts-ignore
    const extracted_damages = damages.data?.content.fields.value.map(
      ({ fields }) => fields,
    )

    const final_item = {
      ...item,
      // @ts-ignore
      ...stats.data?.content.fields.value.fields,
      // @ts-ignore
      ...(extracted_damages && { damages: extracted_damages }),
    }

    if (!item.image_url) {
      const {
        data: { display },
      } = await get_object(sui_client, {
        id: item.id,
        options: { showDisplay: true },
      })

      if (display) {
        return {
          ...final_item,
          image_url: display?.data?.image_url,
          name: display?.data?.name,
        }
      }
    }

    return final_item
  }
}
