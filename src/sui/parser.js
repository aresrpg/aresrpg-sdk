import { get_items, get_purchase_caps } from './cache.js'

export function parse_character(context) {
  const { sui_client, types } = context

  /** @return {Promise<import("../../types.js").SuiCharacter>} */
  return async character => {
    if (character._type !== `${types.PACKAGE_ID}::character::Character`)
      return null

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

    const raw_purchase_caps = inventory.data.map(
      ({
        objectId,
        name: {
          value: { slot },
        },
      }) => ({ id: objectId, slot }),
    )
    const purchase_caps = await get_purchase_caps(context, raw_purchase_caps)
    const corresponding_ids = purchase_caps.map(({ item_id }) => item_id)
    const corresponding_items = await get_items(context, corresponding_ids)

    // @ts-ignore
    const items = purchase_caps
      .map(({ item_id, kiosk_id, slot }) => {
        const item = corresponding_items.get(item_id)
        if (!item) return null
        return {
          ...item,
          slot,
          id: item_id,
          kiosk_id,
        }
      })
      .filter(Boolean)

    return {
      ...character,
      item_type: 'character',
      item_category: 'character',
      item_set: 'none',
      amount: 1,
      inventory: null,
      position: JSON.parse(character.position),
      // @ts-ignore
      ...stats.data.content.fields.value.fields,
      ...items.reduce(
        (acc, item) => ({
          ...acc,
          [item.slot]: item,
        }),
        {},
      ),
    }
  }
}
