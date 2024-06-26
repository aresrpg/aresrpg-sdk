/** @param {import("../../../types.js").Context} context */
export function get_kiosk_id({ sui_client, types }) {
  return async character_id => {
    const { data } = await sui_client.getDynamicFieldObject({
      parentId: character_id,
      name: {
        type: `${types.PACKAGE_ID}::character::KioskIdKey`,
        value: {
          dummy_field: false,
        },
      },
    })

    // @ts-ignore
    return data.content.fields.value
  }
}
