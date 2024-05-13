export function parse_sui_object(object) {
  const { fields } = object.data.content
  return {
    _type: object.data.type ?? object.data.content.type,
    ...fields,
    id: fields.id.id,
  }
}

export function parse_character({ sui_client, types }) {
  /** @return {Promise<Type.SuiCharacter>} */
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

    console.dir({ inventory }, { depth: Infinity })

    return {
      ...character,
      position: JSON.parse(character.position),
      // @ts-ignore
      ...stats.data.content.fields.value.fields,
    }
  }
}

export function parse_item({ sui_client, types }) {
  /** @return {Promise<Type.SuiItem>} */
  return async item => {
    const stats = await sui_client.getDynamicFieldObject({
      parentId: item.id,
      name: {
        type: `${types.PACKAGE_ID}::item_stats::StatsKey`,
        value: {
          dummy_field: false,
        },
      },
    })

    const damages = await sui_client.getDynamicFieldObject({
      parentId: item.id,
      name: {
        type: `${types.PACKAGE_ID}::item_damages::DamagesKey`,
        value: {
          dummy_field: false,
        },
      },
    })

    const extracted_damages = damages.data?.content.fields.value.map(
      ({ fields }) => fields,
    )

    return {
      ...item,
      // @ts-ignore
      ...stats.data?.content.fields.value.fields,
      // @ts-ignore
      ...(extracted_damages && { damages: extracted_damages }),
    }
  }
}
